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
  width: 100%;
  max-width: 520px;
  background: #ffffffcc;
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 44px 36px;
  text-align: left;
  box-shadow: 0 10px 30px rgba(8, 36, 71, 0.12);
  border: 1px solid rgba(11, 116, 229, 0.06);
`;

export const WrapperLogo = styled(Image)`
  width: 84px;
  height: 84px;
  object-fit: contain;
  margin: 0 auto 18px;
`;

export const WrapperTitle = styled.h1`
  font-size: 24px;
  color: #0b74e5;
  text-align: center;
  margin-bottom: 30px;
`;

export const ErrorText = styled.div`
  color: #f5222d;
  font-size: 12px;
  text-align: left;
  margin-top: 6px;
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

export const WrapperButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  margin-top: 8px;
  border-radius: 10px;
  background: linear-gradient(90deg, #0b74e5 0%, #0a6ad1 100%);
  color: #fff;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  box-shadow: 0 8px 20px rgba(11, 116, 229, 0.12);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;

  &:hover { transform: translateY(-2px); }
  &:active { transform: translateY(0); opacity: 0.96; }
`;

export const SmallLink = styled.a`
  display: inline-block;
  margin-top: 14px;
  color: #0b74e5;
  font-size: 13px;
`;

export const WrapperSocials = styled.div`
  position: relative;
  width: 100%;
  margin: 8px 0 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const SocialIcon = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(11,116,229,0.08);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #0b74e5;
  font-size: 16px;
  box-shadow: 0 6px 18px rgba(11,116,229,0.04);
  transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 30px rgba(11,116,229,0.12);
    background: linear-gradient(90deg, rgba(11,116,229,0.06), rgba(10,106,209,0.06));
  }
`;

