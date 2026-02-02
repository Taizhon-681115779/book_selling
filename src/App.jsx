import React, { useState } from "react";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProductManager from "./components/ProductManager";
import Login from "./components/Login";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";

// ========== NAVBAR COMPONENT ==========
// Navigation bar displayed at top of page with logo, search, cart, and user menu
function Navbar({ user, onLogout, cartCount, onViewCart, onLogoClick, onAdminClick }) {
	// State for search input value
	const [query, setQuery] = useState("");

	// Handle search form submission
	function handleSubmit(e) {
		e.preventDefault();
		console.log("Search:", query);
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
						placeholder="Search..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						aria-label="Search site"
					/>
					<button className="search-button" type="submit">Search</button>
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
					) : null}
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
	
	// Current view/page being displayed (shop, cart, checkout, orders, admin)
	const [view, setView] = useState('shop');
	
	// Shopping cart items
	const [cart, setCart] = useState([]);
	
	// User's order history
	const [orders, setOrders] = useState([]);
	
	// Available discount coupons
	const [coupons] = useState([
		{ code: 'SAVE10', discount: 10 },
		{ code: 'SAVE20', discount: 20 },
	]);

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
		const order = {
			id: 'ord_' + Date.now(),
			items: cart,
			...orderData,
			status: 'pending',
			createdAt: new Date(),
		};
		// Add order to orders list
		setOrders((prev) => [order, ...prev]);
		// Clear cart after checkout
		setCart([]);
		// Navigate to orders view
		setView('orders');
		alert('ออเดอร์สำเร็จ!');
	}

	// ===== GO TO HOMEPAGE =====
	// Navigate back to shop page (home)
	function goToHomepage() {
		if (user) {
			setView('shop');
		}
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
			/>
			
			{/* Main content area - shows different pages based on view state */}
			<main className="main-content">
				{/* Show login page if not logged in */}
				{!user ? (
					<Login onLogin={setUser} />
				) 
				// Show shop page (product listing)
				: view === 'shop' ? (
					<Shop onAddToCart={addToCart} />
				) 
				// Show shopping cart
				: view === 'cart' ? (
					<Cart 
						items={cart} 
						onRemove={removeFromCart}
						onCheckout={() => setView('checkout')}
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
				: null}
			</main>
		</div>
	);
}

export default App;
