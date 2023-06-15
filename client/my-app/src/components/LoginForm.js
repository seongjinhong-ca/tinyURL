import React, { useState, useEffect } from 'react';
import axios from 'axios';

const init_email = '';
const init_password = '';
const init_isAllowSendRequest = false;

const LoginForm = () => {
  const [email, setEmail] = useState(init_email);
  const [password, setPassword] = useState(init_password);
  const [isAllowSendRequest, setIsAllowSendRequest] = useState(init_isAllowSendRequest);


  useEffect(() => {
    if (isAllowSendRequest && email && password) {
      // 사용자 정보를 백엔드로 전송
      sendLoginRequest();
      setIsAllowSendRequest(false);
    }
  }, [isAllowSendRequest, password, email]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const sendLoginRequest = async () => {
    try {
      // 사용자 정보를 백엔드로 전송
      const response = await axios.post('users/login', {
        email,
        password,
      });

      // 성공적으로 로그인 처리되면 리다이렉트 등의 작업 수행
      console.log('로그인 성공', response.data);
    } catch (error) {
      // 로그인 실패 처리
      console.error('로그인 실패', error.response.data);
    }
  };
  const allowSendLoginRequest = () => {
    setIsAllowSendRequest(true);
  }

  return (
    <form onSubmit={allowSendLoginRequest}>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />
      </div>
      <button> submit </button>
    </form>
  );
};

export default LoginForm;