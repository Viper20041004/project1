import React, { useState } from 'react';
import { Checkbox, message } from 'antd';
import logo1 from '../../assets/images/logo/logo1.png';
import backgroundImg from '../../assets/images/logo/utc.png';
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { authService } from '../../services/api';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slide/userSlide';
import { jwtDecode } from "jwt-decode";


const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const user = useSelector((state) => state.user);

  const handleOnChangeEmail = (value) => setEmail(value);
  const handleOnChangePassword = (value) => setPassword(value);
  const handleOnChangeCheckbox = (e) => console.log(`checked = ${e.target.checked}`);

  const handleLogin = async () => {
    console.log('[DEBUG] ===== LOGIN START =====');
    console.log('[DEBUG] Username (email):', email);
    console.log('[DEBUG] Password provided:', password ? 'YES' : 'NO');
    dispatch(loginStart());
    try {
      console.log('[DEBUG] Step 1: Calling authService.loginJson...');
      const response = await authService.loginJson(email, password);
      console.log('[DEBUG] Step 2: Login response:', response);
      console.log('[DEBUG] Step 2a: response.data:', response.data);

      const { access_token } = response.data;
      console.log('[DEBUG] Step 3: access_token:', access_token ? 'TOKEN_RECEIVED' : 'NO_TOKEN');

      localStorage.setItem('access_token', access_token);
      console.log('[DEBUG] Step 4: Token saved to localStorage');
      console.log('[DEBUG] Step 4a: Verify localStorage:', localStorage.getItem('access_token') ? 'EXISTS' : 'NOT_FOUND');

      // Fetch full user details - pass token directly to avoid interceptor timing issues
      console.log('[DEBUG] Step 5: Calling authService.getMe with token...');
      const userDetails = await authService.getMe(access_token);
      console.log('[DEBUG] Step 6: User details:', userDetails.data);

      dispatch(loginSuccess({ ...userDetails.data, access_token }));
      message.success("Đăng nhập thành công!");
      console.log('[DEBUG] Step 7: SUCCESS - Navigating to /');
      navigate('/');
    } catch (error) {
      console.log('[DEBUG] ===== LOGIN ERROR =====');
      console.log('[DEBUG] Error object:', error);
      console.log('[DEBUG] Error response:', error.response);
      console.log('[DEBUG] Error response status:', error.response?.status);
      console.log('[DEBUG] Error response data:', error.response?.data);

      let errorMsg = "Đăng nhập thất bại";
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          errorMsg = detail.map(e => e.msg).join(', ');
        } else {
          errorMsg = detail;
        }
      }

      dispatch(loginFailure(errorMsg));
      message.error(errorMsg);
    }
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
            placeholder="Tên đăng nhập / Email"
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
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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

        <div style={{ width: '100%', textAlign: 'left', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Checkbox onChange={handleOnChangeCheckbox}>Duy trì đăng nhập</Checkbox>
          <p onClick={() => navigate('/register')} style={{ fontSize: '15px', marginTop: '15px', fontWeight: 100, cursor: 'pointer', color: '#0b74e5' }}>Tạo tài khoản? </p>
        </div>

        <ButtonComponent
          onClick={handleLogin}
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
          textButton={user.isLoading ? "Đang xử lý..." : "Đăng nhập"}
          styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}
          disabled={user.isLoading}
        />
      </WrapperForm>
    </WrapperContainer>
  );
};

export default SignInPage;
