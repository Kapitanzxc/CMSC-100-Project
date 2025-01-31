import { useState, useEffect } from 'react';
import axios from 'axios';

export function BE_SalesReport(){

    // States
    const [completedOrders, setOrders] = useState([]);

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
                const filteredOrders = response.data.filter(order => order.orderStatus === 1);
                setOrders(filteredOrders);
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
    }, [completedOrders]);

    // Tabs state
    const [activeTab, setActiveTab] = useState('weekly'); 

    // Function to Get Weekly Sales
    const [weeklySales, setWeeklySales] = useState([]);

    const getWeeklySales = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }

        try {
            // GET request for fetching the user's transactions
            const response = await axios.get(`http://localhost:3001/weekly-sales`);
            if (response.status === 200) {
                console.log("Handling sales report....")
                console.log(response.data)
                setWeeklySales(response.data.transactions || []);

            } else {
                console.error('Failed to fetch weekly sales');
            }
        } catch (error) {
            console.error('Error fetching weekly sales ', error);
        }
    };

    useEffect(() => {
        getWeeklySales();
    }, []);

    // Function to Get Monthly Sales
    const [monthlySales, setMonthlySales] = useState([]);

    const getMonthlySales = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }

        try {
            // GET request for fetching the user's transactions
            const response = await axios.get(`http://localhost:3001/monthly-sales`);
            if (response.status === 200) {
                console.log("Handling sales report....")
                console.log(response.data.transactions)
                setMonthlySales(response.data.transactions || []);

            } else {
                console.error('Failed to fetch monthly sales');
            }
        } catch (error) {
            console.error('Error fetching monthly sales ', error);
        }
    };

    useEffect(() => {
        getMonthlySales();
    }, []);

    // Function to Get Monthly Sales
    const [yearlySales, setYearlySales] = useState([]);

    const getYearlySales = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }

        try {
            // GET request for fetching the user's transactions
            const response = await axios.get(`http://localhost:3001/yearly-sales`);
            if (response.status === 200) {
                console.log("Handling sales report....")
                console.log(response.data.transactions)
                setYearlySales(response.data.transactions || []);

            } else {
                console.error('Failed to fetch yearly sales');
            }
        } catch (error) {
            console.error('Error fetching yearly sales ', error);
        }
    };

    useEffect(() => {
        getYearlySales();
    }, []);

    // Function to Get Monthly Sales
    const [incomeByProduct, setIncomeByProduct] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);

    const getIncomeByProduct = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not logged in.');
            return;
        }

        try {
            // GET request for fetching the user's transactions
            const response = await axios.get(`http://localhost:3001/all-incomes`);
            if (response.status === 200) {
                console.log("Handling sales report by income....")
                console.log(response.data.incomes)
                console.log("Total income....")
                console.log(response.data.totalIncome)
                setIncomeByProduct(response.data.incomes || []);
                setTotalIncome(response.data.totalIncome);

            } else {
                console.error('Failed to fetch income by product');
            }
        } catch (error) {
            console.error('Error fetching income by product ', error);
        }
    };

    useEffect(() => {
        getIncomeByProduct();
    }, []);

    return {
        completedOrders,
        activeTab, 
        setActiveTab, 
        weeklySales,
        monthlySales,
        yearlySales,
        incomeByProduct,
        totalIncome
    };
}
