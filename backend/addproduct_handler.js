import{ useState, useEffect } from 'react'
import axios from 'axios';

// Backend for Signup.jsx
export function BE_AddProduct() {
    console.log('In backend Add Product');
    
    // States
    const [productId, setProductId] = useState('');
    const [name, setName] = useState('');  
    const [description, setDescription] = useState('');
    const [type, setType] = useState(1);
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');  

    const [current_products, setProducts] = useState([]);
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

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

    // Function to handle the registration process
    const handleSubmit = async (event, navigate) => {
        event.preventDefault();
        try {
            console.log('Adding product in addproduct_handler.js...');
            const productData = {
                productId,
                name,
                description,
                type,
                quantity,
                price,
                image
            };
            // POST request on registering this user
            await axios.post('http://localhost:3001/add-product', productData);
            alert('New Product Added Successfully');
            // Reset fields
            setProductId('');
            setName('');
            setDescription('');
            setType(1);
            setQuantity('');
            setPrice('');
            setImage('');
            // // Navigate to login page
            // navigate('/main_page');
            window.location.reload();
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };



    return {
        productId, setProductId,
        name, setName,
        description, setDescription,
        type, setType,
        quantity, setQuantity,
        price, setPrice,
        image, setImage,
        handleSubmit,
        current_products,
        setSortField,
        setSortOrder,
        sortField,
        sortOrder
    };
}
