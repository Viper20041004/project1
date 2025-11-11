import React, { useState } from 'react';
import { Checkbox } from 'antd';
import logo1 from '../../assets/images/logo/logo1.png';
import backgroundImg from '../../assets/images/logo/utc.png';
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  WrapperContainer,
  WrapperForm,
  WrapperLogo,
  WrapperInputGroup,
  WrapperInputIcon,
  WrapperTitle,
} from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleOnChangeEmail = (value) => setEmail(value);
  const handleOnChangePassword = (value) => setPassword(value);
  const handleOnChangeCheckbox = (e) => console.log(`checked = ${e.target.checked}`);
  const handleNavigateHome = () => {
    navigate('/');
  }

  return (
    <WrapperContainer background={backgroundImg}>
      <WrapperForm>
        <WrapperLogo src={logo1} alt="logo" preview={false} />
        <WrapperTitle>Đăng nhập hệ thống</WrapperTitle>

        <WrapperInputGroup>
          <WrapperInputIcon>
            <UserOutlined />
          </WrapperInputIcon>
          <InputForm
            placeholder="abc123@lms.utc.edu.vn"
            value={email}
            handleOnChange={handleOnChangeEmail}
            style={{ width: '100%', height: '40px', paddingLeft: '36px' }}
          />
        </WrapperInputGroup>

        <WrapperInputGroup>
          <WrapperInputIcon>
            <KeyOutlined />
          </WrapperInputIcon>
          <InputForm
            placeholder="Mật khẩu"
            type={isShowPassword ? 'text' : 'password'}
            value={password}
            handleOnChange={handleOnChangePassword}
            style={{ width: '100%', height: '40px', paddingLeft: '36px' }}
          />
          <span
            onClick={() => setIsShowPassword(!isShowPassword)}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
            }}
          >
            {isShowPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </span>
        </WrapperInputGroup>

        <div style={{ width: '100%', textAlign: 'left', marginBottom: 10 }}>
          <Checkbox onChange={handleOnChangeCheckbox}>Duy trì đăng nhập</Checkbox>
        </div>

        <ButtonComponent
          onClick={handleNavigateHome}
          size={20}
          styleButton={{
            background: 'rgb(11,116,229)',
            height: '45px',
            width: '100%',
            border: 'none',
            borderRadius: '6px',
            marginTop: '10px',
            boxShadow: '0 4px 10px rgba(11,116,229,0.3)',
          }}
          textButton="Đăng nhập"
          styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}
        />
      </WrapperForm>
    </WrapperContainer>
  );
};

export default SignInPage;
