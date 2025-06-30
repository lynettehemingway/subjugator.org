import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaRobot, 
  FaCogs, 
  FaMicrochip, 
  FaCode, 
  FaTrophy, 
  FaLightbulb 
} from "react-icons/fa";
import "../styles/RoboSub.css";

// Reuse the useInView hook from AboutUs for scroll animations
function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!hasAnimated && entry.isIntersecting) {
          setIsInView(true);
          setHasAnimated(true);

          if (options.once) {
            observer.unobserve(element);
          }
        } else if (!options.once) {
          setIsInView(entry.isIntersecting);
        }
      },
      {
        root: options.root || null,
        rootMargin: options.rootMargin || "0px",
        threshold: options.threshold || 0.1,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [
    options.once,
    options.root,
    options.rootMargin,
    options.threshold,
    hasAnimated,
  ]);

  return [ref, isInView, hasAnimated];
}

function RoboSub() {
  const [auvVisible, setAuvVisible] = useState(false);
  const [vehicleRef, vehicleInView] = useInView({ threshold: 0.1, once: true });
  const [mechanicalRef, mechanicalInView] = useInView({ threshold: 0.1, once: true });
  const [electricalRef, electricalInView] = useInView({ threshold: 0.1, once: true });
  const [softwareRef, softwareInView] = useInView({ threshold: 0.1, once: true });
  const [strategyRef, strategyInView] = useInView({ threshold: 0.1, once: true });
  const heroBackgroundRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // Force immediate display of elements instead of relying on animations
    const heroBackground = heroBackgroundRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    
    if (heroBackground && title && subtitle) {
      // Immediately add animation classes
      heroBackground.classList.add("animate-fadeIn");
      title.classList.add("animate-title");
      subtitle.classList.add("animate-subtitle");
      
      // Show AUV image after a short delay
      setTimeout(() => {
        setAuvVisible(true);
      }, 500);
    }
  }, []);

  return (
    <div className="robosub-page">
      <section className="robosub-hero-section">
        <div className="hero-background" ref={heroBackgroundRef}>
          {/* Background image now set with inline style as fallback */}
          <div className="background-fallback"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title" ref={titleRef}>
              RoboSub 2025
            </h1>
            
            <div className="hero-divider"></div>
            
            <div className={`auv-container ${auvVisible ? 'auv-visible' : ''}`}>
              <img 
                src="/src/assets/submarines/subjugator_9.1.png" 
                alt="SubjuGator 9 AUV" 
                className="auv-image"
              />
              <div className="auv-glow"></div>
            </div>
            
            <p className="hero-subtitle" ref={subtitleRef}>
              Advancing Underwater Autonomy
            </p>
          </div>
        </div>
      </section>

      {/* What is RoboSub Section */}
      <section id="what-is-robosub" className="what-is-section section">
        <div className="container animate-in">
          <div className="section-header">
            <h2>What is RoboSub?</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              An international underwater robotics competition
            </p>
          </div>

          <div className="section-content">
            <div className="info-card">
              <div className="info-card-icon">
                <FaTrophy />
              </div>
              <div className="info-card-content">
                <h3>The Competition</h3>
                <p>
                  RoboSub is an annual competition organized by RoboNation that challenges student teams to design and build autonomous underwater vehicles (AUVs) capable of navigating through a series of obstacles and completing complex tasks without human intervention.
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-icon">
                <FaLightbulb />
              </div>
              <div className="info-card-content">
                <h3>The Challenge</h3>
                <p>
                  Teams must create vehicles that can independently identify and classify objects using computer vision, detect and localize acoustic pingers, deploy torpedoes, drop markers, and manipulate underwater structures—all while navigating in a 3D aquatic environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Vehicle Section */}
      <section id="competition-vehicle" className="vehicle-section section" ref={vehicleRef}>
        <div className="container animate-in">
          <div className="section-header">
            <h2>Competition Vehicle</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Meet SubjuGator 9, our flagship autonomous underwater vehicle
            </p>
          </div>

          <div className="vehicle-showcase">
            <div className="vehicle-image-container">
              <img src="/src/assets/submarines/sub9_cherry_1.png" alt="SubjuGator 9" className="vehicle-image" />
              <div className="image-caption">Subjugator 9 - First Swim</div>
            </div>

            <div className="vehicle-info">
              <div className="spec-highlight">
                <h3>SubjuGator 9</h3>
                <p>
                  SubjuGator 9 represents the
                culmination of years of research and competition experience.
                With a completely redesigned aluminum chassis and electronics
                hull, this next-generation AUV pushes the boundaries of
                what's possible in autonomous underwater robotics.
                </p>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Propulsion</span>
                    <span className="spec-value">8 Blue Robotics T200 Thrusters</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Computing</span>
                    <span className="spec-value">Intel i9-9900k + Nvidia RTX 2080</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Power</span>
                    <span className="spec-value">22.2V LiPo Batteries</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Framework</span>
                    <span className="spec-value">ROS 2 Jazzy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>
      </section>

      {/* Mechanical System Section */}
      <section id="mechanical-system" className="mechanical-section section" ref={mechanicalRef}>
        <div className="container animate-in">
          <div className="section-header">
            <h2>Mechanical System</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Precision-engineered for underwater performance
            </p>
          </div>

          <div className="tech-grid">
            <div className="tech-content">
              <h3>Innovative Design</h3>
              <p>
                The mechanical design of SubjuGator 9 incorporates three independently operated electronic servo mechanisms: a gripper, torpedo launcher, and a ball dropper. These mechanisms are used to complete mission-specific tasks, and they are controlled through ...
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <h4>Space-Frame Chassis</h4>
                  <p>Carbon fiber tubes and aluminum sheet sections provide protection for delicate components while enabling modularity.</p>
                </div>
                <div className="feature-item">
                  <h4>Advanced Manufacturing</h4>
                  <p>CNC milled and abrasive water-jetted aluminum components replaced many previously 3D printed parts for improved durability.</p>
                </div>
                <div className="feature-item">
                  <h4>Thruster Configuration</h4>
                  <p>Eight thrusters provide full six degrees of freedom control with built-in redundancy for mission reliability.</p>
                </div>
              </div>
            </div>
            <div className="tech-image-container">
              <img src="/src/assets/mechanical-system.jpg" alt="SubjuGator 9 Mechanical System" className="tech-image" />
              <div className="image-overlay">
                <div className="image-overlay-content">
                  <h4>Servo Actuators</h4>
                  <p>Waterproof servo system ensures reliable actuation for all manipulation tasks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Electrical Architecture Section */}
      <section id="electrical-architecture" className="electrical-section section" ref={electricalRef}>
        <div className="container animate-in">
          <div className="section-header">
            <h2>Electrical Architecture</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Power and communication systems designed for reliability
            </p>
          </div>

          <div className="tech-grid reverse">
            <div className="tech-image-container">
              <img src="/src/assets/electrical-system.jpg" alt="SubjuGator 9 Electrical Architecture" className="tech-image" />
              <div className="image-overlay">
                <div className="image-overlay-content">
                  <h4>Student-Designed PCBs</h4>
                  <p>Custom boards for thruster control, power management, and sensor integration</p>
                </div>
              </div>
            </div>
            <div className="tech-content">
              <h3>Robust Electrical Systems</h3>
              <p>
                SubjuGator 9 consists of a robust set of embedded industry standards and student-designed electronic devices. Peripheral to the main computer is a suite of devices to aid in navigation, safety, power delivery, and communication.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <h4>Battery Monitoring System</h4>
                  <p>Custom-designed boards provide voltage and current data via CAN bus to enable sophisticated power management.</p>
                </div>
                <div className="feature-item">
                  <h4>Safety Features</h4>
                  <p>Hall-effect-based manual shut-off feature allows immediate power cutoff to thrusters for safety during testing and competitions.</p>
                </div>
                <div className="feature-item">
                  <h4>Water Cooling System</h4>
                  <p>Closed-loop water cooling ensures optimal thermal efficiency for the main computer and GPGPU.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Software Architecture Section */}
      <section id="software-architecture" className="software-section section" ref={softwareRef}>
        <div className="container animate-in">
          <div className="section-header">
            <h2>Software Architecture</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Intelligent systems for autonomous operation
            </p>
          </div>

          <div className="tech-grid">
            <div className="tech-content">
              <h3>Advanced Autonomy</h3>
              <p>
                SubjuGator 9's software stack is built on the Jazzy version of the Robot Operating System 2 (ROS2). Our stack has grown to over 60+ ROS packages, all of which are open-source, allowing other teams to share the benefits of our work.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <h4>State Estimation</h4>
                  <p>An Extended Kalman filter operating on manifolds provides efficient handling of attitude singularities, fusing data from IMU, DVL, and other sensors.</p>
                </div>
                <div className="feature-item">
                  <h4>Computer Vision</h4>
                  <p>Deep neural networks (YOLO architecture) assist traditional computer vision techniques for object detection and classification underwater.</p>
                </div>
                <div className="feature-item">
                  <h4>Mission Planning</h4>
                  <p>Modularized mission system using asyncio and ROS allows developers to quickly construct and modify mission plans.</p>
                </div>
              </div>
            </div>
            <div className="tech-image-container">
              <img src="/src/assets/simulation_enviornment.png" alt="SubjuGator 8 Software Architecture" className="tech-image" />
              <div className="image-overlay">
                <div className="image-overlay-content">
                  <h4>Simulation Environment</h4>
                  <p>Gazebo-based simulation reproduces underwater physics for rapid development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Strategy Section */}
      <section id="competition-strategy" className="strategy-section section" ref={strategyRef}>
        <div className="container animate-in">
          <div className="section-header">
            <h2>Competition Strategy</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Our approach to the RoboSub competition
            </p>
          </div>

          <div className="strategy-content">
            <div className="strategy-image-container">
              <img src="/src/assets/robosub_logo.png" alt="RoboSub Competition" className="strategy-image" />
            </div>
            
            <div className="strategy-text">
              <p>
                Leveraging 26 years of autonomous underwater vehicle development experience at the University of Florida, the SubjuGator team has refined its approach to the RoboSub competition, focusing on reliability and consistent performance.
              </p>
              
              <div className="strategy-points">
                <div className="strategy-point">
                  <div className="point-number">01</div>
                  <div className="point-content">
                    <h3>Focused Task Selection</h3>
                    <p>We prioritize mastering a select number of feasible tasks while maximizing test time, ensuring reliable performance during competition runs.</p>
                  </div>
                </div>
                
                <div className="strategy-point">
                  <div className="point-number">02</div>
                  <div className="point-content">
                    <h3>Iterative Testing</h3>
                    <p>Extensive testing in both simulated and physical environments ensures that all mechanical, electrical, and software systems function as expected under competition conditions.</p>
                  </div>
                </div>
                
                <div className="strategy-point">
                  <div className="point-number">03</div>
                  <div className="point-content">
                    <h3>Knowledge Transfer</h3>
                    <p>With a team consisting of many new members, we emphasize knowledge sharing and documentation to build on the infrastructure left by previous teams.</p>
                  </div>
                </div>
              </div>
              
              <p className="strategy-conclusion">
                This balanced approach has resulted in multiple competition victories and consistent performance in the challenging underwater environment of RoboSub.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Us Section */}
      <section id="join" className="join-section section">
        <div className="container animate-in">
          <div className="join-content">
            <h2>Join Our Team</h2>
            <p>
              We're always looking for passionate students interested in
              underwater robotics!
            </p>
            <div className="join-buttons">
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
              <a href="mailto:subjugator@ufl.edu" className="btn btn-secondary">
                Email Us Directly
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RoboSub;