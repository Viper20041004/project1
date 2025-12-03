import React, { useState } from 'react';
import { Checkbox } from 'antd';
import logo1 from '../../assets/images/logo/logo1.png';
import backgroundImg from '../../assets/images/logo/utc.png';
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, KeyOutlined, GoogleOutlined, GithubOutlined, TwitterOutlined, FacebookOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  WrapperContainer,
  WrapperForm,
  WrapperLogo,
  WrapperInputGroup,
  WrapperInputIcon,
  WrapperTitle,
} from './style';
import {  WrapperSocials, SocialIcon } from './style';
import InputForm from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleOnChangeEmail = (value) => setEmail(value);
  const handleOnChangePassword = (value) => setPassword(value);
  const handleOnChangeConfirmPassword = (value) => setConfirmPassword(value);
  const handleNavigateHome = () => {
    navigate('/');
  }

  const handleRegister = () => {
    let ok = true;
    setEmailError('');
    setPasswordError('');
    setConfirmError('');

    message.success('Đăng ký thành công');
    navigate('/');
  }

  return (
    <WrapperContainer background={backgroundImg}>
      <WrapperForm>
        <WrapperLogo src={logo1} alt="logo" preview={false} />
        <WrapperTitle>Đăng ký hệ thống</WrapperTitle>

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
          {emailError && <div style={{ color: '#f5222d', fontSize: 12, textAlign: 'left', marginTop: 6 }}>{emailError}</div>}
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
          {passwordError && <div style={{ color: '#f5222d', fontSize: 12, textAlign: 'left', marginTop: 6 }}>{passwordError}</div>}
        </WrapperInputGroup>

        <WrapperInputGroup>
          <WrapperInputIcon>
            <KeyOutlined />
          </WrapperInputIcon>
          <InputForm
            placeholder="Xác nhận mật khẩu"
            type={isShowPassword ? 'text' : 'password'}
            value={confirmPassword}
            handleOnChange={handleOnChangeConfirmPassword}
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
            {confirmError && <div style={{ color: '#f5222d', fontSize: 12, textAlign: 'left', marginTop: 6 }}>{confirmError}</div>}
        </WrapperInputGroup>

        <div style={{ width: '100%', textAlign: 'left', marginBottom: 10 , display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>Đã có tài khoản ?<span onClick={() => navigate('/sign-in')} style={{fontSize:'15px' , marginTop:'15px' , fontWeight: 400 , cursor: 'pointer', color:'#0b74e5'}}> Đăng nhập</span></p>
        </div>

        <WrapperSocials>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>hoặc</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <SocialIcon aria-label="google">
              <GoogleOutlined />
            </SocialIcon>
            <SocialIcon aria-label="github">
              <GithubOutlined />
            </SocialIcon>
            <SocialIcon aria-label="twitter">
              <TwitterOutlined />
            </SocialIcon>
            <SocialIcon aria-label="facebook">
              <FacebookOutlined />
            </SocialIcon>
          </div>
        </WrapperSocials>

        <ButtonComponent
          onClick={handleRegister}
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
          textButton="Đăng ký"
          styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}
        />
      </WrapperForm>
    </WrapperContainer>
  );
};

export default RegisterPage;
