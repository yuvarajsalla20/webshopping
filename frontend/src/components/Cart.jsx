import React from "react";
import CartItem from "./CartItem";
import "./Cart.css";

export default function Cart({ cart, onClose, onUpdate, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (window.confirm(`Confirm order for $${total.toFixed(2)}?`)) {
      onCheckout();
    }
  };

  return (
    <aside className="cart-sidebar">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total">
              Total: <strong>${total.toFixed(2)}</strong>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
