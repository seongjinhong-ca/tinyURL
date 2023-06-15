import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LoginFormProps {
  // Add any additional props needed
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (email && password) {
      // 사용자 정보를 백엔드로 전송
      sendLoginRequest();
    }
  }, [email, password]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <form>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />
      </div>
    </form>
  );
};

export default LoginForm;