import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BE_Header } from '../../../backend/header_handler';
import './css/BurgerMenu.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LogoImage from './css/images/menu_logo.png'; 

const BurgerMenu = ({ onMenuToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAdminStatus, handleSignOut } = BE_Header();

    const toggleMenu = () => {
        const newOpenState = !isOpen;
        setIsOpen(newOpenState);
        // Notify parent component about menu state
        onMenuToggle(newOpenState);
    };

    return (
        <div className="burger-menu-container">
            <button 
                className={`burger-icon ${isOpen ? 'open' : ''}`} 
                onClick={toggleMenu}
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
            
            {isOpen && (
                <>
                    <img src={LogoImage} alt="Logo" className="menu-logo" />
                    <div className="burger-menu-content">
                        <div className="menu-header">
                        </div>
                        <div className="menu-sections">
                            {isAdminStatus ? (
                                <ul className="main-menu">
                                    <li>
                                        <Link to="/main_page" className="menu-link" onClick={toggleMenu}>
                                            <i className="fa-solid fa-house"></i> Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/users_page" className="menu-link" onClick={toggleMenu}>
                                            <i className="fas fa-users"></i> Users
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/transaction_page" className="menu-link" onClick={toggleMenu}>
                                            <i className="fas fa-shopping-cart"></i> Transactions
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/salesreport_page" className="menu-link" onClick={toggleMenu}>
                                            <i className="fas fa-chart-line"></i> Sales Report
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/addproduct" className="menu-link" onClick={toggleMenu}>
                                            <i className="fas fa-plus-circle"></i> Products
                                        </Link>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="main-menu">
                                    <li>
                                        <Link to="/main_page" className="menu-link" onClick={toggleMenu}>
                                            <i className="fa-solid fa-store"></i> Products
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/order_page" className="menu-link" onClick={toggleMenu}>
                                            <i className="fas fa-box"></i> Orders
                                        </Link>
                                    </li>
                                </ul>
                            )}
                            
                            <ul className="user-menu">
                                <li>
                                    <button 
                                        className="menu-link" 
                                        onClick={() => { toggleMenu(); handleSignOut(); }}
                                    >
                                        <i className="fas fa-sign-out-alt"></i> Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default BurgerMenu;