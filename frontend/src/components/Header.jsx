import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ cartCount, onCartClick }) {
  return (
    <header className="header">
      <Link to="/" className="logo">ShopMVP</Link>
      <nav className="nav">
        <Link to="/" className="nav-link">Shop</Link>
        <Link to="/admin" className="nav-link">Admin</Link>
        <button className="cart-btn" onClick={onCartClick}>
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </nav>
    </header>
  );
}
