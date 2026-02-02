import React, { useState } from 'react';

// ========== LOGIN COMPONENT ==========
// ========== LOGIN COMPONENT ==========
// Login and Sign-up page with form handling and user authentication
export default function Login({ onLogin, onClose, onRegisterClick }) {
    // Form data state for all input fields
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        const { email, password } = formData;

        if (!email.trim()) return 'กรุณากรอกอีเมลของคุณ';
        if (!isValidEmail(email)) return 'รูปแบบอีเมลไม่ถูกต้อง';
        if (!password) return 'กรุณากรอกรหัสผ่าน';

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
            // Mocking a successful login with a default name for now since we removed the name field
            onLogin({ ...formData, name: 'User', role: 'customer', creditBalance: 1000 });
            // Reset form after successful submission
            setFormData({ email: '', password: '' });
            setError('');
            setTouched({});
        }, 800);
    }

    return (
        <>
            {/* Backdrop Overlay */}
            <div className="login-overlay" onClick={onClose}></div>

            <div className="login-container">
                <div className="login-card">
                    {/* Close Button */}
                    <button className="close-modal-btn" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    {/* App logo - gemini.png image */}
                    <div className="login-logo">
                        <img src="src\assets\gemini.png" alt="Gemini Logo" className="logo-img" />
                    </div>

                    {/* App title and description */}

                    {/* Error message display */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>เข้าสู่ระบบ</h2>

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
                                className={touched.password && !formData.password ? 'input-error' : ''}
                                placeholder="รหัสผ่านของคุณ"
                            />
                        </label>

                        {/* Submit button */}
                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ textAlign: 'center', width: '100%' }}>
                            {isLoading ? 'กำลังดำเนินการ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </form>

                    {/* Footer - Create Account Link */}
                    <div className="login-toggle">
                        <p>ยังไม่มีบัญชี? <button onClick={onRegisterClick}>สมัครสมาชิก</button></p>
                    </div>
                </div>
            </div>
        </>
    );
}
