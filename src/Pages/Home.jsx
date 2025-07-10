import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaCogs, FaBolt, FaLaptopCode } from "react-icons/fa";
import "../styles/Home.css";



function CountdownCard({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getDiff());

  function getDiff() {
    const diff = new Date(targetDate) - new Date();
    return diff > 0 ? diff : 0;
  }

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getDiff()), 1000);
    return () => clearInterval(id);
  }, []);

  const days  = Math.floor(timeLeft / 8.64e7);
  const hrs   = Math.floor((timeLeft % 8.64e7) / 3.6e6);
  const mins  = Math.floor((timeLeft % 3.6e6) / 6e4);
  const secs  = Math.floor((timeLeft % 6e4) / 1e3);

  return (
    <div className="update-card countdown-card">
      <div className="update-content">
        <h3 className="countdown-title">Countdown to RoboSub 2025</h3>
        <div className="countdown-clock">
          <TimeBox label="Days"  value={days}  />
          <TimeBox label="Hrs"   value={hrs}   />
          <TimeBox label="Min"   value={mins}  />
          <TimeBox label="Sec"   value={secs}  />
        </div>
      </div>
    </div>
  );
}

const TimeBox = ({ value, label }) => (
  <div className="time-box">
    <span className="time-value">{String(value).padStart(2, "0")}</span>
    <span className="time-label">{label}</span>
  </div>
);

function Home() {
  const heroBackgroundRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  
  useEffect(() => {
    // Get the references
    const heroBackground = heroBackgroundRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    
    if (heroBackground && title && subtitle && cta) {
      // Start the animation sequence
      setTimeout(() => {
        title.classList.add("animate-title");
      }, 300);
      
      setTimeout(() => {
        subtitle.classList.add("animate-subtitle");
      }, 500); // This timing creates a slight overlap with title animation
      
      setTimeout(() => {
        cta.classList.add("animate-cta");
      }, 800); // This starts as the subtitle is still animating
      
      // Then fade in the background
      setTimeout(() => {
        heroBackground.classList.add("animate-fadeIn");
      }, 1200);
    }

    // Handle scroll for parallax effects
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxElements = document.querySelectorAll(".parallax");

      parallaxElements.forEach((element) => {
        if (element.dataset && element.dataset.speed) {
          const speed = element.dataset.speed || 0.2;
          element.style.transform = `translateY(${scrollY * speed}px)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background" ref={heroBackgroundRef}>
          {/* Background image will be set in CSS */}
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title" ref={titleRef}>
              SubjuGator
            </h1>
            <p className="hero-subtitle" ref={subtitleRef}>
              Exploring the Depths of Innovation
            </p>
            <div className="hero-cta" ref={ctaRef}>
              <Link to="/auv-technology#overview" className="btn btn-primary">
                Explore Technology
              </Link>
              <Link to="/robosub#top" className="btn btn-secondary">
                Learn About RoboSub
              </Link>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-icon"></div>
          <p className="scroll-text">SCROLL TO DISCOVER</p>
        </div>
      </section>

      {/* Innovation Overview */}
      <section className="overview-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="text-center">Pushing Boundaries</h2>
            <p className="text-center subtitle">
              Advancing autonomous underwater technology through innovation and
              excellence
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">26+</div>
              <div className="stat-label">Years of Development</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">9</div>
              <div className="stat-label">Generations of AUVs</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Competition Awards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Highlights */}
      <section className="tech-highlights-section section">
        <div className="highlight-image">
          {/* Background image will be set in CSS */}
        </div>
        <div className="container">
          <div className="highlight-content">
            <h2>
              Advanced <span className="text-gradient-blue">Technology</span>
            </h2>
            <p>
              SubjuGator features cutting-edge systems including adaptive
              control mechanisms, electro-mechanical actuation, and
              state-of-the-art software innovations.
            </p>
            <div className="tech-features">
              <div className="feature">
                <span className="feature-icon">
                  <FaCogs />
                </span>
                <div className="feature-text">
                  <h3>Mechanical</h3>
                  <p>
                    Precision-engineered chassis with servo-actuated systems
                  </p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">
                  <FaBolt />
                </span>
                <div className="feature-text">
                  <h3>Electrical</h3>
                  <p>Custom PCBs and advanced sensor integration</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">
                  <FaLaptopCode />
                </span>
                <div className="feature-text">
                  <h3>Software</h3>
                  <p>
                    ROS-based architecture with computer vision and deep
                    learning
                  </p>
                </div>
              </div>
            </div>
            <Link to="/auv-technology#tech-specs" className="btn btn-primary">
              Explore Full Capabilities
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="updates-section section">
        <div className="container">
          <div className="section-header">
            <h2 className="text-center">Latest Updates</h2>
          </div>

          <div className="updates-grid">
            {/* — 1 — */}
            <div className="update-card">
              <div className="update-image image-sub9" /> {/* add bg via CSS */}
              <div className="update-content">
                
                <h3>SubjuGator 9 Development</h3>
                <p>
                  Progress on our new AUV including aluminum chassis
                  completion and electronics hull integration.
                </p>
                <Link to="/auv-technology" className="read-more">Read More</Link>
              </div>
            </div>

            {/* — 2 — */}
            <CountdownCard targetDate="2025-08-11T00:00:00-04:00" />

            {/* — 3 — */}
            <div className="update-card middle-offset">
              <div className="update-image image-robosub" />
              <div className="update-content">
                
                <h3>RoboSub 2025 Preparation</h3>
                <p>
                  Team testing and technology refinement for the upcoming
                  competition season.
                </p>
                <Link to="/robosub#competition-strategy" className="read-more">Read More</Link>
              </div>
            </div>  
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join the Journey</h2>
            <p>
              Be part of the next generation of autonomous underwater
              technology. Connect with our team or support our mission.
            </p>
            <div className="cta-buttons">
              <Link to="/ourteam#top-team" className="btn btn-primary">
                Meet Our Team
              </Link>
              <Link
                to="/sponsors#top-sponsor"
                className="btn btn-secondary"
                onClick={() => {
                  const el = document.querySelector("#top-sponsor");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Become a Sponsor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;