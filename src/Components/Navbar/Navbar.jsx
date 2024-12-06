// src/Components/Navbar/Navbar.jsx
import React from "react";
import "./Navbar.css";
import logo from "../Navbar/image.png"

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <img className="logo" src={logo} alt="logo"></img>
        <div className="navbar-buttons">
        <a href="#pets" className="navbar-button">Pets</a>
          <a href="#medical" className="navbar-button">Medical Tracker</a>
          <a href="#vet-finder" className="navbar-button">Vet Finder</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

