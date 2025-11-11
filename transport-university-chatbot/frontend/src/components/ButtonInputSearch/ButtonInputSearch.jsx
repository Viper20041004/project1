import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent.jsx/InputComponents";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
    const { size , placeholder , textButton,bordered,backgroundColorInput ='#fff',backgroundColorButton='rgb(13,92,182)',colorButton='#fff' } = props // truyền lại khi muốn dùng nhiều lần 
    return(
        <div style={{display:'flex'}}> 
            <InputComponent 
                size={size} 
                placeholder={placeholder} 
                bordered={bordered} 
                style={{backgroundColor: backgroundColorInput ,border: '1px solid rgba(0,0,0,0.2)', borderRadius: 4 }} 
            />
            <ButtonComponent
                size={size} 
                styleButton={{background: backgroundColorButton,border: !bordered &&  'none'}} 
                icon={<SearchOutlined color={colorButton} style={{color:'#fff'}} />}
                textButton={textButton}
                styleTextButton={{color: colorButton}}
                >
            </ButtonComponent>
        </div>
    )
}
export default ButtonInputSearch