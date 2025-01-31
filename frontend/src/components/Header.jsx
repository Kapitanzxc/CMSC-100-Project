import React from 'react';
import { Link } from 'react-router-dom';
import { BE_Header } from '../../../backend/header_handler';
import './css/Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  // Connect to backend
  const { isUserSignedIn, isAdminStatus, handleSignOut } = BE_Header();

  return (
    <nav>
      {/* User-specific Navigation */}
      {isUserSignedIn ? (
        <>
        <Link to='/main_page' className="back-link">
          <h1>
            <i className="fa-solid fa-angle-left"></i>
          </h1>
        </Link>
        <ul>
          {/* Admin Specific navigation */}
          {isAdminStatus ? (
            <>
              <li><Link to="/users_page" className="nav-link"><i className="fas fa-users"></i> Users</Link></li>
              <li><Link to="/transaction_page" className="nav-link"><i className="fas fa-shopping-cart"></i> Transactions</Link></li>
              <li><Link to="/salesreport_page" className="nav-link"><i className="fas fa-chart-line"></i> Sales Report</Link></li>
              <li><Link to="/addproduct" className="nav-link"><i className="fas fa-plus-circle"></i> Add Product</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/main_page" className="nav-link"><i className="fa-solid fa-store"></i> Products</Link></li>
              <li><Link to="/order_page" className="nav-link"><i className="fas fa-box"></i> Orders</Link></li>
            </>
          )}
        </ul>
        </>
      ) : (
        <>
        <Link to='/' className="back-link">
            <h1>
              <i className="fa-solid fa-house"></i>
            </h1>
        </Link>
        <ul>
          <li><Link to="/login_page" className="nav-link">Login</Link></li>
          <li><Link to="/signup_page" className="nav-link">Signup</Link></li>
        </ul>
        </>
      )}
    </nav>
  );
};

export default Header;