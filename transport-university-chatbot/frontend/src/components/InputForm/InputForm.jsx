  import React, { useState } from 'react';
  import { WrapperInputStyle } from './style';

  const InputForm = ({ placeholder = "Nhập text", value, handleOnChange, ...restProps }) => {
    const handleOnChangeInput = (e) => {
      handleOnChange(e.target.value)
    };
    return (
      <WrapperInputStyle
        placeholder={placeholder}
        value={value}
        onChange={handleOnChangeInput}
        {...restProps}
      />
      
    );
  };


  export default InputForm;
