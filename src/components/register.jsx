import React, { useState } from 'react';

// ========== REGISTER COMPONENT ==========
// Full screen registration page
export default function Register({ onRegister, onLoginClick }) {
    // Form data state for all input fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer', // Default role is customer, can be admin (seller)
        creditBalance: 1000 // Mock initial credit for new users
    });

    // Loading state during form submission
    const [isLoading, setIsLoading] = useState(false);

    // Error message display
    const [error, setError] = useState('');

    // Form validation state for better UX
    const [touched, setTouched] = useState({});

    // ===== HANDLE INPUT CHANGE =====
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError('');
    }

    // ===== HANDLE FIELD BLUR =====
    function handleBlur(e) {
        setTouched({ ...touched, [e.target.name]: true });
    }

    // ===== VALIDATE EMAIL FORMAT =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== VALIDATE FORM =====
    function validateForm() {
        const { name, email, password, confirmPassword, phone } = formData;

        if (!name.trim()) return 'กรุณากรอกชื่อของคุณ';
        if (!email.trim()) return 'กรุณากรอกอีเมลของคุณ';
        if (!isValidEmail(email)) return 'รูปแบบอีเมลไม่ถูกต้อง';
        if (!phone.trim()) return 'กรุณากรอกเบอร์โทรศัพท์';
        if (!password) return 'กรุณากรอกรหัสผ่าน';
        if (password.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        if (password !== confirmPassword) return 'รหัสผ่านไม่ตรงกัน';

        return '';
    }

    // ===== HANDLE FORM SUBMIT =====
    function handleSubmit(e) {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            onRegister(formData);
        }, 800);
    }

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h2>สมัครสมาชิกใหม่</h2>
                    <p>กรอกข้อมูลเพื่อเริ่มต้นใช้งาน Book2Hand</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label>ชื่อ-นามสกุล</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.name && !formData.name ? 'input-error' : ''}
                            placeholder="ชื่อ-นามสกุล ของคุณ"
                        />
                    </div>

                    <div className="form-group">
                        <label>อีเมล</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.email && !isValidEmail(formData.email) ? 'input-error' : ''}
                            placeholder="example@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>เบอร์โทรศัพท์</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={touched.phone && !formData.phone ? 'input-error' : ''}
                            placeholder="08xxxxxxxx"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>รหัสผ่าน</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.password && formData.password.length < 6 ? 'input-error' : ''}
                                placeholder="ขั้นต่ำ 6 ตัวอักษร"
                            />
                        </div>
                        <div className="form-group">
                            <label>ยืนยันรหัสผ่าน</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={touched.confirmPassword && formData.confirmPassword !== formData.password ? 'input-error' : ''}
                                placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                            />
                        </div>
                    </div>



                    <button type="submit" className="btn-register" disabled={isLoading}>
                        {isLoading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก'}
                    </button>
                </form>

                <div className="register-footer">
                    <p>มีบัญชีอยู่แล้ว? <button onClick={onLoginClick} className="btn-link">เข้าสู่ระบบ</button></p>
                </div>
            </div>
        </div>
    );
}
