import axios from 'axios';
import{ useState, useEffect } from 'react'
import { BE_ShoppingCart } from './shopping_cart_handler';

// Backend for Products.jsxs
export function BE_Products() {
    // State
    const [current_products, setProducts] = useState([]);
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Connect to shopping cart
    const { fetchTotalPriceFromServer } = BE_ShoppingCart();

    // Fetch products from the API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // FETCH request from find all end point
                const response = await fetch('http://localhost:3001/find-all');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                // Update products
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProduct();
    }, []); 

    // Fetch sorted products
    const fetchSortedProducts = async (field, order) => {
        try {
            const response = await axios.get(
                `http://localhost:3001/sort-products?sortField=${field}&sortOrder=${order}`
            );
            if (!response.status == 200) {
                throw new Error('Failed to fetch sorted products');
            }
            const data = await response.data;
            setProducts(data);
        } catch (error) {
            console.error('Error fetching sorted products:', error.message);
        }
    };

    // Fetch products initially and when sort options change
    useEffect(() => {
        fetchSortedProducts(sortField, sortOrder);
    }, [sortField, sortOrder]);

    // Add to cart function
    const handleAddToCart = async (product) => {
        const userId = localStorage.getItem('userId');
        const productId = product.productId;
        const quantity = 1;
        try {
            // POST the item to the cart
            await axios.post('http://localhost:3001/add-to-cart', { userId, productId, quantity });
            // Update price
            await fetchTotalPriceFromServer(); 
        } catch (error) {
            console.error('Unable to add to cart', error);
        }
    };

    return { handleAddToCart, 
        current_products,
        setSortField,
        setSortOrder,
        sortField,
        sortOrder
     };
}
