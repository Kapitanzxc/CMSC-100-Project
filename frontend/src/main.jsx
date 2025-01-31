import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import SignUp from './components/SignUp.jsx'
import Login from './components/Login.jsx'
import App from './App.jsx'
import Orders from './components/Orders.jsx'
import Users from './components/Users.jsx'
import Transactions from './components/Transactions.jsx'
import SalesReport from './components/Sales_Report.jsx'
import AddProduct from './components/Add_Product.jsx'
import LandingPage from './components/LandingPage.jsx'

const isUserSignedIn = !!localStorage.getItem('token')

// Create an array of routes
const routes = [
  { path: '/', element: <LandingPage /> },
  { path: '/signup_page', element: <SignUp /> },
  { path: '/login_page', element: isUserSignedIn ? <App /> : <Login /> },
  { path: '/main_page', element: isUserSignedIn ? <App /> : <Navigate to="/login_page" />  },
  { path: '/order_page', element: isUserSignedIn ? <Orders /> : <Navigate to="/login_page" /> },
  { path: '/users_page', element: isUserSignedIn ? <Users /> : <Navigate to="/login_page" /> },
  { path: '/transaction_page', element: isUserSignedIn ? <Transactions /> : <Navigate to="/login_page" /> },
  { path: '/salesreport_page', element: isUserSignedIn ? <SalesReport /> : <Navigate to="/login_page" /> },
  { path: '/addproduct', element: isUserSignedIn ? <AddProduct /> : <Navigate to="/login_page" /> },
];


const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
