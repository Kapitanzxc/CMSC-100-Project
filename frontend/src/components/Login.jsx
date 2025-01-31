import React from 'react';
import Header from './Header';
import { BE_Login } from '../../../backend/login_handler';
import LogoImage from './css/images/logo.png'; 
import './css/Login.css';

const Login = () => {
  // Connect to backend
  const { username, setUsername, password, setPassword, handleLogin } = BE_Login();

  return (
    <>
      <Header />
      <div className="login-page-container">
        <div className="login-page-logo-container">
          <img src={LogoImage} alt="Logo" className="login-page-logo" />
        </div>
        <div className="login-page-card">
          {/* <h2 className="login-page-title">Login</h2> */}
          <form className="login-page-form" onSubmit={handleLogin}>
            <label className="login-page-label">Username</label>
            <input
              className="login-page-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="login-page-label">Password</label>
            <input
              className="login-page-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-page-button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;