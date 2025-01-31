import React from 'react';
import Header from './Header.jsx'; // Adjust the import path as needed
import { BE_Orders } from '../../../backend/order_handler';
import './css/Orders.css';

function Orders() {
  // Connect to backend
  const { cancel, activeTab, setActiveTab, orders } = BE_Orders();

  return (
    <>
      <Header />
      <div className="orders-container">
        {/* Tabs */}
        <div className="orders-nav">
          <button 
            onClick={() => setActiveTab('pending')} 
            disabled={activeTab === 'pending'}
          >
            Pending Orders
          </button>
          <button 
            onClick={() => setActiveTab('completed')} 
            disabled={activeTab === 'completed'}
          >
            Completed Orders
          </button>
          <button 
            onClick={() => setActiveTab('cancelled')} 
            disabled={activeTab === 'cancelled'}
          >
            Cancelled Orders
          </button>
        </div>

        {/* Number of items */}
        <h2 className="orders-header">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders (Total Items: {orders.length})
        </h2>

        {/* Map the products */}
        {orders.map((transaction) => (
          <div key={transaction.transactionId} className="order-card">
            {/* Transaction ID */}
            <div className="order-card-detail">
              <strong>Transaction ID:</strong> 
              <span>{transaction.transactionId}</span>
            </div>
            
            {/* Order Quantity */}
            <div className="order-card-detail">
              <strong>Quantity:</strong> 
              <span>{transaction.orderQuantity}</span>
            </div>
            
            {/* Product Name */}
            <div className="order-card-detail">
              <strong>Product:</strong> 
              <span>{transaction.name}</span>
            </div>
            
            {/* Order Status */}
            <div className="order-card-detail">
              <strong>Status:</strong> 
              <span 
                className={`order-status ${
                  transaction.orderStatus === 0 ? 'order-status-pending' : 
                  transaction.orderStatus === 1 ? 'order-status-completed' : 'order-status-cancelled'
                }`}
              >
                {transaction.orderStatus === 0 ? 'Pending' : 
                 transaction.orderStatus === 1 ? 'Completed' : 'Cancelled'}
              </span>
            </div>
            
            {/* Order Date and Time */}
            <div className="order-card-detail">
              <strong>Ordered On:</strong> 
              <span>
                {new Date(transaction.dateOrdered).toLocaleDateString()} 
                <strong> at </strong> 
                {transaction.timeOrdered}
              </span>
            </div>
            
            {/* Cancel order button */}
            {activeTab === 'pending' && (
              <button 
                className="cancel-order-btn"
                onClick={() => cancel(transaction.transactionId)} 
                disabled={transaction.orderStatus !== 0}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Orders;