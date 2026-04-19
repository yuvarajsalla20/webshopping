import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import AdminPanel from "./components/admin/AdminPanel";
import "./App.css";

const API = "/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orderConfirm, setOrderConfirm] = useState(null);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const res = await fetch(`${API}/products`);
      if (!res.ok) throw new Error("Failed to load products");
      setProducts(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${API}/cart`);
      if (!res.ok) throw new Error("Failed to load cart");
      setCart(await res.json());
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [fetchProducts, fetchCart]);

  const addToCart = async (productId) => {
    try {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      await fetchCart();
      setCartOpen(true);
    } catch (e) {
      alert(e.message);
    }
  };

  const updateCartItem = async (id, quantity) => {
    try {
      const res = await fetch(`${API}/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
      await fetchCart();
    } catch (e) {
      alert(e.message);
    }
  };

  const removeCartItem = async (id) => {
    try {
      await fetch(`${API}/cart/${id}`, { method: "DELETE" });
      await fetchCart();
    } catch (e) {
      alert(e.message);
    }
  };

  const checkout = async () => {
    try {
      const res = await fetch(`${API}/orders`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Checkout failed");
      }
      const order = await res.json();
      setCart([]);
      setCartOpen(false);
      setOrderConfirm(order);
    } catch (e) {
      alert(e.message);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <Header cartCount={cartCount} onCartClick={() => setCartOpen((o) => !o)} />
      <Routes>
        <Route
          path="/"
          element={
            <div className="shop-layout">
              {orderConfirm && (
                <div className="order-banner">
                  Order #{orderConfirm.id} confirmed! Total: ${orderConfirm.total.toFixed(2)}
                  <button className="close-btn" onClick={() => setOrderConfirm(null)}>×</button>
                </div>
              )}
              {error && <div className="error-banner">{error}</div>}
              <ProductGrid
                products={products}
                loading={loadingProducts}
                onAddToCart={addToCart}
              />
              {cartOpen && (
                <Cart
                  cart={cart}
                  onClose={() => setCartOpen(false)}
                  onUpdate={updateCartItem}
                  onRemove={removeCartItem}
                  onCheckout={checkout}
                />
              )}
            </div>
          }
        />
        <Route
          path="/admin"
          element={<AdminPanel onProductsChange={fetchProducts} />}
        />
      </Routes>
    </BrowserRouter>
  );
}
