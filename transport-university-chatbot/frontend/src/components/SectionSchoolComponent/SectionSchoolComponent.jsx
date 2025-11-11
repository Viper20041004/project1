import React from "react";
import MenuComponent from "../MenuComponent/MenuComponent";
import { Card } from "antd";
import styled from "styled-components";
import { WrapperSectionSchool } from "./styled";


const imagesCard = import.meta.glob('../../assets/images/card/*.{jpg,png}', { eager: true });
const cardImages = Object.entries(imagesCard).reduce((acc, [path, module]) => {
  const key = path.split('/').pop().split('.')[0];
  acc[key] = module.default;
  return acc;
}, {});
const menuItems = [
  { key: "branch", label: "Phân hiệu tại TP. Hồ Chí Minh" },
  { key: "faculty", label: "Các Khoa trực thuộc Trường" },
  { key: "unit", label: "Đơn vị chức năng" },
  { key: "admission", label: "Cổng thông tin tuyển sinh" },
  { key: "professor", label: "Xét Giáo sư - Phó giáo sư" },
  { key: "studentPortal", label: "Cổng thông tin sinh viên" },
  { key: "register", label: "Đăng ký học" },
  { key: "more", label: "Xem thêm" },
];

const cardItems = [
  { key: "1", label: "NHÀ TRƯỜNG ĐIỆN TỬ", image: cardImages['dangkyhoc'] },
  { key: "2", label: "THƯ VIỆN", image: cardImages['thuvien-dientu'] },
  { key: "3", label: "TẠP CHÍ KHOA HỌC GTVT", image: cardImages['tapchi-khoahoc-gtvt'] },
  { key: "4", label: "REVIEW 360", image: cardImages['review360'] },
  { key: "5", label: "CỔNG THÔNG TIN VIỆC LÀM", image: cardImages['job-utc-edu-vn'] },
  { key: "6", label: "LỊCH CÔNG TÁC", image: cardImages['lich-cong-tac'] },
  { key: "7", label: "ĐỘI NGŨ GIẢNG VIÊN", image: cardImages['doingu-giangvien'] },
  { key: "8", label: "VĂN BẢN", image: cardImages['van-ban'] },
  { key: "9", label: "THƯ VIỆN MEDIA", image: cardImages['thuvien-media'] },
];

const SectionSchoolComponent = () => {
  return (
    <WrapperSectionSchool>
      <div className="menu-section">
        <h5>CÁC KHOA - VIỆN - ĐƠN VỊ THUỘC TRƯỜNG:</h5>
        <MenuComponent
          items={menuItems}
          mode="vertical"
          defaultSelectedKeys={["branch"]}
          style={{
            borderRight: 0,
            fontWeight: 500,
            background: "transparent",
          }}
        />
      </div>

      <div className="card-section">
        {cardItems.map((item) => (
          <div key={item.key} className="school-card">
            <img src={item.image} alt={item.label} />
            <div className="overlay">{item.label}</div>
          </div>
        ))}
      </div>
    </WrapperSectionSchool>
  );
};

export default SectionSchoolComponent;
