import React, { useState } from 'react';

// ========== LOGIN COMPONENT ==========
// Login and Sign-up page with form handling and user authentication
export default function Login({ onLogin }) {
    // Toggle between login and signup mode
    const [isSignUp, setIsSignUp] = useState(false);

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
    // Update form data when user types in any field
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (error) setError('');
    }

    // ===== HANDLE FIELD BLUR =====
    // Mark field as touched for validation feedback
    function handleBlur(e) {
        setTouched({ ...touched, [e.target.name]: true });
    }

    // ===== VALIDATE EMAIL FORMAT =====
    // Simple email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== VALIDATE FORM =====
    // Check all required fields and formats
    function validateForm() {
        const { name, email, password, confirmPassword } = formData;

        if (!name.trim()) return 'กรุณากรอกชื่อของคุณ';
        if (!email.trim()) return 'กรุณากรอกอีเมลของคุณ';
        if (!isValidEmail(email)) return 'รูปแบบอีเมลไม่ถูกต้อง';
        if (!password) return 'กรุณากรอกรหัสผ่าน';
        if (password.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        if (isSignUp && password !== confirmPassword) return 'รหัสผ่านไม่ตรงกัน';
        if (isSignUp && !formData.phone.trim()) return 'กรุณากรอกเบอร์โทรศัพท์';

        return '';
    }

    // ===== HANDLE FORM SUBMIT =====
    // Validate and submit login/signup form
    function handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        // Show loading state
        setIsLoading(true);

        // Simulate API call with small delay for better UX
        setTimeout(() => {
            setIsLoading(false);
            // Pass user data to parent component (App.jsx)
            onLogin(formData);
            // Reset form after successful submission
            setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'customer', creditBalance: 1000 });
            setError('');
            setTouched({});
        }, 800);
    }

    return (
        <div className="login-container">
            <div className="login-card">
                {/* App logo - gemini.png image */}
                <div className="login-logo">
                    <img src="src\assets\gemini.png" alt="Gemini Logo" className="logo-img" />
                </div>

                {/* App title and description */}

                {/* Error message display */}
                {error && <div className="error-message">{error}</div>}

                {/* Login/Signup form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <h2>{isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</h2>

                    {/* Name input field */}
                    <label>
                        ชื่อ
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                            className={touched.name && !formData.name ? 'input-error' : ''}
                            placeholder="กรุณากรอกชื่อของคุณ"
                        />
                    </label>

                    {/* Email input field */}
                    <label>
                        อีเมล
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                            className={touched.email && !isValidEmail(formData.email) ? 'input-error' : ''}
                            placeholder="example@email.com"
                        />
                    </label>

                    {/* Phone field - only shown in signup mode */}
                    {isSignUp && (
                        <label>
                            เบอร์โทร
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isLoading}
                                className={touched.phone && !formData.phone ? 'input-error' : ''}
                                placeholder="0812345678"
                            />
                        </label>
                    )}

                    {/* Password input field */}
                    <label>
                        รหัสผ่าน
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            disabled={isLoading}
                            className={touched.password && formData.password.length < 6 && formData.password ? 'input-error' : ''}
                            placeholder="อย่างน้อย 6 ตัวอักษร"
                        />
                    </label>

                    {/* Confirm Password field - only shown in signup mode */}
                    {isSignUp && (
                        <label>
                            ยืนยันรหัสผ่าน
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isLoading}
                                className={touched.confirmPassword && formData.confirmPassword !== formData.password && formData.confirmPassword ? 'input-error' : ''}
                                placeholder="ยืนยันรหัสผ่าน"
                            />
                        </label>
                    )}

                    {/* Role selection - only shown in signup mode (customer or seller) */}
                    {isSignUp && (
                        <label>
                            ประเภท
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="customer">ผู้ซื้อ</option>
                                <option value="admin">ผู้ขาย</option>
                            </select>
                        </label>
                    )}

                    {/* Submit button */}
                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ textAlign: 'center', width: '100%' }}>
                        {isLoading ? 'กำลังดำเนินการ...' : (isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ')}
                    </button>
                </form>

                {/* Toggle between login and signup modes */}
                <div className="login-toggle">
                    {isSignUp ? (
                        <p>มีบัญชีแล้ว? <button onClick={() => setIsSignUp(false)}>เข้าสู่ระบบ</button></p>
                    ) : (
                        <p>ยังไม่มีบัญชี? <button onClick={() => setIsSignUp(true)}>สมัครสมาชิก</button></p>
                    )}
                </div>
            </div>
        </div>
    );
}
