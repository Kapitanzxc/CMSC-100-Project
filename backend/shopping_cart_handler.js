import { useState, useEffect } from 'react';
import axios from 'axios';

// Backend for Shopping Cart Frontend
export function BE_ShoppingCart() {
    // States
    const [current_cart, setCart] = useState([]);
    const [price, setPrice] = useState(0);

    // Function to fetch the user's cart
    const fetchCart = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }
        try {
            // GET request for fetching the user's cart
            const response = await axios.get(`http://localhost:3001/cart?userId=${userId}`);
            if (response.status === 200) {
                setCart(response.data.cart || []);
                await fetchTotalPriceFromServer();
            } else {
                console.error('Failed to fetch cart');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    // Function to fetch the user's total price from the database
    const fetchTotalPriceFromServer = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }
        try {
            // GET request for fetching the user's total price
            const response = await axios.get(`http://localhost:3001/total-price?userId=${userId}`);
            if (response.status === 200) {
                setPrice(response.data.totalPrice);
            } else {
                console.error('Failed to fetch total price');
            }
        } catch (error) {
            console.error('Error fetching total price:', error);
        }
    };

    // Function to remove a product from the cart
    const removeCart = async (productId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }
        try {
            // POST request for removing an product from the cart
            const response = await axios.post(`http://localhost:3001/remove-cart`, { userId, productId });
            if (response.status === 200) {
                // Fetch the cart and price again after removal
                await fetchCart();
                await fetchTotalPriceFromServer();
            } else {
                console.error('Failed to remove product from cart');
            }
        } catch (error) {
            console.error('Error removing product:', error);
        }
    };

    // Check out function
    const checkout = async (cart) => {
        const userId = localStorage.getItem('userId');
        // Loop throughout the user's cart
        for (const item of cart) {
            const productId = item.productId;
            try {
                // POST request to add these products to checkout
                await axios.post('http://localhost:3001/check-out', { userId, productId });
            } catch (error) {
                console.error('Unable to checkout the product', error);
                return;
            }
        }
        window.location.reload();       
    };

    // Fetch cart and total price 
    useEffect(() => {
        fetchCart();
        fetchTotalPriceFromServer();
    }, [current_cart]);
    
    return {
        current_cart,
        price,
        removeCart,
        checkout,
        fetchCart,
        fetchTotalPriceFromServer
    };
}
