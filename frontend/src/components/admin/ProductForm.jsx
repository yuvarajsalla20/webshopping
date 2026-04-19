import React, { useState } from "react";
import "./ProductForm.css";

export default function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price !== undefined ? String(initial.price) : "",
    image_url: initial?.image_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const price = parseFloat(form.price);
    if (!form.name.trim()) return setError("Name is required");
    if (isNaN(price) || price < 0) return setError("Price must be a valid non-negative number");
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price,
        image_url: form.image_url.trim() || null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">{initial ? "Edit Product" : "New Product"}</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <label>Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            placeholder="Product name"
            required
          />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={set("description")}
            placeholder="Short description"
            rows={3}
          />
        </div>
        <div className="form-row">
          <label>Price * ($)</label>
          <input
            type="number"
            value={form.price}
            onChange={set("price")}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-row">
          <label>Image URL</label>
          <input
            type="url"
            value={form.image_url}
            onChange={set("image_url")}
            placeholder="https://…"
          />
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? "Saving…" : initial ? "Update" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
