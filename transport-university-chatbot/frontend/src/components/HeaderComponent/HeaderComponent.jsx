import React from 'react'
import { Col, Row, Image, Menu } from 'antd';
import Logo from '../../assets/images/logo/logo.png';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import ButtonComponents from '../ButtonComponent/ButtonComponent';
import { WrapperHeader, WrapperStyleImageSmall, WrapperTextHearder, Title, Subtitle } from './style';
import { SearchOutlined } from '@ant-design/icons';
import { Children } from 'react';
import MenuComponent from '../MenuComponent/MenuComponent';
import { useNavigate } from 'react-router-dom';

const menuHeader = [
    { key: 'home', label: 'Trang chủ' },
    {
        key: 'about',
        label: 'Giới thiệu',
        children: [
            { label: 'Giới thiệu chung', key: 'gioithieu-chung' },
            { label: 'Chiến lược phát triển', key: 'chienluoc' },
            { label: 'Lịch sử hình thành', key: 'lichsu' },
            { label: 'Cơ cấu tổ chức', key: 'cocau' },
            { label: 'Chuyên ngành đào tạo', key: 'chuyennganh' },
            { label: 'Thông tin công khai', key: 'thongtin' },
        ]
    },
    {
        key: 'training',
        label: 'Đào tạo ',
        children: [
            { label: 'Các chuyên ngành đào tạo', key: 'chuyennganhdaotao' },
            { label: 'Chuẩn đầu ra ', key: 'chuandaura' },
            { label: 'Chương trình đào tạo ', key: 'chuongtrinhdaotao' },
            { label: 'Đề cương học phần ', key: 'decuonghocphan' },
            { label: 'Hệ đào tạo chính quy', key: 'hedaotaochinhquy' },
            { label: 'Hệ bằng hai ', key: 'hebanghai' },
            { label: 'Hệ sau đại học ', key: 'hesaudaihoc' },
            { label: 'Học trực tuyến ', key: 'hoctructuyen' },
            { label: 'Đào tạo trực tuyến  ', key: 'daotaotructuyen' },
            { label: 'Hệ liên kết quốc tế  ', key: 'helienketquocte' },
            { label: 'Văn bằng - Chứng chỉ  ', key: 'vanbangchungchi' },
        ]
    },
    {
        key: 'admission',
        label: 'Tuyển sinh',
        children: [
            { label: 'Đại học chính quy', key: 'daihocchinhquy' },
            { label: 'Bằng hai - Liên thông - Vừa học vừa làm ', key: 'banghai-lienthong' },
            { label: 'Sau đại học ', key: 'sau-dai-hoc' },
        ]
    },
    {
        key: 'science',
        label: 'Khoa học công nghệ',
        children: [
            { label: 'Giới thiệu chung', key: 'gioithieu2' },
            { label: 'Tạp chí , bài báo khoa học', key: 'tapchi-baibao' },
            { label: 'Hội nghị,hội thảo khoa học', key: 'hoinghi-hoithaokh' },
            { label: 'Nhiệm vụ khoa học các cấp', key: 'nhiemvu-khoahoc' },
            { label: 'Nghiên cứu CGCN', key: 'nghiencuu-cgcn' },
            { label: 'Sáng kiến , sở hữu trí tuệ', key: 'sang-kien-so-huu-tri-tue' },
            { label: 'Sản phẩm khoa học công nghệ', key: 'san-pham-khoa-hoc-cong-nghe' },
            { label: 'Văn bản quy định khác ', key: 'van-ban-quy-dinh-khac' },
        ]
    },
    {
        key: 'cooperation',
        label: 'Hợp tác',
        children: [
            { label: 'Giới thiệu', key: 'gioithieu3' },
            { label: 'Hợp tác quốc tế', key: 'hop-tac-quoc-te' },
            { label: 'Hợp tác trong nước', key: 'hop-tac-trong-nuoc' },
            { label: 'Các dự án quốc tế', key: 'du-an-quoc-te' },
        ]
    },
    {
        key: 'union',
        label: 'Đảng – Đoàn thể',
        children: [
            { label: 'Đảng bộ ', key: 'dangbo' },
            { label: 'Công đoàn ', key: 'congdoan' },
            { label: 'Đoàn TN - Hội SV ', key: 'doan-tn-hoi-sv' },
            { label: 'Cựu chiến binh ', key: 'cuu-chien-binh' },
        ]
    },
    {
        key: 'questions',
        label: '80 năm thành lập  ',
    },
];



import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slide/userSlide';

export const HeaderComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const handleNavigateLogin = () => {
        navigate('/sign-in');
    }
    const handleNavigateRegister = () => {
        navigate('/register');
    }

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };
    return (
        <>
            <WrapperHeader>
                <Col xs={6} sm={3} md={3} lg={2}>
                    <WrapperStyleImageSmall src={Logo} alt="Logo" preview={false} />
                </Col>

                <Col xs={12} sm={10} md={8} lg={7}>
                    <WrapperTextHearder>
                        <Title>TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI</Title>
                        <Subtitle>UNIVERSITY OF TRANSPORT AND COMMUNICATIONS</Subtitle>
                    </WrapperTextHearder>
                </Col>

                <Col xs={6} sm={10} md={13} lg={13} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, maxWidth: 520 }}>
                        <ButtonInputSearch
                            placeholder="Tìm kiếm thông tin"
                            size="middle"
                            bordered={true}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {user?.isAuthenticated ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontWeight: 600 }}>{user?.user?.username || user?.user?.email || 'User'}</span>
                                <ButtonComponents
                                    textButton="Đăng xuất"
                                    onClick={handleLogout}
                                    size="middle"
                                    styleButton={{ background: '#ff4d4f', borderRadius: '6px', border: 'none', padding: '6px 14px' }}
                                    styleTextButton={{ color: '#fff', fontWeight: 600, width: '80px' }}
                                />
                            </div>
                        ) : (
                            <>
                                <ButtonComponents
                                    textButton="Đăng nhập"
                                    onClick={handleNavigateLogin}
                                    size="middle"
                                    styleButton={{ background: '#0d6efd', borderRadius: '6px', border: 'none', padding: '6px 14px' }}
                                    styleTextButton={{ color: '#fff', fontWeight: 600, width: '80px' }}
                                />
                                <ButtonComponents
                                    textButton="Đăng ký"
                                    onClick={handleNavigateRegister}
                                    size="middle"
                                    styleButton={{ background: '#0d6efd', borderRadius: '6px', border: 'none', padding: '6px 14px' }}
                                    styleTextButton={{ color: '#fff', fontWeight: 600, width: '80px' }}
                                />
                            </>
                        )}
                    </div>
                </Col>
            </WrapperHeader>
            <MenuComponent
                items={menuHeader}
                defaultSelectedKeys={['home']}
                style={{
                    fontSize: 18,
                    background: '#fff',
                    borderBottom: '1px solid #e8e8e8',
                    justifyContent: 'center',
                    fontWeight: 500,
                }}
            />
        </>
    )
}

export default HeaderComponent