import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, List, Typography, Spin, message } from 'antd';
import { UserOutlined, MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { authService } from '../../services/api';

const { Title } = Typography;

const DashboardPage = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user.isAuthenticated || !user.user?.is_admin) {
            message.error("Bạn không có quyền truy cập trang này!");
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const token = user.user?.access_token || localStorage.getItem('access_token');
                const response = await authService.getDashboardStats(token);
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
                message.error("Không thể tải thông tin thống kê.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, navigate]);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Admin Dashboard</Title>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Tổng số người dùng"
                            value={stats?.total_users}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Tổng số câu hỏi"
                            value={stats?.total_questions}
                            prefix={<MessageOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title={<><QuestionCircleOutlined /> Câu hỏi thường gặp</>}>
                <List
                    bordered
                    dataSource={stats?.frequent_questions}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text>{item}</Typography.Text>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default DashboardPage;
