import React from 'react';
import { BE_Header } from '../../../backend/header_handler';
import './css/Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const DashboardHeader = () => {
  // Connect to backend
  const { isAdminStatus } = BE_Header();

  return (
    <nav>
      {isAdminStatus ? (
        <h1 className="title" style={{color: '#FFFFFF', cursor: 'default'}}>
          Admin Dashboard
        </h1>
      ):(
        <h1 className="title" style={{color: '#FFFFFF', cursor: 'default'}}>
          Products
        </h1>
      )}
      
    </nav>
  );
};

export default DashboardHeader;