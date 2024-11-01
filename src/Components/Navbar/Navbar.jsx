// src/Components/Navbar/Navbar.jsx
import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-title">PetGuardian</div>
        <div className="navbar-buttons">
          <button className="navbar-button">Home</button>
          <button className="navbar-button">Daily Breakdown</button>
          {/* Add more buttons as needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

