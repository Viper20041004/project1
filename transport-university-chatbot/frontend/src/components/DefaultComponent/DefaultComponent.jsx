import React from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import { Footer } from 'antd/es/layout/layout';
import FooterComponent from '../FooterComponent/FooterComponent';

const DefaultComponent = ({ children }) => {
  return (
    <>
      <HeaderComponent style={{ position: 'sticky', top: 0, zIndex: 1000 }} />
      {children}
      <FooterComponent />
    </>
  );
};
export default DefaultComponent