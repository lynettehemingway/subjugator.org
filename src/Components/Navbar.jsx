import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const handleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = menuOpen ? "auto" : "hidden";
  };

  // Close mobile menu when clicking on a link
  const closeMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
      document.body.style.overflow = "auto";
    }
  };

  // Check if the link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle scroll event for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo-link nav-logo" onClick={closeMenu}>
        </Link>

        {/* Navigation */}
        <nav className="nav-wrapper">
          <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
            <li>
              <Link
                to="/"
                className={isActive("/") ? "active" : ""}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/aboutus"
                className={isActive("/aboutus") ? "active" : ""}
                onClick={closeMenu}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/robosub"
                className={isActive("/robosub") ? "active" : ""}
                onClick={closeMenu}
              >
                RoboSub
              </Link>
            </li>
            <li>
              <Link
                to="/auv-technology"
                className={isActive("/auv-technology") ? "active" : ""}
                onClick={closeMenu}
              >
                AUV Technology
              </Link>
            </li>
            <li>
              <Link
                to="/sponsors"
                className={isActive("/sponsors") ? "active" : ""}
                onClick={closeMenu}
              >
                Sponsors
              </Link>
            </li>
            <li>
              <Link
                to="/ourteam"
                className={isActive("/ourteam") ? "active" : ""}
                onClick={closeMenu}
              >
                Our Team
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={isActive("/contact") ? "active" : ""}
                onClick={closeMenu}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* Hamburger menu */}
        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={handleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;