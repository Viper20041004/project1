import { Image, Row } from "antd";
import styled from "styled-components";

export const WrapperFooter = styled(Row)`
  width: 100%;
  background: linear-gradient(180deg, #00377a 0%, #00285a 100%);
  color: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 40px 60px;
  flex-wrap: nowrap;

  @media (max-width: 992px) {
    flex-wrap: wrap;
    text-align: center;
  }
`;

export const WrapperImageFooter = styled(Image)`
  height: 60px;
  width: 60px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
`;

export const WrapperTextFooter = styled.p`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const WrapperTitleFooter = styled.div`
  font-size: 20px;
  color: #a3b7cf;
  margin-right: 18px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #5aa4ff;
  }
`;

export const WrapperIconGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 8px;
`;

export const WrapperMenuTitle = styled.h3`
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const WrapperMenuItem = styled.div`
  color: #a8b7ce;
  font-size: 14px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #5aa4ff;
    transform: translateX(5px);
  }
`;

export const WrapperMenuGroup = styled.div`
    border-radius: 10px;
    overflow: hidden;
    margin-top: 10px;
    iframe {
        width: 100%;
        height: 250px;
        border: 0;
    }
`