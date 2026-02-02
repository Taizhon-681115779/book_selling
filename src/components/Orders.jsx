import React, { useState } from 'react';

// ========== STATUS LABELS ==========
// Mapping of order status to display labels with icons
const STATUS_LABELS = {
  pending: '⏳ รอชำระเงิน',
  processing: '📦 กำลังเตรียมส่ง',
  shipped: '🚚 ส่งแล้ว',
  delivered: '✅ ส่งถึงแล้ว',
};

// ========== ORDERS COMPONENT ==========
// Order history page showing user's past and current orders with status tracking
export default function Orders({ orders, onBack }) {
  // State to track which order details are expanded
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State for Admin updating tracking number
  const [trackingNo, setTrackingNo] = useState('');

  // MOCK: Handle status update (In real app, this would update backend/App state)
  const [localOrders, setLocalOrders] = useState(orders);

  function updateStatus(id, status) {
    const updated = localOrders.map(o => o.id === id ? { ...o, status, tracking: trackingNo } : o);
    setLocalOrders(updated);
    setTrackingNo('');
    alert('อัปเดตสถานะเรียบร้อย');
  }

  // Show empty state if no orders exist
  if (orders.length === 0) {
    return (
      <section className="orders-container">
        <h1>ออเดอร์ของคุณ</h1>
        <p className="empty">ยังไม่มีออเดอร์</p>
        <button onClick={onBack} className="btn-secondary">← กลับไปร้าน</button>
      </section>
    );
  }

  return (
    <section className="orders-container">
      {/* Page title */}
      <h1>ออเดอร์ของคุณ</h1>

      {/* List of all orders */}
      <div className="orders-list">
        {localOrders.map((order) => (
          <div key={order.id} className="order-card">
            {/* Order header with ID, date, and status badge */}
            <div className="order-header">
              <div>
                <h3>ออเดอร์ {order.id.substring(0, 8)}</h3>
                <p className="date">{new Date(order.createdAt).toLocaleDateString('th-TH')}</p>
              </div>
              <div className="order-status">
                {/* Status badge with color coding (pending=yellow, processing=blue, shipped=purple, delivered=green) */}
                <span className={`status-badge ${order.status}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            </div>

            {/* Items in this order */}
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <span>{item.title}</span>
                  <span>× {item.qty}</span>
                  <span>{item.priceUsed * item.qty}฿</span>
                </div>
              ))}
            </div>

            {/* Order total and expand details button */}
            <div className="order-footer">
              <div className="order-total">รวม: {order.total}฿</div>
              <button
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                className="btn-secondary"
              >
                {selectedOrder === order.id ? 'ซ่อน' : 'ดู'} รายละเอียด
              </button>
            </div>

            {/* Expanded shipping details (shown when order is selected) */}
            {selectedOrder === order.id && (
              <div className="order-details">
                <h4>ที่อยู่จัดส่ง</h4>
                <p>{order.shipping.fullName}</p>
                <p>{order.shipping.phone}</p>
                <p>{order.shipping.address}</p>
                <p>{order.shipping.province} {order.shipping.zipcode}</p>

                {/* Tracking Number Display */}
                {order.tracking && (
                  <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#e0f2fe', borderRadius: '6px' }}>
                    <strong>เลขพัสดุ:</strong> {order.tracking}
                  </div>
                )}

                {/* ADMIN ACTION area (Mocked for demo) */}
                {order.status === 'pending' && (
                  <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <h5>สำหรับผู้ขาย:</h5>
                    <input
                      type="text"
                      placeholder="เลขพัสดุ..."
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginRight: '0.5rem' }}
                    />
                    <button onClick={() => updateStatus(order.id, 'shipped')} className="btn-primary" style={{ padding: '0.5rem', width: 'auto' }}>
                      ยืนยันการส่ง
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Back to shop button */}
      <button onClick={onBack} className="btn-secondary">← กลับไปร้าน</button>
    </section>
  );
}
