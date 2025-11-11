import styled from "styled-components";

export const WrapperSectionSchool = styled.div`
  margin: 0px auto;
  width: 100%;
  max-width: 1200px;
  background: #f5f5f5;
  padding: 10px;

  .menu-section {
    background: #0056d2;
    border-bottom: 5px solid #0cf3ef;
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    margin-bottom: 20px;

    h5 {
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .ant-menu {
      background: transparent;
      border: none;
      color: #fff;
      column-count: 2;
      column-gap: 30px;
    }

    .ant-menu-item {
      color: #fff !important;
      font-weight: 500;
      font-size: 13px;
      line-height: 1.8;
      height: 25px;
    }

    .ant-menu-item:hover {
      color: #ffcc00 !important;
    }

    .ant-menu-item-selected {
      background: transparent !important;
      color: #ffcc00 !important;
    }
  }

  .card-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .school-card {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    cursor: pointer;
    height: 100px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      text-align: center;
      padding: 8px;
      transition: background 0.3s ease;
      text-transform: uppercase;
    }

    &:hover img {
      transform: scale(1.1);
    }

    &:hover .overlay {
      background: rgba(0, 0, 0, 0.6);
    }
  }
`;
