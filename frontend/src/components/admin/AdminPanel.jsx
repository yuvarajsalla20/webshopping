import React, { useState, useEffect, useCallback } from "react";
import ProductForm from "./ProductForm";
import "./AdminPanel.css";

const API = "/api";

export default function AdminPanel({ onProductsChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/products`);
      if (!res.ok) throw new Error("Failed to load products");
      setProducts(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSave = async (data) => {
    const url = editing ? `${API}/products/${editing.id}` : `${API}/products`;
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Save failed");
    }
    await fetchProducts();
    onProductsChange && onProductsChange();
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    const res = await fetch(`${API}/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete product");
      return;
    }
    await fetchProducts();
    onProductsChange && onProductsChange();
  };

  const handleEdit = (product) => {
    setEditing(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin — Products</h1>
        <button className="add-product-btn" onClick={handleAdd}>+ Add Product</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {showForm && (
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {loading ? (
        <p className="admin-state">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="admin-state">No products yet. Add one above.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="admin-thumb" />
                    ) : (
                      <span className="no-img">—</span>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td className="desc-cell">{p.description || "—"}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="del-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
