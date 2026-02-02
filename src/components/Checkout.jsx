import React, { useState } from 'react';

// ========== CHECKOUT COMPONENT ==========
// Checkout page for collecting shipping information and confirming order
export default function Checkout({ cartItems, onConfirm, onBack }) {
  // State for shipping form data
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    province: '',
    zipcode: '',
  });

  // ===== HANDLE INPUT CHANGE =====
  // Update form data when user types in shipping fields
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // ===== HANDLE FORM SUBMIT =====
  // Validate shipping info and confirm order
  function handleSubmit(e) {
    e.preventDefault();
    // Check required fields
    if (formData.fullName && formData.phone && formData.address) {
      // Calculate total and pass to parent
      onConfirm({
        shipping: formData,
        total: cartItems.reduce((sum, item) => sum + item.priceUsed * item.qty, 0),
      });
    } else {
      alert('กรุณากรอกข้อมูลจัดส่งให้ครบถ้วน');
    }
  }

  // Calculate order total
  const total = cartItems.reduce((sum, item) => sum + item.priceUsed * item.qty, 0);

  return (
    <section className="checkout-container">
      {/* Page title */}
      <h1>ชำระเงิน</h1>

      {/* Two-column layout: form on left, summary on right */}
      <div className="checkout-content">
        {/* Shipping information form */}
        <div className="checkout-form">
          <h2>ที่อยู่จัดส่ง</h2>
          <form onSubmit={handleSubmit}>
            {/* Full name field */}
            <label>
              ชื่อ-นามสกุล
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </label>

            {/* Phone number field */}
            <label>
              เบอร์โทร
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>

            {/* Address field (textarea for multi-line) */}
            <label>
              ที่อยู่
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
              />
            </label>

            {/* Province field */}
            <label>
              จังหวัด
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
              />
            </label>

            {/* Postal code field */}
            <label>
              รหัสไปรษณีย์
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                required
              />
            </label>

            {/* Confirm order button */}
            <button type="submit" className="btn-primary btn-lg">
              ยืนยันการสั่งซื้อ
            </button>
          </form>
        </div>

        {/* Order summary panel */}
        <div className="checkout-summary">
          <h2>สรุปการสั่งซื้อ</h2>
          
          {/* List each item in cart with quantity and subtotal */}
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.title} × {item.qty}</span>
              <span>{item.priceUsed * item.qty}฿</span>
            </div>
          ))}
          
          {/* Order total */}
          <div className="summary-total">
            <span>รวมทั้งสิ้น:</span>
            <span>{total}฿</span>
          </div>
        </div>
      </div>

      {/* Back to cart button */}
      <button onClick={onBack} className="btn-secondary">
        ← กลับไปตะกร้า
      </button>
    </section>
  );
}
