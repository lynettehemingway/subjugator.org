import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const heroRef = useRef(null);
  
  useEffect(() => {
    // Add animation classes after component mounts
    const heroElement = heroRef.current;
    if (heroElement) {
      setTimeout(() => {
        heroElement.classList.add('visible');
      }, 100);
    }
  }, []);

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content" ref={heroRef}>
          <h1>
            Exploring the 
            <span className="text-gradient"> Depths</span>
            <br />
            of Innovation
          </h1>
          <p className="hero-description">
            SubjuGator is UF's autonomous underwater vehicle, pioneering advancements in marine robotics technology
          </p>
          <div className="hero-buttons">
            <Link to="/auv-technology" className="btn btn-primary">
              Discover Our Technology
            </Link>
            <Link to="/robosub" className="btn btn-secondary">
              Learn About RoboSub
            </Link>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-text">SCROLL TO DISCOVER</div>
          <div className="scroll-icon"></div>
        </div>
      </div>
      
      {/* Add more sections as needed */}
    </div>
  );
}

export default Home;