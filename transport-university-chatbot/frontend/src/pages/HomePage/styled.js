import styled from "styled-components";
import { Col, Image, Row } from "antd";

export const WrapperHomePage = styled.div`
    width: 100%;
    background: #efefef;
`

export const WrapperBody1 = styled.div`
    display: flex;
    background: #efefef;
    gap:10px;
    padding: 10px;
    width: 100%;
    height: 100%;
    max-height: 540px;
`

export const WrapperSlide = styled.div`
    flex: 2;
    min-width: 0;
`
export const WrapperSectionSchool = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
`
export const WrapperBody2 = styled.div`
    background: #fff;
    padding: 40px 10px;
    .title {
        color: #FFCC00;
        font-size: 40px;
        text-align: center;
        font-weight: 700;
        margin-bottom: 40px;
    }
`

export const FeaturedContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    grid-auto-rows: 180px; 
    gap: 20px; 
    justify-items: center;
    align-items: center;
`

export const FeaturedContent = styled.div`
  display: flex;
  flex-direction: ${({ $reverse }) => ($reverse ? 'row-reverse' : 'row')};
  width: 100%;   
  height: 100%; 
  gap: 20px;
`

export const FeaturedText = styled.div`
    flex: 1;
    p {
        margin: 5px 0;
        font-size: 14px;
        width:70%;
    }
    .read-more {
        color: #f2ab00;
        cursor: pointer;
    }
`

export const FeaturedDate = styled.div`
    display: flex;
    align-items: center;
    .month {
        font-size: 18px;
        color: #f2ab00;
        margin-right: 5px;
    }
    .day {
        font-size: 40px;
        color: #d2d2d2;
        line-height: 1;
    }
`

export const FeaturedImage = styled(Image)`
    object-fit: cover;
    border-radius: 8px;
`

export const WrapperBody3 = styled(Row)`
    width: 100%;
    height: 250px;
    background: linear-gradient(135deg, #00285a 0%, #003f91 50%, #005bbb 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
`

export const WrapperNumberBody3 = styled.h1`
    font-size: 48px;
    font-weight: 800;
    color: #ffcc00;
    margin: 0;
    transition: transform 0.3s ease, color 0.3s ease;

    &:hover {
        transform: scale(1.15);
        color: #ffffff;
    }
`

export const WrapperTextBody3 = styled.h3`
    font-size: 18px;
    color: #ffffff;
    font-weight: 500;
    letter-spacing: 0.5px;
    margin-top: 8px;
    opacity: 0.9;
`

export const WrapperBody4 = styled(Row)`
  width: 100%;
  min-height: 600px;
  display: flex;
  align-items: stretch;
  position: relative;
  background: #fff;
  overflow: hidden;
  /* Nền vàng bo tròn bên trái */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 55%;
    height: 100%;
    background: linear-gradient(135deg, #fab101 0%, #f9c757 100%);
    border-radius: 0 120px 120px 0;
    z-index: 1;
    box-shadow: 15px 0 40px rgba(250, 177, 1, 0.15);
    transition: all 0.4s ease;
  }

  /* Hiệu ứng khi hover toàn bộ section */
  &:hover::before {
    width: 58%;
  }

  @media (max-width: 992px) {
    flex-direction: column;
    min-height: auto;
    margin: 80px 0;

    &::before {
      width: 100%;
      height: 45%;
      border-radius: 0 0 80px 80px;
      box-shadow: none;
    }

    &:hover::before {
      height: 48%;
    }
  }

  @media (max-width: 576px) {
    &::before {
      border-radius: 0 0 60px 60px;
    }
  }
`;

export const WrapperBody4Left = styled(Col)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 80px;
  position: relative;
  z-index: 2;

  @media (max-width: 992px) {
    padding: 50px 30px;
    order: 2;
  }

  @media (max-width: 576px) {
    padding: 40px 20px;
  }
`;

export const WrapperBody4Right = styled(Col)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
  position: relative;
  z-index: 2;

  @media (max-width: 992px) {
    padding: 0 30px 50px;
    order: 1;
  }
`;

export const WrapperBody4Title = styled.h1`
  font-size: 46px;
  font-weight: 800;
  font-family: "GoogleSans-Bold", sans-serif;
  margin-bottom: 28px;
  text-transform: uppercase;
  line-height: 1.2;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 80px;
    height: 5px;
    background: #ffcc00;
    border-radius: 3px;
    transition: width 0.4s ease;
  }

  &:hover::after {
    width: 120px;
  }

  @media (max-width: 992px) {
    font-size: 38px;
  }

  @media (max-width: 576px) {
    font-size: 32px;
  }
`;

export const WrapperBody4Text = styled.p`
  font-size: 18px;
  line-height: 1.9;
  font-family: "GoogleSans-Regular", sans-serif;
  text-align: justify;
  color: ${({ color }) => color || "#000"};
  margin: 0;
  max-width: 90%;

  @media (max-width: 992px) {
    font-size: 17px;
    max-width: 100%;
  }
`;

export const WrapperBody4Image = styled(Image)`
  width: 100%;
  max-width: 520px;
  height: 480px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.22);
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform: translateY(-30px);
  position: relative;
  z-index: 3;

  &:hover {
    transform: translateY(-45px) scale(1.04);
    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 992px) {
    height: 340px;
    max-width: 100%;
    transform: translateY(-20px);
    border-radius: 18px;

    &:hover {
      transform: translateY(-30px) scale(1.02);
    }
  }

  @media (max-width: 576px) {
    height: 280px;
  }
`;

export const WrapperBody6 = styled(Row)`
  width: 100%;
  min-height: 500px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 50%, #eef5ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 60px;
  gap: 40px;
  text-align: center;

  @media (max-width: 992px) {
    flex-direction: column;
    padding: 60px 30px;
  }

  @media (max-width: 576px) {
    padding: 40px 20px;
  }
`;

export const WrapperBody6Card = styled(Col)`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 40, 90, 0.08);
  padding: 40px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.4s ease;
  border-top: 5px solid #ffcc00;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 45px rgba(0, 40, 90, 0.15);
  }

  @media (max-width: 992px) {
    padding: 30px 20px;
  }

  @media (max-width: 576px) {
    padding: 25px 15px;
  }
`;

export const WrapperBody6Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #00285a;
  margin-bottom: 20px;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #ffcc00;
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  ${WrapperBody6Card}:hover &::after {
    width: 90px;
  }

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

export const WrapperBody6Text = styled.p`
  font-size: 16px;
  color: #003366;
  line-height: 1.8;
  text-align: justify;
  opacity: 0.95;
  margin-top: 15px;
  max-width: 90%;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;



export const WrapperBody5 = styled.div`
    width: 100%;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 80px 100px;
    background: linear-gradient(135deg, #f9fbff 0%, #e8f0ff 45%, #dce9ff 100%);
`

export const WrapperBody5Left = styled.div`
    width: 45%;
    display: flex;
    flex-direction: column;
    gap: 25px;
    color: #00285a;
    font-size: 18px;
    line-height: 1.8;
    font-weight: 500;
    text-align: justify;
    letter-spacing: 0.4px;
    z-index: 2;
    border-left: 4px solid #ffcc00;
    padding-left: 25px;
`

export const WrapperBody5Text = styled.span`
    display: block;
    font-size: 17px;
    line-height: 1.8;
    color: #003366;
`

export const WrapperBody5Image = styled(Image)`
    width: 50%;
    border-radius: 18px;
    box-shadow: 0 10px 35px rgba(0, 40, 90, 0.25);
    transition: all 0.5s ease;
    z-index: 2;
    margin-left: 100px;
`
