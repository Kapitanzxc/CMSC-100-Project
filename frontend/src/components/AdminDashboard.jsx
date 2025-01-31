import React from 'react';
import { Link } from 'react-router-dom';
import './css/admin_dashboard.css';
import DashboardHeader from './DashboardHeader';

function AdminDashboard() {
    return (
        <div className="admin-dashboard-layout">
            <DashboardHeader />
            <div className="admin-page-container">
                <div className="main-content">
                    <div className="dashboard-cards-container">
                        {/* Users Card */}
                        <Link to="/users_page" className="dashboard-card">
                            <div className="icon-container">
                                <img src="/images/users_icon.png" alt="Users" />
                            </div>
                            <div className="card-content">
                                <h2>Users</h2>
                                <p>Manage all registered users.</p>
                            </div>
                        </Link>

                        {/* Transactions Card */}
                        <Link to="/transaction_page" className="dashboard-card">
                            <div className="icon-container">
                                <img src="/images/transactions_icon.png" alt="Transactions" />
                            </div>
                            <div className="card-content">
                                <h2>Transactions</h2>
                                <p>View and manage all orders.</p>
                            </div>
                        </Link>

                        {/* Sales Report Card */}
                        <Link to="/salesreport_page" className="dashboard-card">
                            <div className="icon-container">
                                <img src="/images/sales_icon.png" alt="Sales Report" />
                            </div>
                            <div className="card-content">
                                <h2>Sales Report</h2>
                                <p>Track income and completed transactions.</p>
                            </div>
                        </Link>

                        {/* Products Card */}
                        <Link to="/addproduct" className="dashboard-card">
                            <div className="icon-container">
                                <img src="/images/products_icon.png" alt="Products" />
                            </div>
                            <div className="card-content">
                                <h2>Products</h2>
                                <p>Add, edit, and manage products.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminDashboard;
