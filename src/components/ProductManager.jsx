import React, { useState } from 'react';

// ========== STORAGE KEY ==========
// Key for storing/retrieving products from browser's localStorage
const STORAGE_KEY = 'book_inventory';

// ========== PRODUCT MANAGER COMPONENT ==========
// Admin panel for sellers to manage their book inventory (CRUD operations)
export default function ProductManager() {
  // State: List of products loaded from localStorage or empty array
  const [products, setProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  // State: Current form data for creating/editing products
  const [form, setForm] = useState({
    id: '',
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    year: '',
    category: '',
    priceNew: '',
    priceUsed: '',
    condition: '',
    conditionDetail: '',
    stock: '',
    rating: 5,
    images: [],
    status: 'active'
  });

  // State: Search term to filter products
  const [searchTerm, setSearchTerm] = useState('');

  // State: ID of product being edited (null if creating new)
  const [editingId, setEditingId] = useState(null);

  // ===== SAVE TO STORAGE =====
  // Persist products to browser's localStorage
  function saveToStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  // ===== HANDLE ADD/UPDATE PRODUCT =====
  // Create new product or update existing one
  function handleAddProduct(e) {
    e.preventDefault();
    // Validate required fields
    if (!form.title || !form.author || !form.priceUsed) {
      alert('กรุณากรอก: ชื่อ, ผู้แต่ง, ราคา');
      return;
    }

    // Create product object with proper data types
    const newProduct = {
      id: editingId || 'b_' + Date.now(),
      ...form,
      priceNew: Number(form.priceNew),
      priceUsed: Number(form.priceUsed),
      stock: Number(form.stock),
      rating: Number(form.rating),
      year: Number(form.year),
    };

    if (editingId) {
      // Update existing product
      const updated = products.map((p) => (p.id === editingId ? newProduct : p));
      setProducts(updated);
      saveToStorage(updated);
      setEditingId(null);
    } else {
      // Create new product
      const newList = [...products, newProduct];
      setProducts(newList);
      saveToStorage(newList);
    }

    // Clear form after saving
    setForm({
      id: '', title: '', author: '', isbn: '', publisher: '', year: '', category: '', priceNew: '', priceUsed: '',
      condition: '', conditionDetail: '', stock: '', rating: 5, images: [], status: 'active'
    });
  }

  // ===== HANDLE EDIT =====
  // Load product data into form for editing
  function handleEdit(product) {
    setForm(product);
    setEditingId(product.id);
  }

  // ===== HANDLE DELETE (SOFT DELETE) =====
  // Mark product as 'closed' instead of permanent deletion (soft delete)
  function handleDelete(id) {
    const updated = products.map((p) =>
      p.id === id ? { ...p, status: 'closed' } : p
    );
    setProducts(updated);
    saveToStorage(updated);
  }

  // ===== HANDLE RESTORE =====
  // Restore a soft-deleted product back to 'active' status
  function handleRestore(id) {
    const updated = products.map((p) =>
      p.id === id ? { ...p, status: 'active' } : p
    );
    setProducts(updated);
    saveToStorage(updated);
  }

  // ===== HANDLE IMAGE UPLOAD =====
  // Convert uploaded images to base64 for storage
  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    const readers = files.map(file => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then((images) => {
      setForm({ ...form, images: [...form.images, ...images] });
    });
  }

  // ===== REMOVE IMAGE =====
  // Remove image from preview by index
  function removeImage(index) {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index)
    });
  }

  // ===== FILTER PRODUCTS =====
  // Search by title and author
  const filtered = products.filter((p) => {
    if (searchTerm) {
      return (
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  // Separate active and deleted products
  const active = filtered.filter((p) => p.status === 'active');
  const closed = filtered.filter((p) => p.status === 'closed');

  return (
    <section className="product-manager">
      {/* Page title */}
      <h1>จัดการสินค้า (Admin)</h1>

      {/* Product form section */}
      <div className="pm-form-section">
        <form onSubmit={handleAddProduct} className="pm-form">
          <h2>{editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>

          {/* Book title input */}
          <input type="text" placeholder="ชื่อหนังสือ" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          {/* Author input */}
          <input type="text" placeholder="ผู้แต่ง" value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })} required />

          {/* ISBN input */}
          <input type="text" placeholder="ISBN" value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })} />

          {/* Publisher input */}
          <input type="text" placeholder="สำนักพิมพ์" value={form.publisher}
            onChange={(e) => setForm({ ...form, publisher: e.target.value })} />

          {/* Year input */}
          <input type="number" placeholder="ปีที่พิมพ์" value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })} />

          {/* Category input */}
          <input type="text" placeholder="หมวดหมู่" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })} />

          {/* New (original) price input */}
          <input type="number" placeholder="ราคาใหม่" value={form.priceNew}
            onChange={(e) => setForm({ ...form, priceNew: e.target.value })} />

          {/* Used price input (required) */}
          <input type="number" placeholder="ราคามือสอง" value={form.priceUsed}
            onChange={(e) => setForm({ ...form, priceUsed: e.target.value })} required />

          {/* Book condition input (e.g., "90%", "good", "like new") */}
          <input type="text" placeholder="สภาพ (เช่น 90%)" value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })} />

          {/* Condition Detail input */}
          <textarea placeholder="รายละเอียดสภาพ (ตำหนิ, รอยขีดเขียน)" value={form.conditionDetail}
            onChange={(e) => setForm({ ...form, conditionDetail: e.target.value })} rows="3" style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ddd' }} />

          {/* Stock quantity input */}
          <input type="number" placeholder="จำนวน" value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })} />

          {/* Rating input (1-5 stars) */}
          <input type="number" min="1" max="5" placeholder="ดั้งเดิม" value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })} />

          {/* Image upload section */}
          <div className="image-upload">
            <label>อัปโหลดรูป:</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            {/* Image preview area */}
            <div className="image-preview">
              {form.images.map((img, idx) => (
                <div key={idx} className="preview-item">
                  <img src={img} alt={`preview-${idx}`} />
                  <button type="button" onClick={() => removeImage(idx)}>ลบ</button>
                </div>
              ))}
            </div>
          </div>

          {/* Save/Add product button */}
          <button type="submit" className="btn-primary">
            {editingId ? 'บันทึก' : 'เพิ่ม'}
          </button>

          {/* Cancel edit button (only shown when editing) */}
          {editingId && (
            <button type="button" onClick={() => {
              setEditingId(null); setForm({
                id: '', title: '', author: '', isbn: '', publisher: '', year: '', category: '', priceNew: '', priceUsed: '',
                condition: '', conditionDetail: '', stock: '', rating: 5, images: [], status: 'active'
              });
            }} className="btn-secondary">ยกเลิก</button>
          )}
        </form>
      </div>

      {/* Products list section */}
      <div className="pm-list-section">
        {/* Active products count */}
        <h2>รายการสินค้า ({active.length})</h2>

        {/* Search input for filtering products */}
        <input type="text" placeholder="ค้นหา..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />

        {/* Active products list */}
        <div className="pm-list">
          {active.length === 0 ? (
            <p>ไม่มีสินค้า</p>
          ) : (
            active.map((product) => (
              <div key={product.id} className="pm-item">
                {/* Product image */}
                <img src={product.images[0] || 'https://via.placeholder.com/80'} alt={product.title} />

                {/* Product details */}
                <div className="pm-item-details">
                  <h3>{product.title}</h3>
                  <p>ผู้แต่ง: {product.author}</p>
                  <p>ราคามือสอง: {product.priceUsed}฿ | จำนวน: {product.stock}</p>
                  <p>หมวดหมู่: {product.category}</p>
                </div>

                {/* Edit and Delete buttons */}
                <div className="pm-item-actions">
                  <button onClick={() => handleEdit(product)} className="btn-edit">แก้ไข</button>
                  <button onClick={() => handleDelete(product.id)} className="btn-delete">ลบ</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Deleted products section (soft-deleted items that can be restored) */}
        {closed.length > 0 && (
          <div className="pm-closed">
            <h3>สินค้าที่ลบแล้ว ({closed.length})</h3>
            <div className="pm-list">
              {closed.map((product) => (
                <div key={product.id} className="pm-item pm-closed-item">
                  {/* Deleted product image */}
                  <img src={product.images[0] || 'https://via.placeholder.com/80'} alt={product.title} />

                  {/* Deleted product details */}
                  <div className="pm-item-details">
                    <h3>{product.title}</h3>
                    <p className="closed-label">ลบแล้ว</p>
                  </div>

                  {/* Restore button to bring product back to active */}
                  <button onClick={() => handleRestore(product.id)} className="btn-restore">คืน</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
