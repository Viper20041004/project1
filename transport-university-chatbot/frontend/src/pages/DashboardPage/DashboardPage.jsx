import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, List, Typography, Spin, message, Upload, Button } from 'antd';
import { UserOutlined, MessageOutlined, QuestionCircleOutlined, UploadOutlined, FilePdfOutlined } from '@ant-design/icons';
import { authService, adminService } from '../../services/api';

const { Title } = Typography;

const DashboardPage = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

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

    const handleUpload = async ({ file, onSuccess, onError }) => {
        setUploading(true);
        try {
            await adminService.uploadPdf(file);
            message.success(`${file.name} đã được tải lên và xử lý thành công.`);
            onSuccess("ok");
        } catch (error) {
            console.error(error);
            message.error(`Tải lên thất bại: ${error.response?.data?.detail || error.message}`);
            onError(error);
        } finally {
            setUploading(false);
        }
    };

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

            <Card title={<><FilePdfOutlined /> Quản lý tài liệu (Knowledge Base)</>} style={{ marginBottom: '24px' }}>
                <p>Tải lên tài liệu PDF mới để cập nhật kiến thức cho Chatbot. Quá trình xử lý (Embedding) sẽ diễn ra tự động.</p>
                <Upload
                    customRequest={handleUpload}
                    showUploadList={false}
                    accept=".pdf"
                >
                    <Button icon={<UploadOutlined />} loading={uploading} type="primary">
                        {uploading ? 'Đang xử lý...' : 'Upload PDF'}
                    </Button>
                </Upload>
            </Card>

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
