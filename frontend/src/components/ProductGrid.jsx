import React from "react";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products, loading, onAddToCart }) {
  if (loading) {
    return <div className="grid-state">Loading products…</div>;
  }
  if (products.length === 0) {
    return <div className="grid-state">No products available yet.</div>;
  }
  return (
    <main className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
      ))}
    </main>
  );
}
