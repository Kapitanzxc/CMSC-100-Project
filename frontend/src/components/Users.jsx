import React from 'react';
import './css/admin_users.css';
import { BE_Header } from '../../../backend/header_handler';
import { BE_Users } from '../../../backend/users_handler';
import Header from './Header'

function Users() {
    // Connect to backend
    const { current_users } = BE_Users(); 
    const { isAdminStatus } = BE_Header();

    if (!isAdminStatus) {
        console.error('User is unauthorized to access this page.');
        return (
            <div className="unauthorized-message">
                <h2>Unauthorized Access</h2>
                <p>Please contact your administrator.</p>
            </div>
        );
    }

    // Interface
     return (
        <>
        <Header />
        <div className="sproducts-container">
            <h2>Total Users: {current_users.length}</h2>
            {/* Responsive Grid */}
            <div className="products-grid">
                {current_users.map((user) => (
                    <div className="product" key={user._id}>
                        <div className="product-name">
                            {user.firstName} {user.middleName} {user.lastName}
                        </div>
                        <div className="product-description">
                            <strong>Username:</strong> {user.username}
                        </div>
                        <div className="product-description">
                            <strong>Email:</strong> {user.email}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}

export default Users;
