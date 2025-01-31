import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { BE_Signup } from '../../../backend/signup_handler';
import './css/SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  // Connect to backend
  const {
    firstName, setFirstName,
    middleName, setMiddleName,
    lastName, setLastName,
    email, setEmail,
    username, setUsername,
    password, setPassword,
    userType, setUserType,
    handleSubmit
  } = BE_Signup();

  return (
    <>
      <Header />
      <div className="signup-page-container">
        <div className="signup-page-card">
          {/* <h2 className="signup-page-title">Sign Up</h2> */}
          <form className="signup-page-form" onSubmit={(e) => handleSubmit(e, navigate)}>
            {/* First Name Input */}
            <label className="signup-page-label">First Name</label>
            <input
              className="signup-page-input"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            {/* Middle Name Input (Optional) */}
            <label className="signup-page-label">Middle Name</label>
            <input
              className="signup-page-input"
              type="text"
              placeholder="Middle Name (Optional)"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />

            {/* Last Name Input */}
            <label className="signup-page-label">Last Name</label>
            <input
              className="signup-page-input"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            {/* Email Input */}
            <label className="signup-page-label">Email</label>
            <input
              className="signup-page-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Username Input */}
            <label className="signup-page-label">Username</label>
            <input
              className="signup-page-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {/* Password Input */}
            <label className="signup-page-label">Password</label>
            <input
              className="signup-page-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Submit Button */}
            <button className="signup-page-button" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
