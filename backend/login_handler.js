import{ useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

console.log('Server is now at login_handler');
// Backend for Login.jsxs
export function BE_Login() {
    // States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Fetch users from the database
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users');
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Handle login
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            console.log('Handling login...');
            // POST request on sign in end point
            const response = await axios.post('http://localhost:3001/login', { username, password });
            const { token, userId } = response.data;

            // Store token and userId in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);

            // Reset fields
            setUsername('');
            setPassword('');

            // Fetch users
            fetchUsers();

            // Navigate to products
            navigate('/main_page');
            window.location.reload();
            
        } catch (error) {
            alert('Invalid credentials');
            console.error('Login Error', error);

        }
    };

    return {
        username,
        setUsername,
        password,
        setPassword,
        handleLogin,
    };
}
