import { useState, useEffect } from 'react';
import axios from 'axios';

export function BE_Orders(){
    // States
    const [current_orders, setOrders] = useState([]);

    // Function to fetch the user's transactions
    const fetchOrders = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }
        try {
            // GET request for fetching the user's transactions
            const response = await axios.get(`http://localhost:3001/user-transaction?userId=${userId}`);
            if (response.status === 200) {
                setOrders(response.data.transactions || []);
            } else {
                console.error('Failed to fetch user transaction');
            }
        } catch (error) {
            console.error('Error fetching user transaction here', error);
        }
    };
    
    // Fetch cart and total price 
    useEffect(() => {
        fetchOrders();
    }, [current_orders]);


    const cancel = async (transactionId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }
        try {
            // POST request for cancelling a transaction
            const response = await axios.post(`http://localhost:3001/cancel-transaction`, { transactionId });
            if (response.status === 200) {
                fetchOrders();
                window.location.reload();
            } else {
                console.error('Failed to cancel user transaction');
            }
        } catch (error) {
            console.error('Error cancelling user transaction here', error);
        }
    }

    // Tabs state
    const [activeTab, setActiveTab] = useState('pending'); 

    // Filter orders based on active tab
    const orders = current_orders.filter((transaction) => {
        if (activeTab === 'pending') return transaction.orderStatus === 0;
        if (activeTab === 'completed') return transaction.orderStatus === 1;
        if (activeTab === 'cancelled') return transaction.orderStatus === 2;
    });


    return {
        current_orders,
        cancel,
        activeTab, 
        setActiveTab, 
        orders 
    };
}
