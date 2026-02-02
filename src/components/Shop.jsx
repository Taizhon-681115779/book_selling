import React, { useState, useEffect } from 'react';

// ========== STORAGE KEY ==========
// Key for accessing products from browser's localStorage (shared with ProductManager)
const STORAGE_KEY = 'book_inventory';

// ========== DEFAULT SAMPLE BOOKS ==========
// Default books shown when no products in inventory (for demo purposes)
const DEFAULT_BOOKS = [
  {
    id: 'b_1',
    title: 'นิยายคลาสสิก',
    author: 'ผู้แต่ง ตัวอย่าง',
    category: 'นิยาย',
    priceNew: 250,
    priceUsed: 120,
    condition: '90% - มีรอยขีดเขียนเล็กน้อย',
    stock: 1,
    rating: 4.5,
    reviews: 8,
    image: 'https://via.placeholder.com/200x300?text=Book1',
  },
  {
    id: 'b_2',
    title: 'การ์ตูนสนุก',
    author: 'นักวาด',
    category: 'การ์ตูน',
    priceNew: 300,
    priceUsed: 150,
    condition: '95% - เกือบใหม่',
    stock: 2,
    rating: 4.8,
    reviews: 12,
    image: 'https://via.placeholder.com/200x300?text=Book2',
  },
];

// ========== SHOP COMPONENT ==========
// Product listing page with filtering and sorting capabilities
// Displays books from admin-managed inventory (ProductManager)
export default function Shop({ onAddToCart }) {
  // State: List of active books loaded from localStorage
  const [books, setBooks] = useState([]);
  
  // Filter and sort state
  const [filter, setFilter] = useState({ 
    category: 'all', // Filter by book category
    maxPrice: '', // Maximum price filter
    sort: 'new' // Sort order (new, cheap, exp)
  });

  // ===== LOAD BOOKS FROM STORAGE =====
  // Load inventory from localStorage when component mounts
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      // Only show active books (status !== 'closed')
      const activeBooks = stored.filter((b) => b.status !== 'closed');
      setBooks(activeBooks.length > 0 ? activeBooks : DEFAULT_BOOKS);
    } catch (e) {
      setBooks(DEFAULT_BOOKS);
    }
  }, []);

  // ===== FILTER AND SORT LOGIC =====
  // Apply filters and sorting to product list
  function filtered() {
    let list = [...books];
    
    // Filter by category
    if (filter.category !== 'all') {
      list = list.filter((b) => b.category === filter.category);
    }
    
    // Filter by max price
    if (filter.maxPrice) {
      list = list.filter((b) => b.priceUsed <= Number(filter.maxPrice));
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

      {/* Filter controls */}
      <div className="shop-filters">
        {/* Category filter dropdown */}
        <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
          <option value="all">หมวดหมู่: ทั้งหมด</option>
          <option value="นิยาย">นิยาย</option>
          <option value="การ์ตูน">การ์ตูน</option>
          <option value="พัฒนาตนเอง">พัฒนาตนเอง</option>
        </select>

        {/* Max price filter input */}
        <input
          type="number"
          placeholder="ราคาสูงสุด (มือสอง)"
          value={filter.maxPrice}
          onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
        />

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
          <div key={book.id} className="book-card">
            {/* Book image */}
            <img src={book.image} alt={book.title} />
            
            {/* Book title */}
            <h3>{book.title}</h3>
            
            {/* Author name */}
            <p className="author">โดย {book.author}</p>
            
            {/* Book category */}
            <p className="category">{book.category}</p>
            
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
            <button onClick={() => onAddToCart(book)} className="btn-primary">
              <i className="bi bi-cart-plus"></i> ใส่ตะกร้า
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
