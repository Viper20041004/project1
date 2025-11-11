import styled from 'styled-components';
import { Image } from 'antd';

export const WrapperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ background }) => `url(${background}) no-repeat center center/cover`};
  height: 100vh;
  padding: 20px;
`;

export const WrapperForm = styled.div`
  width: 420px;
  background: #ffffffcc;
  backdrop-filter: blur(8px);
  border-radius: 10px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
`;

export const WrapperLogo = styled(Image)`
  width: 80px;
  height: auto;
  margin-bottom: 20px;
`;

export const WrapperTitle = styled.h1`
  font-size: 24px;
  color: #0b74e5;
  margin-bottom: 30px;
`;

export const WrapperInputGroup = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 18px;
`;

export const WrapperInputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999; 
  font-size: 18px;
  z-index: 2;
`;

