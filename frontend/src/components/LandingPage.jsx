import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoImage from './css/images/logo.png';
import './css/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <div className="landing-page-logo-container">
        <img src={LogoImage} alt="Logo" className="landing-page-logo" />
      </div>
      <div className="landing-page-card">
        <h2 className="landing-page-title"></h2>
        <p className="landing-page-description">Experience the freshest connection between farmers and consumers with our innovative e-commerce platform!</p>
        <p className="landing-page-description">Designed in collaboration with the Department of Agriculture, this website revolutionizes how we access local produce. Farmers can showcase their products in a vibrant, ever-growing catalog, while customers enjoy direct, hassle-free transactions for high-quality, farm-fresh goods.</p>
        <div className="landing-page-buttons">
          <button className="landing-page-button landing-page-button-primary" onClick={() => navigate('/login_page')}>
            Login
          </button>
          <button className="landing-page-button landing-page-button-secondary" onClick={() => navigate('/signup_page')}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;