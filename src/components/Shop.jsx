import React, { useState, useEffect } from 'react';
import AddProductModal from './AddProductModal';

// ========== STORAGE KEY ==========
// Key for accessing products from browser's localStorage (shared with ProductManager)
const STORAGE_KEY = 'book_inventory';

// ========== SHOP COMPONENT ==========
// Product listing page with filtering and sorting capabilities
// Displays books from admin-managed inventory (ProductManager)
export default function Shop({ onAddToCart, onViewDetail, onAddProduct, searchQuery }) {
  // State: List of active books loaded from localStorage
  const [books, setBooks] = useState([]);

  // Modal visibility state
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter and sort state
  const [filter, setFilter] = useState({
    category: 'all', // Filter by book category
    minPrice: '', // NEW: Min price filter
    maxPrice: '', // Maximum price filter
    sort: 'new' // Sort order (new, cheap, exp)
  });

  // ===== LOAD BOOKS FROM STORAGE =====
  // Load inventory from localStorage when component mounts
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('book_inventory')) || [];
      // Only show active books (status !== 'closed')
      const activeBooks = stored.filter((b) => b.status !== 'closed');
      setBooks(activeBooks);
    } catch (e) {
      setBooks([]);
    }
  }, []);

  // ===== HANDLE DELETE =====
  function handleDelete(id) {
    if (window.confirm('คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่?')) {
      const updated = books.filter(b => b.id !== id);
      setBooks(updated);

      // Update local storage to sync with ProductManager and persisting
      try {
        // We need to match how ProductManager marks it as 'closed' (soft delete) 
        // or if we want hard delete here. Let's do soft delete to be safe and consistent.
        const stored = JSON.parse(localStorage.getItem('book_inventory')) || [];
        const softDeleted = stored.map(b => b.id === id ? { ...b, status: 'closed' } : b);
        localStorage.setItem('book_inventory', JSON.stringify(softDeleted));
      } catch (err) {
        console.error(err);
      }
    }
  }

  // ===== FILTER AND SORT LOGIC =====
  // Apply filters and sorting to product list
  function filtered() {
    let list = [...books];

    // Filter by SEARCH QUERY
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      list = list.filter(b =>
        b.title.toLowerCase().includes(lowerQuery) ||
        b.author.toLowerCase().includes(lowerQuery) ||
        (Array.isArray(b.category) ? b.category.some(c => c.toLowerCase().includes(lowerQuery)) : b.category.toLowerCase().includes(lowerQuery))
      );
    }

    // Filter by category
    if (filter.category !== 'all') {
      list = list.filter((b) => {
        if (Array.isArray(b.category)) {
          return b.category.includes(filter.category);
        }
        return b.category === filter.category;
      });
    }

    // Filter by max price
    if (filter.maxPrice) {
      list = list.filter((b) => b.priceUsed <= Number(filter.maxPrice));
    }

    // NEW: Filter by min price
    if (filter.minPrice) {
      list = list.filter((b) => b.priceUsed >= Number(filter.minPrice));
    }

    // Sort products
    if (filter.sort === 'cheap') {
      // Sort by price low to high
      list.sort((a, b) => a.priceUsed - b.priceUsed);
    } else if (filter.sort === 'exp') {
      // Sort by price high to low
      list.sort((a, b) => b.priceUsed - a.priceUsed);
    }

    return list;
  }

  return (
    <section className="shop-container">
      {/* Shop title */}
      <h1>ร้านหนังสือมือสอง</h1>

      {/* Floating Add Product Button for Demo */}
      <button
        onClick={() => setShowAddModal(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 900,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="ลงขายหนังสือ"
      >
        <i className="bi bi-plus"></i>
      </button>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onProductAdded={(updatedList) => {
            // Updated list comes from local storage logic in modal, but we should probably reload here to be safe
            // or just use the passed list
            setBooks(updatedList.filter(b => b.status !== 'closed'));
            setShowAddModal(false);
          }}
        />
      )}

      {/* Filter controls */}
      <div className="shop-filters">
        {/* Category filter dropdown - Expanded Options */}
        <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
          <option value="all">หมวดหมู่: ทั้งหมด</option>
          <option value="นิยาย">นิยาย</option>
          <option value="การ์ตูน">การ์ตูน</option>
          <option value="พัฒนาตนเอง">พัฒนาตนเอง</option>
          <option value="การศึกษา">การศึกษา</option>
          <option value="ประวัติศาสตร์">ประวัติศาสตร์</option>
          <option value="ท่องเที่ยว">ท่องเที่ยว</option>
          <option value="ธุรกิจ">ธุรกิจ</option>
          <option value="เทคโนโลยี">เทคโนโลยี</option>
        </select>

        {/* Max price filter input */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="ราคาต่ำสุด"
            value={filter.minPrice}
            onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
            style={{ width: '100px' }}
          />
          -
          <input
            type="number"
            placeholder="ราคาสูงสุด"
            value={filter.maxPrice}
            onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
            style={{ width: '100px' }}
          />
        </div>

        {/* Sort order dropdown */}
        <select value={filter.sort} onChange={(e) => setFilter({ ...filter, sort: e.target.value })}>
          <option value="new">เรียงตามมาใหม่</option>
          <option value="cheap">ราคา: ถูก-แพง</option>
          <option value="exp">ราคา: แพง-ถูก</option>
        </select>
      </div>

      {/* Product grid */}
      <div className="books-grid">
        {/* Map through filtered books and display each as a card */}
        {filtered().map((book) => (
          <div key={book.id} className="book-card" style={{ position: 'relative' }}>
            {/* Delete Button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(book.id); }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              title="ลบสินค้า"
            >
              <i className="bi bi-trash"></i>
            </button>

            {/* Book image - Clickable to view detail */}
            <div onClick={() => onViewDetail(book)} style={{ cursor: 'pointer' }}>
              <img src={book.image || (book.images && book.images[0]) || 'https://via.placeholder.com/200x300'} alt={book.title} />
            </div>

            {/* Book title */}
            {/* Book title - Clickable */}
            <h3 onClick={() => onViewDetail(book)} style={{ cursor: 'pointer' }}>{book.title}</h3>

            {/* Author name */}
            <p className="author">โดย {book.author}</p>

            {/* Book category - Handle Array or String */}
            <p className="category">
              {Array.isArray(book.category) ? book.category.join(', ') : book.category}
            </p>

            {/* Rating and reviews */}
            <div className="rating">⭐ {book.rating} ({book.reviews} รีวิว)</div>

            {/* Original and used prices */}
            <div className="prices">
              <span className="price-new">ปก: {book.priceNew}฿</span>
              <span className="price-used">มือสอง: {book.priceUsed}฿</span>
            </div>

            {/* Book condition (scratches, markings, etc) */}
            <p className="condition">{book.condition}</p>

            {/* Available stock */}
            <p className="stock">จำนวน: {book.stock}</p>

            {/* Add to cart button */}
            <button onClick={(e) => { e.stopPropagation(); onAddToCart(book); }} className="btn-primary">
              <i className="bi bi-cart-plus"></i> ใส่ตะกร้า
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
