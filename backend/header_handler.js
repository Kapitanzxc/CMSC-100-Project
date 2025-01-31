import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Backend for Header.jsx
export function BE_Header() {
    const navigate = useNavigate();

    // Check if the user is signed in
    const isUserSignedIn = !!localStorage.getItem('token');

    // Check if the user is signed in
    const userId = localStorage.getItem('userId');

    console.log("header_handler, local storage:", userId);
    
    const [isAdminStatus, setIsAdminStatus] = useState(false);

    const isAdmin = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User not logged in.');
        return false; // Explicitly return false for non-admin
      }
    
      try {
        const response = await axios.get(`http://localhost:3001/user-by-id?userId=${userId}`);
        if (response.status === 200) {
          const user = response.data.user; // Store the user data
          console.log("header_handler, username", user);
          return user?.username?.toLowerCase() === 'admin'; // Ensure username exists and compare
        } else {
          console.error('Failed to fetch user information');
          return false; // Explicitly return false on failure
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
        return false; // Explicitly return false on error
      }
    };
    
    useEffect(() => {
      const checkAdmin = async () => {
        const isAdminResult = await isAdmin();
        setIsAdminStatus(isAdminResult); // Update the state with the result
      };
    
      checkAdmin();
    }, []); // Dependency-free to run only on component mount
    

    // Remove token and userid upon signing out
    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login_page'); 
        window.location.reload();
    };

    return { isUserSignedIn, isAdminStatus, handleSignOut };
}