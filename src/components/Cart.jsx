import React, { useState } from 'react';

// ========== CART COMPONENT ==========
// Shopping cart page showing items, quantities, discounts, and checkout option
export default function Cart({ items, onRemove, onCheckout, coupons }) {
  // State for coupon code input
  const [couponCode, setCouponCode] = useState('');
  
  // State for applied discount amount
  const [discount, setDiscount] = useState(0);

  // Calculate subtotal: sum of (price × quantity) for all items
  const subtotal = items.reduce((sum, item) => sum + item.priceUsed * item.qty, 0);
  
  // Calculate final total after discount
  const total = subtotal - discount;

  // ===== APPLY COUPON =====
  // Validate and apply coupon code to get discount
  function applyCoupon() {
    // Find matching coupon from available coupons
    const coupon = coupons.find((c) => c.code === couponCode);
    if (coupon) {
      // Calculate discount percentage based on subtotal
      setDiscount((subtotal * coupon.discount) / 100);
      alert(`ใช้คูปอง ${couponCode} สำเร็จ! ลด ${coupon.discount}%`);
      // Clear input after applying coupon
      setCouponCode('');
    } else {
      alert('คูปองไม่ถูกต้อง');
    }
  }

  // Show empty cart message if no items
  if (items.length === 0) {
    return (
      <section className="cart-container">
        <h1>ตะกร้าของคุณ</h1>
        <p className="empty">ตะกร้าว่างเปล่า</p>
      </section>
    );
  }

  return (
    <section className="cart-container">
      {/* Cart title */}
      <h1>ตะกร้าของคุณ</h1>

      {/* List of items in cart */}
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            {/* Item image */}
            <img src={item.image || 'https://via.placeholder.com/80'} alt={item.title} />
            
            {/* Item details */}
            <div className="item-details">
              <h3>{item.title}</h3>
              <p>ราคา: {item.priceUsed}฿ × {item.qty} = {item.priceUsed * item.qty}฿</p>
            </div>
            
            {/* Remove button */}
            <button onClick={() => onRemove(item.id)} className="btn-remove">ลบ</button>
          </div>
        ))}
      </div>

      {/* Cart summary with coupon and totals */}
      <div className="cart-summary">
        {/* Coupon input and apply button */}
        <div className="coupon-section">
          <input
            type="text"
            placeholder="ใส่รหัสคูปอง (เช่น SAVE10)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          />
          <button onClick={applyCoupon} className="btn-coupon">ใช้คูปอง</button>
        </div>

        {/* Subtotal (before discount) */}
        <div className="summary-row">
          <span>รวมย่อย:</span>
          <span>{subtotal}฿</span>
        </div>
        
        {/* Discount amount (only show if discount applied) */}
        {discount > 0 && (
          <div className="summary-row discount">
            <span>ส่วนลด:</span>
            <span>-{discount.toFixed(2)}฿</span>
          </div>
        )}
        
        {/* Final total after discount */}
        <div className="summary-row total">
          <span>รวมทั้งสิ้น:</span>
          <span>{total.toFixed(2)}฿</span>
        </div>

        {/* Checkout button */}
        <button onClick={onCheckout} className="btn-primary btn-lg">
          ไปชำระเงิน
        </button>
      </div>
    </section>
  );
}
