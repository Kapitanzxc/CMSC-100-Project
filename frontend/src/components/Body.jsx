import React, { useState } from 'react';
import Products from './Products.jsx';
import ShoppingCart from './Shopping_Cart.jsx';
import BurgerMenu from './BurgerMenu.jsx';
import { BE_Header } from '../../../backend/header_handler.js';
import AdminDashboard from './AdminDashboard.jsx';
import DashboardHeader from './DashboardHeader';

// Body component
function Body() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAdminStatus } = BE_Header();

    const handleMenuToggle = (open) => {
        setIsMenuOpen(open);
    };

    return (
        <div className="body-container">
            <div className={`left-container ${isMenuOpen ? 'menu-open' : ''}`}>
                <BurgerMenu onMenuToggle={handleMenuToggle} />
            </div>
            <div className={`main-content ${isMenuOpen ? 'compressed' : ''}`}>
                {isAdminStatus ? (
                    <>
                        <AdminDashboard />
                    </>
                    
                ) : (
                    <>
                        <DashboardHeader />
                        <Products />
                        <ShoppingCart />
                    </>
                )}
            </div>
        </div>
    );
}

export default Body;