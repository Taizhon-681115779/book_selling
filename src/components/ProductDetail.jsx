import React, { useState } from 'react';

// ========== PRODUCT DETAIL COMPONENT ==========
// Displays full details of a single book including multiple images and condition
export default function ProductDetail({ product, onBack, onAddToCart }) {
    // Fix unsafe access to images prop (legacy data protection)
    const [mainImage, setMainImage] = useState((product.images && product.images.length > 0 ? product.images[0] : null) || product.image || 'https://via.placeholder.com/300');

    return (
        <section className="product-detail-container">
            <button onClick={onBack} className="btn-secondary">← กลับหน้าร้าน</button>

            <div className="product-detail-content">
                {/* Gallery Section */}
                <div className="product-gallery">
                    <div className="main-image">
                        <img src={mainImage} alt={product.title} />
                    </div>
                    {product.images && product.images.length > 0 && (
                        <div className="thumbnail-list">
                            {product.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumbnail ${idx}`}
                                    className={mainImage === img ? 'active' : ''}
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="product-info">
                    <h1>{product.title}</h1>
                    <p className="author">โดย {product.author}</p>
                    <div className="rating">⭐ {product.rating || '-'}</div>

                    <div className="prices-large">
                        <span className="price-new">ปก: {product.priceNew}฿</span>
                        <span className="price-used">มือสอง: {product.priceUsed}฿</span>
                    </div>

                    <div className="meta-info">
                        <p><strong>ISBN:</strong> {product.isbn || '-'}</p>
                        <p><strong>สำนักพิมพ์:</strong> {product.publisher || '-'}</p>
                        <p><strong>ปีที่พิมพ์:</strong> {product.year || '-'}</p>
                        <p><strong>หมวดหมู่:</strong> {Array.isArray(product.category) ? product.category.join(', ') : product.category}</p>
                        <p><strong>จำนวนคงเหลือ:</strong> {product.stock} เล่ม</p>
                    </div>

                    <div className="condition-section">
                        <h3>สภาพสินค้า</h3>
                        <p className="condition-badge">{product.condition}</p>
                        <p className="condition-detail">{product.conditionDetail || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                    </div>

                    <div className="action-buttons">
                        <button onClick={() => onAddToCart(product)} className="btn-primary btn-lg">
                            <i className="bi bi-cart-plus"></i> ใส่ตะกร้า
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
