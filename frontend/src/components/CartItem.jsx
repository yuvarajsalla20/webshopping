import React from "react";
import "./CartItem.css";

export default function CartItem({ item, onUpdate, onRemove }) {
  const { id, name, price, quantity, image_url } = item;

  return (
    <div className="cart-item">
      <img
        src={image_url || "https://via.placeholder.com/60?text=?"}
        alt={name}
        className="cart-item-img"
        onError={(e) => { e.target.src = "https://via.placeholder.com/60?text=?"; }}
      />
      <div className="cart-item-info">
        <p className="cart-item-name">{name}</p>
        <p className="cart-item-price">${(price * quantity).toFixed(2)}</p>
        <div className="cart-item-controls">
          <button
            className="qty-btn"
            onClick={() => quantity > 1 ? onUpdate(id, quantity - 1) : onRemove(id)}
          >−</button>
          <span className="qty-value">{quantity}</span>
          <button className="qty-btn" onClick={() => onUpdate(id, quantity + 1)}>+</button>
          <button className="remove-btn" onClick={() => onRemove(id)}>Remove</button>
        </div>
      </div>
    </div>
  );
}
