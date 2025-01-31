import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { BE_Header } from '../../../backend/header_handler';
import { BE_AddProduct } from '../../../backend/addproduct_handler';
import './css/Addproduct.css';

function AddProduct() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
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
  } = BE_AddProduct();

  const { isAdminStatus } = BE_Header();

  if (!isAdminStatus) {
    console.error('User is unauthorized to access this page.');
    return null;
  }

  const getProductType = (typeNum) => {
    switch (typeNum) {
      case 1: return 'Crops';
      case 2: return 'Poultry';
      case 3: return 'Dairy';
      default: return 'Unknown';
    }
  };

  return (
    <>
      <Header />
      <div className="products-container">
        <div className="sort-dropdown">
          <label htmlFor="sortField" className="sort-label">Sort by:</label>
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

        <div className="products-grid">
          {current_products.map((product) => (
            <div className="product" key={product.productId}>
              <img src={product.image} alt={product.name} className="product-image" />
              <h1 className="product-name">{product.name}</h1>
              <div className="product-description">{getProductType(product.type)}</div>
              <div className="product-description">{product.description}</div>
              <div className="product-price">₱ {product.price}</div>
              <div className="product-quantity">Quantity: {product.quantity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Button */}
      <button
        className="floating-add-button"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Product</h2>
            <form className="modal-form" onSubmit={(e) => {
              handleSubmit(e, navigate);
              setIsModalOpen(false); // Close modal after submission
            }}>
              <label>Product ID</label>
              <input
                type="text"
                placeholder="Product ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
              <label>Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Product Description</label>
              <input
                type="text"
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label>Product Type</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value={1}
                    checked={type === 1}
                    onChange={(e) => setType(Number(e.target.value))}
                  /> Crop
                </label>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value={2}
                    checked={type === 2}
                    onChange={(e) => setType(Number(e.target.value))}
                  /> Poultry
                </label>
              </div>
              <label>Product Quantity</label>
              <input
                type="text"
                placeholder="Product Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <label>Product Price</label>
              <input
                type="text"
                placeholder="Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <label>Image URL</label>
              <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <button type="submit">Add Product</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddProduct;
