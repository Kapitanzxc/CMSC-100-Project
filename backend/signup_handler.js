import { useState } from 'react';
import axios from 'axios';

// Backend for Signup.jsx
export function BE_Signup() {
    console.log('In backend Signup');
    
    // States
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');  
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('user');  

    // Function to handle the registration process
    const handleSubmit = async (event, navigate) => {
        event.preventDefault();

        // Check if the username is 'admin'
        if (username.toLowerCase() === 'admin') {
            alert('Username cannot be "admin"');
            return; // Prevent the form from submitting
        }

        try {
            console.log('Handling registration in signup_handler.js...');
            const userData = {
                firstName,
                middleName,
                lastName,
                email,
                username,
                password,
                userType
            };
            // POST request on registering this user
            await axios.post('http://localhost:3001/register', userData);
            alert('Registration Successful');
            // Reset fields
            setFirstName('');
            setMiddleName('');
            setLastName('');
            setEmail('');
            setUsername('');
            setPassword('');
            setUserType('user');
            // Navigate to login page
            navigate('/login_page');
        } catch (error) {
            // Check for specific error response from the server
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                // Alert specific messages based on the error
                if (errorMessage === 'Email already exists.') {
                    alert('Error: This email is already registered.');
                } else if (errorMessage === 'Username already exists.') {
                    alert('Error: This username is already taken.');
                } else {
                    alert(`Registration Error: ${errorMessage}`);
                }
            } else {
                console.error('Unexpected Error:', error);
                alert('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return {
        firstName, setFirstName,
        middleName, setMiddleName,
        lastName, setLastName,
        email, setEmail,
        username, setUsername,
        password, setPassword,
        userType, setUserType,
        handleSubmit,
    };
}
