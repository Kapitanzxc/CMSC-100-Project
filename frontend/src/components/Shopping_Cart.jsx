import React, { useState } from 'react';
import { BE_ShoppingCart } from '../../../backend/shopping_cart_handler';
import './css/shopping_cart.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function ShoppingCart() {
    const [isOpen, setIsOpen] = useState(false);
    const { current_cart, price, removeCart, checkout } = BE_ShoppingCart();

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`shopping-cart-container ${isOpen ? 'open' : ''}`}>
            <button className="cart-toggle-button" onClick={toggleCart}>
                <i className="fa-solid fa-shopping-cart"></i>
            </button>

            {isOpen && (
                <div className="cart-content">
                    <h2>Shopping Cart ({current_cart.length})</h2>
                    <div className="cart-items-container">
                        {current_cart.map((product) => (
                            <div key={product.productId} className="cart-item">
                                <div className="product-info">
                                    <span className="product-name">{product.name}</span>
                                </div>
                                <div className="qty">
                                    <div>₱{product.totalPrice}</div>
                                    <div>QTY: {product.quantity}</div>
                                    <button onClick={() => removeCart(product.productId)}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Total Price: ₱ {price}</h3>
                        <button onClick={() => checkout(current_cart)}>Check Out</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShoppingCart;