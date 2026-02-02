import React, { useState } from 'react';

// ========== CONSTANTS ==========
const CATEGORIES = [
    "นิยาย",
    "การ์ตูน",
    "พัฒนาตนเอง",
    "การศึกษา",
    "ประวัติศาสตร์",
    "ท่องเที่ยว",
    "ธุรกิจ",
    "เทคโนโลยี"
];

// ========== ADD PRODUCT MODAL ==========
// Popup form for adding a new product to inventory
export default function AddProductModal({ onClose, onProductAdded }) {
    const [form, setForm] = useState({
        title: '',
        author: '',
        priceUsed: '',
        priceNew: '',
        categories: [], // Changed from single string to array
        condition: '95%',
        stock: 1,
        images: []
    });

    const [isLoading, setIsLoading] = useState(false);

    // Handle Text Input Change
    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    // Handle Category Toggle
    function handleCategoryChange(category) {
        setForm(prev => {
            const isSelected = prev.categories.includes(category);
            if (isSelected) {
                return { ...prev, categories: prev.categories.filter(c => c !== category) };
            } else {
                return { ...prev, categories: [...prev.categories, category] };
            }
        });
    }

    // Handle Image Upload
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

    // Handle Submit
    function handleSubmit(e) {
        e.preventDefault();

        if (form.categories.length === 0) {
            alert('กรุณาเลือกหมวดหมู่อย่างน้อย 1 หมวด');
            return;
        }

        setIsLoading(true);

        // Simulate API/Processing
        setTimeout(() => {
            const newProduct = {
                id: 'b_' + Date.now(),
                ...form,
                category: form.categories, // Save as array (kept field name 'category' for compatibility if needed, or better 'categories')
                priceUsed: Number(form.priceUsed),
                priceNew: Number(form.priceNew) || 0,
                stock: Number(form.stock),
                rating: 0,
                reviews: 0,
                status: 'active',
                createdAt: new Date().toISOString()
            };

            // Save to LocalStorage
            try {
                const existing = JSON.parse(localStorage.getItem('book_inventory')) || [];
                const updated = [...existing, newProduct];
                localStorage.setItem('book_inventory', JSON.stringify(updated));

                // Notify parent
                if (onProductAdded) onProductAdded(updated);

                onClose();
            } catch (err) {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }, 600);
    }

    return (
        <>
            <div className="login-overlay" onClick={onClose}></div>
            <div className="login-container">
                <div className="login-card" style={{ maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                    <button className="close-modal-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <h2 style={{ marginBottom: '1.5rem', color: '#7c3aed' }}>ลงขายหนังสือ</h2>

                    <form onSubmit={handleSubmit} className="login-form">
                        <label>
                            ชื่อหนังสือ
                            <input name="title" value={form.title} onChange={handleChange} required placeholder="เช่น Harry Potter" />
                        </label>

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <label>
                                ผู้แต่ง
                                <input name="author" value={form.author} onChange={handleChange} required placeholder="ชื่อผู้แต่ง" />
                            </label>
                        </div>

                        <label>หมวดหมู่ (เลือกได้มากกว่า 1)</label>
                        <div className="category-selector" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => handleCategoryChange(cat)}
                                    style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        border: `1px solid ${form.categories.includes(cat) ? '#7c3aed' : '#ddd'}`,
                                        background: form.categories.includes(cat) ? '#f3e8ff' : '#fff',
                                        color: form.categories.includes(cat) ? '#7c3aed' : '#666',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <label>
                                ราคามือสอง (บาท)
                                <input type="number" name="priceUsed" value={form.priceUsed} onChange={handleChange} required placeholder="100" />
                            </label>
                            <label>
                                ราคาปก (บาท)
                                <input type="number" name="priceNew" value={form.priceNew} onChange={handleChange} placeholder="250" />
                            </label>
                        </div>

                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <label>
                                สภาพสินค้า
                                <input name="condition" value={form.condition} onChange={handleChange} placeholder="เช่น 95% ไม่มีรอย" />
                            </label>
                            <label>
                                จำนวน
                                <input type="number" name="stock" value={form.stock} onChange={handleChange} min="1" />
                            </label>
                        </div>

                        <label>
                            รูปภาพ
                            <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ padding: '0.5rem' }} />
                        </label>

                        {/* Image Preview */}
                        {form.images.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.5rem 0' }}>
                                {form.images.map((img, idx) => (
                                    <img key={idx} src={img} alt="preview" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }} />
                                ))}
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '1rem' }}>
                            {isLoading ? 'กำลังบันทึก...' : 'ลงขายทันที'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
