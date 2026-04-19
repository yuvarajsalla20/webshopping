import React from "react";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const { id, name, description, price, image_url } = product;
  return (
    <div className="product-card">
      <img
        src={image_url || "https://via.placeholder.com/400x240?text=No+Image"}
        alt={name}
        className="product-img"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x240?text=No+Image";
        }}
      />
      <div className="product-body">
        <h3 className="product-name">{name}</h3>
        <p className="product-desc">{description}</p>
        <div className="product-footer">
          <span className="product-price">${price.toFixed(2)}</span>
          <button className="add-btn" onClick={() => onAddToCart(id)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
