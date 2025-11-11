import { Col, Row } from 'antd'
import React from 'react'
import {WrapperFooter,WrapperImageFooter,WrapperTextFooter,WrapperTitleFooter,WrapperMenuTitle,WrapperMenuItem,WrapperIconGroup, WrapperMenuGroup} from './style';
import logoFooter from '../../assets/images/logo/logofooter-gtvt.png';
import { FacebookOutlined , YoutubeOutlined , TwitterOutlined , GooglePlusOutlined } from '@ant-design/icons';
import MenuComponent from '../MenuComponent/MenuComponent';

const FooterComponent = () => {
  return (
      <WrapperFooter>
        <Col span={8}>
          <WrapperImageFooter src={logoFooter} alt="logo" preview={false} />
          <WrapperTextFooter> 
              Địa chỉ: Số 3 phố Cầu Giấy, Phường Láng, TP. Hà Nội.<br /> 
              Điện thoại: (84.24) 37663311 - Fax: (84.24)37669613<br /> 
              Email: dhgtvt@utc.edu.vn 
          </WrapperTextFooter>
          <WrapperTextFooter> 
              <span style={{fontSize:'17px' , fontWeight:'bold'}} >PHÂN HIỆU TẠI THÀNH PHỐ HỒ CHÍ MINH</span> <br /> 
              Địa chỉ: 450-451 Đường Lê Văn Việt, Phường Tăng Nhơn Phú, TP. Hồ Chí Minh <br /> 
              Điện thoại: (84.28) 38966798 - Fax: (84.28)38964736 <br /> Email: info@utc2.edu.vn <br /> 
              website: http://phanhieu.utc.edu.vn 
          </WrapperTextFooter>
          <p style={{ color: '#5a8ac4', margin: '10px 0', fontWeight: 600, textTransform: 'uppercase' }}>
            Theo dõi UTC
          </p>
          <WrapperIconGroup>
            <WrapperTitleFooter><FacebookOutlined /></WrapperTitleFooter>
            <WrapperTitleFooter><YoutubeOutlined /></WrapperTitleFooter>
            <WrapperTitleFooter><TwitterOutlined /></WrapperTitleFooter>
            <WrapperTitleFooter><GooglePlusOutlined /></WrapperTitleFooter>
          </WrapperIconGroup>
        </Col>

        <Col span={8}>
          <Row gutter={32} style={{ padding: '30px 0' }}>
            <Col span={12}>
              <WrapperMenuTitle>Tiện ích</WrapperMenuTitle>
              <WrapperMenuItem>Văn bản</WrapperMenuItem>
              <WrapperMenuItem>Video</WrapperMenuItem>
              <WrapperMenuItem>Thư viện ảnh</WrapperMenuItem>
              <WrapperMenuItem>Lịch công tác</WrapperMenuItem>
              <WrapperMenuItem>Đội ngũ giảng viên</WrapperMenuItem>
            </Col>

            <Col span={12}>
              <WrapperMenuTitle>Truy cập nhanh</WrapperMenuTitle>
              <WrapperMenuItem>Thư viện</WrapperMenuItem>
              <WrapperMenuItem>Tạp chí Khoa học GTVT</WrapperMenuItem>
              <WrapperMenuItem>Nhà trường điện tử (Nội bộ)</WrapperMenuItem>
              <WrapperMenuItem>Văn phòng điện tử (Nội bộ)</WrapperMenuItem>
              <WrapperMenuItem>Đăng ký học</WrapperMenuItem>
              <WrapperMenuItem>Bộ Giáo dục & Đào tạo</WrapperMenuItem>
            </Col>
          </Row>
        </Col>

        <Col span={8} style={{ padding: '30px' }}>
          <div>
            <WrapperTextFooter>Trường đại học Giao thông Vận tải</WrapperTextFooter><br />
              <WrapperMenuGroup>
                  <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1131159426272!2d105.80084557471436!3d21.02815948780023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab424a50fff9%3A0xbe3a7f3670c0a45f!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBHaWFvIFRow7RuZyBW4bqtbiBU4bqjaQ!5e0!3m2!1svi!2s!4v1761474230009!5m2!1svi!2s"
                  allowFullScreen=""
                  loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </WrapperMenuGroup>
        </div>
      </Col>
    </WrapperFooter>
  )
}

export default FooterComponent