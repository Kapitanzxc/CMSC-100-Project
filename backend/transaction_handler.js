import { useState, useEffect } from 'react';
import axios from 'axios';

export function BE_Transactions(){
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
            const response = await axios.get(`http://localhost:3001/all-transactions`);
            if (response.status === 200) {
                setOrders(response.data || []);
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

    const confirm = async (transactionId) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }
        try {
            // POST request for cancelling a transaction
            const response = await axios.post(`http://localhost:3001/confirm-transaction`, { transactionId });
            if (response.status === 200) {
                fetchOrders();
                window.location.reload();
            } else {
                console.error('Failed to confirm user transaction');
            }
        } catch (error) {
            console.error('Error confirm user transaction here', error);
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

    // const completedOrders = current_orders.filter((transaction) => {
    //     return transaction.orderStatus === 1;
    // });

    // Sales Reports
    // List of completed orders, income per order, total income
    // Function to fetch the user's transactions
    const [totalIncome, setTotalIncome] = useState('');

    const [completedOrders, setCompletedOrders] = useState([]);

    const getCompletedOrders = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }

        try {
            // GET request for fetching the user's transactions
            const response = await axios.get(`http://localhost:3001/all-transactions`);
            if (response.status === 200) {
                // setTotalIncome(response.data.transactions || []);
                
                // loop thru all transactions
                // get product qty, get product price, multiply  
                // get summation

                // console.log(response.data)
                setCompletedOrders(response.data || []);

            } else {
                console.error('Failed to fetch user transaction');
            }
        } catch (error) {
            console.error('Error fetching user transaction here', error);
        }
    };

    // Fetch cart and total price 
    useEffect(() => {
        getCompletedOrders();
    }, [completedOrders]);
    
    // // Fetch cart and total price 
    // useEffect(() => {
    //     totalIncome();
    // }, totalIncome);


    return {
        current_orders,
        cancel,
        confirm,
        activeTab, 
        setActiveTab, 
        orders,
        completedOrders 
    };
}
