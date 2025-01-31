import React from 'react';
import './css/admin_salesreport.css'; 
import { BE_Header } from '../../../backend/header_handler';
import { BE_SalesReport } from '../../../backend/sales_report_handler';
import Header from './Header';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function SalesReport() {
  // Connect to backend
  const { completedOrders, activeTab, setActiveTab, weeklySales, monthlySales, yearlySales, incomeByProduct, totalIncome } = BE_SalesReport();
  const { isAdminStatus } = BE_Header();

  if (!isAdminStatus) {
    console.error('User is unauthorized to access this page.');
    return;
  }

  // Graph Data for Weekly, Monthly, Yearly Sales
  const salesData = {
    labels: activeTab === 'weekly'
      ? weeklySales.map((data) => `Week ${data._id.week}`)
      : activeTab === 'monthly'
      ? monthlySales.map((data) => `Month ${data._id.month}`)
      : yearlySales.map((data) => `Year ${data._id.year}`),
    datasets: [
      {
        label: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Sales Income`,
        data: activeTab === 'weekly'
          ? weeklySales.map((data) => data.totalIncome)
          : activeTab === 'monthly'
          ? monthlySales.map((data) => data.totalIncome)
          : yearlySales.map((data) => data.totalIncome),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Graph for Income by Product (Pie Chart)
  const productIncomeData = {
    labels: incomeByProduct.map((product) => product.productName),
    datasets: [
      {
        label: 'Income by Product',
        data: incomeByProduct.map((product) => product.totalProductIncome),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Header />
      <div className="sales-report-container">
        <div className="top-row">
          {/* Income by Product and Total Income */}
          <div className="card income-summary-card">
            <div className="total-income">
              <div className="card-header">
                <h2>Income by Product</h2>
                <h3>Total Income: ₱ {totalIncome} </h3>
              </div>
            </div>
            <div className="card-content">
              <Pie data={productIncomeData} />
            </div>
          </div>

          {/* Sales Data */}
          <div className="card sales-data-card">
            <div className="card-header">
              <h2>Sales Data - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            </div>
            <div className="sales-tabs">
              <button onClick={() => setActiveTab('weekly')} disabled={activeTab === 'weekly'}>
                Weekly
              </button>
              <button onClick={() => setActiveTab('monthly')} disabled={activeTab === 'monthly'}>
                Monthly
              </button>
              <button onClick={() => setActiveTab('annually')} disabled={activeTab === 'annually'}>
                Annually
              </button>
            </div>
            <Bar data={salesData} />
          </div>
        </div>

        {/* Completed Transactions */}
        <div className="card completed-transactions-card">
          <h2>Completed Transactions</h2>
          <div className="card-content completed-transactions">
            {completedOrders.map((transaction) => (
              <div key={transaction.transactionId} className="transaction-item">
                <div>
                  <strong>Transaction ID:</strong> 
                  <span>{transaction.transactionId}</span>
                </div>
                <div>
                  <strong>Quantity:</strong> 
                  <span>{transaction.orderQuantity}</span>
                </div>
                <div>
                  <strong>Product:</strong> 
                  <span>{transaction.name}</span>
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span className={`transaction-status ${
                    transaction.orderStatus === 1 
                      ? 'transaction-status-completed' 
                      : 'transaction-status-cancelled'
                  }`}>
                    {transaction.orderStatus === 1 ? 'Completed' : 'Cancelled'}
                  </span>
                </div>
                <div>
                  <strong>Date:</strong> 
                  <span>{new Date(transaction.dateOrdered).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SalesReport;