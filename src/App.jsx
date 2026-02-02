import React, { useState } from "react";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProductManager from "./components/ProductManager";
import Login from "./components/Login";
import Register from "./components/register";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import ProductDetail from "./components/ProductDetail";

// ========== NAVBAR COMPONENT ==========
// Navigation bar displayed at top of page with logo, search, cart, and user menu
function Navbar({ user, onLogout, cartCount, onViewCart, onLogoClick, onAdminClick, onLoginClick, onSearch }) {
	// State for search input value
	const [query, setQuery] = useState("");

	// Handle search form submission
	function handleSubmit(e) {
		e.preventDefault();
		onSearch(query);
	}

	return (
		<nav className="navbar">
			<div className="navbar-inner">
				{/* Logo - clickable to go back to shop homepage */}
				<div className="navbar-logo" onClick={onLogoClick} style={{ cursor: 'pointer' }}>
					<i className="bi bi-book"></i> Book2Hand
				</div>

				{/* Search bar for products */}
				<form className="navbar-search" onSubmit={handleSubmit} role="search">
					<input
						className="search-input"
						type="search"
						placeholder="ค้นหาหนังสือ..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						aria-label="Search site"
					/>
					<button className="search-button" type="submit">ค้นหา</button>
				</form>

				{/* Right side actions - Cart button and User menu */}
				<div className="navbar-actions">
					{/* Admin panel button - only for sellers (role === 'admin') */}
					{user?.role === 'admin' && (
						<button onClick={onAdminClick} className="admin-btn" title="จัดการสินค้า">
							<i className="bi bi-gear"></i>จัดการ
						</button>
					)}

					{/* Cart button shows number of items */}
					<button onClick={onViewCart} className="cart-btn">
						<i className="bi bi-cart3"></i>Cart ({cartCount})
					</button>

					{/* User menu displays only when logged in */}
					{user ? (
						<div className="user-menu">
							<span>สวัสดี, {user.name}</span>
							<button onClick={onLogout} className="logout-btn">ออกจากระบบ</button>
						</div>
					) : (
						/* Show Login button if not logged in */
						<button onClick={onLoginClick} className="cart-btn">
							<i className="bi bi-person"></i> เข้าสู่ระบบ
						</button>
					)}
				</div>

				{/* Navigation links */}
				<div className="navbar-links">
					<a href="#home" className="navbar-link">หน้าแรก</a>
					<a href="#shop" className="navbar-link">ร้าน</a>
					<a href="#about" className="navbar-link">เกี่ยวกับ</a>
				</div>
			</div>
		</nav>
	);
}

// ========== MAIN APP COMPONENT ==========
// Main application component managing all state and page navigation
function App() {
	// Current logged-in user data
	const [user, setUser] = useState(null);

	// Login Modal Visibility State
	const [isLoginVisible, setIsLoginVisible] = useState(false);

	// Current view/page being displayed (shop, cart, checkout, orders, admin)
	const [view, setView] = useState('shop');

	// Shopping cart items
	const [cart, setCart] = useState([]);

	// Global Search Query
	const [searchQuery, setSearchQuery] = useState("");

	// User's order history
	const [orders, setOrders] = useState([]);

	// Available discount coupons
	const [coupons] = useState([
		{ code: 'SAVE10', discount: 10 },
		{ code: 'SAVE20', discount: 20 },
	]);

	// NEW: Selected product for ProductDetail view
	const [selectedProduct, setSelectedProduct] = useState(null);

	// ===== ADD TO CART =====
	// Add a product to cart or increase quantity if already exists
	function addToCart(product) {
		setCart((prev) => {
			const existing = prev.find((p) => p.id === product.id);
			if (existing) {
				// If product exists, increase quantity
				return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
			}
			// If new product, add with quantity 1
			return [...prev, { ...product, qty: 1 }];
		});
	}

	// ===== REMOVE FROM CART =====
	// Remove a product from cart by ID
	function removeFromCart(id) {
		setCart((prev) => prev.filter((p) => p.id !== id));
	}

	// ===== CHECKOUT =====
	// Create an order from cart items and shipping info
	function checkout(orderData) {
		// Calculate Total
		const total = cart.reduce((sum, item) => sum + (item.priceUsed * item.qty), 0);

		// Check Credit
		if (user && user.creditBalance < total) {
			alert('ยอดเงินคงเหลือไม่พอ กรุณาเติมเงิน');
			return;
		}

		const order = {
			id: 'ord_' + Date.now(),
			items: cart,
			...orderData,
			total: total, // Save total to order
			status: 'pending',
			createdAt: new Date(),
		};

		// Deduct Credit (Update User State)
		if (user) {
			setUser({ ...user, creditBalance: user.creditBalance - total });
		}

		// Add order to orders list
		setOrders((prev) => [order, ...prev]);
		// Clear cart after checkout
		setCart([]);
		// Navigate to orders view
		setView('orders');
		alert(`สั่งซื้อสำเร็จ! หักเครดิตเรียบร้อย (คงเหลือ: ${user.creditBalance - total}฿)`);
	}

	// ===== GO TO HOMEPAGE =====
	// Navigate back to shop page (home)
	function goToHomepage() {
		setView('shop');
		setSelectedProduct(null);
		setSearchQuery(""); // Reset search on home
	}

	// ===== VIEW PRODUCT DETAIL =====
	function handleViewDetail(product) {
		setSelectedProduct(product);
		setView('product-detail');
	}

	// ===== HANDLE CHECKOUT CLICK =====
	function handleCheckoutClick() {
		if (!user) {
			setIsLoginVisible(true);
		} else {
			setView('checkout');
		}
	}

	// ===== HANDLE REGISTER =====
	function handleRegister(userData) {
		setUser(userData);
		setView('shop');
	}

	// ===== HANDLE SEARCH =====
	function handleSearch(query) {
		setSearchQuery(query);
		setView('shop'); // Ensure we are on shop view to see results
	}

	return (
		<div className="app-container">
			{/* Navbar with navigation */}
			<Navbar
				user={user}
				onLogout={() => setUser(null)}
				cartCount={cart.length}
				onViewCart={() => setView('cart')}
				onLogoClick={goToHomepage}
				onAdminClick={() => setView('admin')}
				onLoginClick={() => setIsLoginVisible(true)}
				onSearch={handleSearch}
			/>

			{/* Main content area - shows different pages based on view state */}
			<main className="main-content">

				{/* Show shop page (product listing) */}
				{view === 'shop' ? (
					<Shop
						onAddToCart={addToCart}
						onViewDetail={handleViewDetail}
						searchQuery={searchQuery}
					/>
				)
					// Show product detail
					: view === 'product-detail' && selectedProduct ? (
						<ProductDetail
							product={selectedProduct}
							onBack={() => setView('shop')}
							onAddToCart={addToCart}
						/>
					)
						// Show shopping cart
						: view === 'cart' ? (
							<Cart
								items={cart}
								onRemove={removeFromCart}
								onCheckout={handleCheckoutClick}
								coupons={coupons}
							/>
						)
							// Show checkout form
							: view === 'checkout' ? (
								<Checkout
									cartItems={cart}
									onConfirm={checkout}
									onBack={() => setView('cart')}
								/>
							)
								// Show orders history
								: view === 'orders' ? (
									<Orders orders={orders} onBack={() => setView('shop')} />
								)
									// Show admin panel (only for admin users)
									: view === 'admin' && user?.role === 'admin' ? (
										<ProductManager />
									)
										// Show Register page
										: view === 'register' ? (
											<Register
												onRegister={handleRegister}
												onLoginClick={() => {
													setView('shop');
													setIsLoginVisible(true);
												}}
											/>
										)
											: null}
			</main>

			{/* Login Modal */}
			{isLoginVisible && (
				<Login
					onLogin={(userData) => {
						setUser(userData);
						setIsLoginVisible(false);
					}}
					onClose={() => setIsLoginVisible(false)}
					onRegisterClick={() => {
						setIsLoginVisible(false);
						setView('register');
					}}
				/>
			)}
		</div>
	);
}

export default App;
