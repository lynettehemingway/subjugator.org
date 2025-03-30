import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaTrophy, FaUsers, FaLightbulb, FaAward, FaBook } from "react-icons/fa";
import "../styles/AboutUs.css";

function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!hasAnimated && entry.isIntersecting) {
        setIsInView(true);
        setHasAnimated(true);
        
        if (options.once) {
          observer.unobserve(element);
        }
      } else if (!options.once) {
        setIsInView(entry.isIntersecting);
      }
    }, {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0.1,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.once, options.root, options.rootMargin, options.threshold, hasAnimated]);

  return [ref, isInView, hasAnimated];
}

function AboutUs() {
  useEffect(() => {
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

    // Add smooth scroll behavior for anchor links
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for header height
            behavior: "smooth"
          });
        }
      }
    };

    // Apply event listeners
    window.addEventListener("scroll", handleScroll);
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section with Blueprint Background */}
      <section className="about-hero-section">
        <div className="blueprint-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">About Us</h1>
            <div className="hero-divider"></div>
            <p className="hero-subtitle">The Team Behind SubjuGator</p>
            <div className="mission-statement">
              <p>
                Founded in 1997, the SubjuGator team at the University of
                Florida has been at the forefront of autonomous underwater
                vehicle research and development for over two decades.
              </p>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-icon"></div>
          <p className="scroll-text">Scroll to Discover</p>
        </div>
      </section>

      {/* Our Mission Section - Vertical Layout */}
      <section id="mission" className="mission-section section">
        <div className="container">
          <div className="section-header">
            <h2>Our Mission</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Pioneering underwater robotics through education, innovation, and
              competition
            </p>
          </div>

          <div className="section-description">
            <p>
              The SubjuGator team is dedicated to designing and building
              autonomous underwater vehicles that push the boundaries of
              what's possible in marine robotics. Our mission focuses on
              three key objectives:
            </p>
          </div>

          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-card-header">
                <span className="mission-icon">
                  <FaLightbulb />
                </span>
                <h3>Research & Innovation</h3>
              </div>
              <div className="mission-card-body">
                <p>
                  Advancing the field of underwater robotics through novel
                  solutions and cutting-edge technology integration. We focus
                  on pushing the boundaries of autonomous navigation,
                  computer vision, and adaptive control systems.
                </p>
                <ul className="mission-points">
                  <li>Novel sensor fusion algorithms</li>
                  <li>Advanced underwater computer vision</li>
                  <li>Hydrodynamic optimization</li>
                </ul>
              </div>
            </div>

            <div className="mission-card">
              <div className="mission-card-header">
                <span className="mission-icon">
                  <FaUsers />
                </span>
                <h3>Education & Training</h3>
              </div>
              <div className="mission-card-body">
                <p>
                  Providing hands-on experience for students in mechanical,
                  electrical, and software engineering disciplines. Our team
                  structure fosters cross-disciplinary collaboration and
                  professional development.
                </p>
                <ul className="mission-points">
                  <li>Practical engineering applications</li>
                  <li>Project management experience</li>
                  <li>Industry-relevant skills development</li>
                </ul>
              </div>
            </div>

            <div className="mission-card">
              <div className="mission-card-header">
                <span className="mission-icon">
                  <FaTrophy />
                </span>
                <h3>Competition Excellence</h3>
              </div>
              <div className="mission-card-body">
                <p>
                  Representing the University of Florida at international
                  autonomous vehicle competitions. We strive to maintain our
                  tradition of excellence while fostering innovation and
                  collaboration within the global AUV community.
                </p>
                <ul className="mission-points">
                  <li>7x AUVSI RoboSub champions</li>
                  <li>Consistent innovation award recipients</li>
                  <li>International recognition for technical merit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline Section - Vertical Layout */}
      <section id="journey" className="history-section section">
        <div className="blueprint-grid-bg"></div>
        <div className="container">
          <div className="section-header">
            <h2>Our Journey</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              From humble beginnings to cutting-edge innovation
            </p>
          </div>

          <div className="history-timeline">
            <div className="timeline-connector"></div>

            <div className="timeline-milestone">
              <div className="milestone-marker">
                <span className="milestone-year">1997</span>
              </div>
              <div className="milestone-content">
                <div
                  className="milestone-image"
                  style={{ backgroundImage: "url('/src/assets/subjugator1.jpg')" }}
                ></div>
                <div className="milestone-details">
                  <h3>Team Formation</h3>
                  <p>
                    SubjuGator team established at the University of Florida's
                    Machine Intelligence Laboratory, beginning the journey into
                    autonomous underwater robotics.
                  </p>
                  <div className="milestone-tech">
                    <span className="tech-tag">Original SubjuGator</span>
                    <span className="tech-tag">First Prototype</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-milestone">
              <div className="milestone-marker">
                <span className="milestone-year">2005</span>
              </div>
              <div className="milestone-content right">
                <div
                  className="milestone-image"
                  style={{ backgroundImage: "url('/src/assets/subjugator3.jpg')" }}
                ></div>
                <div className="milestone-details">
                  <h3>First Competition Win</h3>
                  <p>
                    Earned first place at the AUVSI RoboSub competition with
                    SubjuGator 3, establishing our presence in international
                    underwater robotics competitions.
                  </p>
                  <div className="milestone-tech">
                    <span className="tech-tag">SubjuGator 3</span>
                    <span className="tech-tag">Championship</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-milestone">
              <div className="milestone-marker">
                <span className="milestone-year">2012</span>
              </div>
              <div className="milestone-content">
                <div
                  className="milestone-image"
                  style={{ backgroundImage: "url('/src/assets/subjugator6.jpg')" }}
                ></div>
                <div className="milestone-details">
                  <h3>Technology Evolution</h3>
                  <p>
                    Transitioned to ROS (Robot Operating System) architecture
                    with SubjuGator 6, revolutionizing our software stack and
                    capabilities.
                  </p>
                  <div className="milestone-tech">
                    <span className="tech-tag">SubjuGator 6</span>
                    <span className="tech-tag">ROS Implementation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-milestone">
              <div className="milestone-marker">
                <span className="milestone-year">2019</span>
              </div>
              <div className="milestone-content right">
                <div
                  className="milestone-image"
                  style={{ backgroundImage: "url('/src/assets/subjugator8.jpg')" }}
                ></div>
                <div className="milestone-details">
                  <h3>Advanced Autonomy</h3>
                  <p>
                    Implemented deep learning-based object detection and acoustic
                    localization, pushing the boundaries of underwater
                    perception.
                  </p>
                  <div className="milestone-tech">
                    <span className="tech-tag">Neural Networks</span>
                    <span className="tech-tag">Perception Systems</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="timeline-milestone">
              <div className="milestone-marker">
                <span className="milestone-year">2025</span>
              </div>
              <div className="milestone-content">
                <div
                  className="milestone-image"
                  style={{ backgroundImage: "url('/src/assets/subjugator9.jpg')" }}
                ></div>
                <div className="milestone-details">
                  <h3>SubjuGator 9</h3>
                  <p>
                    Currently developing our next-generation AUV with advanced
                    capabilities including adaptive control systems and enhanced
                    autonomy.
                  </p>
                  <div className="milestone-tech">
                    <span className="tech-tag">SubjuGator 9</span>
                    <span className="tech-tag">Next Generation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Composition Section - Vertical Layout */}
      <section id="team" className="team-composition-section section">
        <div className="container">
          <div className="section-header">
            <h2>Team Composition</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              A multidisciplinary team of dedicated engineers
            </p>
          </div>

          <div className="team-structure">
            <div className="team-department">
              <div className="department-icon mechanical-icon">
                <span>M</span>
              </div>
              <h3>Mechanical Team</h3>
              <p>
                Responsible for vehicle design, hull fabrication, thruster
                integration, and pressure testing. Works with CAD software and
                advanced manufacturing techniques.
              </p>
              <ul className="department-skills">
                <li>SolidWorks & CAD Design</li>
                <li>CNC Machining</li>
                <li>3D Printing & Prototyping</li>
                <li>Waterproofing & Pressure Testing</li>
              </ul>
            </div>

            <div className="team-department">
              <div className="department-icon electrical-icon">
                <span>E</span>
              </div>
              <h3>Electrical Team</h3>
              <p>
                Handles power distribution, sensor integration, custom PCB
                design, and embedded systems. Ensures reliable operation in
                underwater environments.
              </p>
              <ul className="department-skills">
                <li>PCB Design & Fabrication</li>
                <li>Embedded Systems Programming</li>
                <li>Power Management</li>
                <li>Sensor Interfacing & Integration</li>
              </ul>
            </div>

            <div className="team-department">
              <div className="department-icon software-icon">
                <span>S</span>
              </div>
              <h3>Software Team</h3>
              <p>
                Develops navigation algorithms, computer vision systems,
                controls, and autonomous decision-making capabilities using ROS
                architecture.
              </p>
              <ul className="department-skills">
                <li>ROS Development</li>
                <li>State Estimation & Control</li>
                <li>Computer Vision & Deep Learning</li>
                <li>Simulation & Testing</li>
              </ul>
            </div>
          </div>

          <div className="team-cta">
            <Link to="/ourteam" className="btn btn-primary">
              Meet Our Team Members
            </Link>
          </div>
        </div>
      </section>

      {/* Faculty Advisors Section - Vertical Layout */}
      <section id="advisors" className="advisors-section section">
        <div className="container">
          <div className="section-header">
            <h2>Faculty Advisors</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Expert guidance from leading researchers
            </p>
          </div>

          <div className="advisors-content">
            <div className="advisor-description">
              <p>
                The SubjuGator team is fortunate to have the guidance and
                support of world-class faculty from the University of Florida's
                College of Engineering. Our advisors provide technical expertise,
                research direction, and facilitate connections with industry
                partners.
              </p>
            </div>

            <div className="advisors-grid">
              <div className="advisor-card">
                <div className="advisor-info">
                  <h3>Dr. Eric M. Schwartz</h3>
                  <p className="advisor-title">
                    Director, Machine Intelligence Laboratory
                  </p>
                  <div className="advisor-expertise">
                    <h4>Areas of Expertise:</h4>
                    <ul className="expertise-list">
                      <li>Embedded Systems</li>
                      <li>Robotics Education</li>
                      <li>Digital Design</li>
                    </ul>
                  </div>
                  <p className="advisor-bio">
                    Provides overall guidance for the SubjuGator team and
                    coordinates resources across the university.
                  </p>
                </div>
              </div>

              <div className="advisor-card">
                <div className="advisor-info">
                  <h3>Dr. Antonio Arroyo</h3>
                  <p className="advisor-title">
                    Professor, Electrical & Computer Engineering
                  </p>
                  <div className="advisor-expertise">
                    <h4>Areas of Expertise:</h4>
                    <ul className="expertise-list">
                      <li>Control Systems</li>
                      <li>Machine Learning</li>
                      <li>Signal Processing</li>
                    </ul>
                  </div>
                  <p className="advisor-bio">
                    Advises on control systems and electronic design for
                    underwater applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition Section - Vertical Layout */}
      <section id="achievements" className="recognition-section section">
        <div className="container">
          <div className="section-header">
            <h2>Recognition & Achievements</h2>
            <div className="section-divider"></div>
            <p className="subtitle">
              Highlighting our successes over the years
            </p>
          </div>

          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">
                <FaTrophy />
              </div>
              <h3>7x RoboSub Champions</h3>
              <p>
                First place wins at the international AUVSI RoboSub Competition
              </p>
            </div>

            <div className="achievement-card">
              <div className="achievement-icon">
                <FaAward />
              </div>
              <h3>Innovation Awards</h3>
              <p>Multiple special awards for novel technical solutions</p>
            </div>

            <div className="achievement-card">
              <div className="achievement-icon">
                <FaBook />
              </div>
              <h3>Research Publications</h3>
              <p>Contributions to peer-reviewed journals and conferences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section - Vertical Layout */}
      <section id="join" className="join-section">
        <div className="container">
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

export default AboutUs;