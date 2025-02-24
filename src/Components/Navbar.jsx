import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  return (
    <div className="header">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo-link">
          <img
            src="/src/assets/logo.png"
            alt="Subjugator Logo"
            className="nav-logo"
          />
        </Link>

        {/* Navigation */}
        <nav className="nav-wrapper">
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li>
              <Link to="/" onClick={() => setClick(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/aboutus" onClick={() => setClick(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/robosub" onClick={() => setClick(false)}>
                RoboSub
              </Link>
            </li>
            <li>
              <Link to="/auv-technology" onClick={() => setClick(false)}>
                AUV Technology
              </Link>
            </li>
            <li>
              <Link to="/sponsors" onClick={() => setClick(false)}>
                Sponsors
              </Link>
            </li>
            <li>
              <Link to="/ourteam" onClick={() => setClick(false)}>
                Our Team
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setClick(false)}>
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Hamburger icon for mobile */}
        <div className="hamburger" onClick={handleClick}>
          {click ? (
            <FaTimes size={20} style={{ color: "#fff" }} />
          ) : (
            <FaBars size={20} style={{ color: "#fff" }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
