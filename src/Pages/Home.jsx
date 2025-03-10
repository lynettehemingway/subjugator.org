import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaCogs, FaBolt, FaLaptopCode } from "react-icons/fa";
import "../styles/Home.css";

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
              <Link to="/auv-technology" className="btn btn-primary">
                Explore Technology
              </Link>
              <Link to="/robosub" className="btn btn-secondary">
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
              <div className="stat-number">8</div>
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
            <Link to="/auv-technology" className="btn btn-primary">
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
            <div className="update-card">
              <div className="update-image">
                {/* Update image will be background in CSS */}
              </div>
              <div className="update-content">
                <span className="update-date">February 28, 2025</span>
                <h3>SubjuGator 9 Development</h3>
                <p>
                  Progress on our next-generation AUV including aluminum chassis
                  completion and electronics hull integration.
                </p>
                <Link to="/news" className="read-more">
                  Read More
                </Link>
              </div>
            </div>

            <div className="update-card">
              <div className="update-image">
                {/* Update image will be background in CSS */}
              </div>
              <div className="update-content">
                <span className="update-date">January 15, 2025</span>
                <h3>RoboSub 2025 Preparation</h3>
                <p>
                  Team training and technology refinement for the upcoming
                  competition season.
                </p>
                <Link to="/news" className="read-more">
                  Read More
                </Link>
              </div>
            </div>

            <div className="update-card">
              <div className="update-image">
                {/* Update image will be background in CSS */}
              </div>
              <div className="update-content">
                <span className="update-date">December 10, 2024</span>
                <h3>End-of-Year Achievements</h3>
                <p>
                  Celebrating our accomplishments and recognizing team
                  contributions.
                </p>
                <Link to="/news" className="read-more">
                  Read More
                </Link>
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
              <Link to="/ourteam" className="btn btn-primary">
                Meet Our Team
              </Link>
              <Link to="/sponsors" className="btn btn-secondary">
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