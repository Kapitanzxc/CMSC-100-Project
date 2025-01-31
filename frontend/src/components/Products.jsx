import React from 'react';
import './css/product.css';
import { BE_Products } from '../../../backend/products_handler';

// Products component
function Products() {
    // Connect to backend
    const { handleAddToCart, 
        current_products, 
        setSortField,
        setSortOrder,
        sortField,
        sortOrder} = BE_Products(); 

    // Function to get the product type as a string
    const getProductType = (typeNum) => {
        switch (typeNum) {
            case 1:
                return 'Crops';
            case 2:
                return 'Poultry';
            case 3:
                return 'Dairy';
            default:
                return 'Unknown';
        }
    };

    // Interface
     return (
        <div className="products-container">
            {/* Sort dropdown */}
            <div className="sort-container">
                <div className="sort-dropdown">
                    <label htmlFor="sortField" className="sort-label">
                        Sort by:
                    </label>
                    <select
                        id="sortField"
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                        className="sort-select"
                    >
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="quantity">Quantity</option>
                        <option value="type">Type</option>
                    </select>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="sort-select"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>
            {/* Products grid */}
            <div className="products-grid">
                {/* Map the products */}
                {current_products.map((product) => (
                    <div className="product" key={product.productId}>
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-name-container">
                            <h1 className="product-name">{product.name}</h1>
                        </div>
                        <div className="product-details">
                            <div className="product-type">{getProductType(product.type)}</div>
                            <div className="product-description">{product.description}</div>
                            <div className="product-price">₱ {product.price.toFixed(2)}</div>
                            <div className="product-quantity">Quantity: {product.quantity}</div>
                        </div>
                        {/* Add to cart button */}
                        <button onClick={() => handleAddToCart(product)} className="add-to-cart-button">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;