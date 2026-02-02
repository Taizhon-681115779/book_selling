import React from "react";
import "./App.css";

function Navbar() {
	return (
		<nav className="navbar">
			<div className="navbar-logo">MyLogo</div>
			<div className="navbar-links">
				<a href="#home" className="navbar-link">Home</a>
				<a href="#about" className="navbar-link">About</a>
				<a href="#contact" className="navbar-link">Contact</a>
			</div>
		</nav>
	);
}

function App() {
	return (
		<div>
			<Navbar />
			{/* ...existing code... */}
		</div>
	);
}

export default App;
