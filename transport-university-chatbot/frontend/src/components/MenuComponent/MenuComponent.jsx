import React from 'react';
import { Menu } from 'antd';

const MenuComponent = ({ items, defaultSelectedKeys = [], mode = "horizontal", style = {}, onClick }) => {
  return (
    <Menu
      mode={mode}
      items={items}
      defaultSelectedKeys={defaultSelectedKeys}
      onClick={onClick}
      style={{ ...style }}
    />
  );
};

export default MenuComponent;
