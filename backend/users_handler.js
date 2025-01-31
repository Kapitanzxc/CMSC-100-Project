import axios from 'axios';
import{ useState, useEffect } from 'react'
import { BE_ShoppingCart } from './shopping_cart_handler';

// Backend for Products.jsxs
export function BE_Users() {
    // State
    const [current_users, setUsers] = useState([]);

    // Fetch products from the API
    useEffect(() => {
        const fetchUsers= async () => {
            try {
                // FETCH request from find all end point
                const response = await fetch('http://localhost:3001/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                // Update products
                console.log(data.users)
                setUsers(data.users);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchUsers();
    }, []); 

    return { 
        current_users,
     };
}
