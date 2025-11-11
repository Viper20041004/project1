import { Image, Menu, Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  max-width: 1270px;
  margin: 0 auto;   
  padding: 14px 18px;
  background: #fff;
  border-bottom: 1px solid #322c2cff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 6px rgba(10, 50, 100, 0.08);
`

export const WrapperTextHearder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1;
`

export const Title = styled.span`
  font-size: 16px;
  color: #0a5fb8;
  font-weight: 700;
`;

export const Subtitle = styled.span`
  font-size: 11px;
  color: #f9d871;
  margin-top: 4px;
  letter-spacing: 0.6px;
`;

export const WrapperStyleImageSmall = styled(Image)`
  height:48px;
  width:48px;
  object-fit: cover;
  border-radius: 8px;
`

export const WrapperContentHeader = styled(Menu)`
    .ant-menu-item:hover {
        color: #0D5CB6 !important;
        background: rgba(13,92,182,0.05);
    }
    .ant-menu-item-selected {
        color: #0D5CB6 !important;
        border-bottom: 2px solid #0D5CB6;
    }
`