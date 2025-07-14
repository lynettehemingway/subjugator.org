import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaUsers } from "react-icons/fa";
import "../styles/Contact.css";
import { useLocation } from "react-router-dom";


function Contact() {
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroBackgroundRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const contactInfoRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
      const hash = location.hash;
      if (hash) {
        // Delay to ensure the target element is rendered
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }, [location]);
  
  // Initialize form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    // Get the references
    const heroBackground = heroBackgroundRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const contactInfo = contactInfoRef.current;
    const form = formRef.current;
    
    if (heroBackground && title && subtitle && contactInfo && form) {
      // Start the animation sequence
      setTimeout(() => {
        title.classList.add("animate-title");
      }, 300);
      
      setTimeout(() => {
        subtitle.classList.add("animate-subtitle");
      }, 500);
      
      setTimeout(() => {
        contactInfo.classList.add("animate-fadeIn");
      }, 800);
      
      setTimeout(() => {
        form.classList.add("animate-fadeIn");
      }, 1000);
      
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here we would typically use a service like EmailJS, Formspree, or a custom backend
    // For this example, we'll simulate the email sending process
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form after "successful" submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      setFormStatus("success");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus("");
      }, 5000);
    } catch (error) {
      setFormStatus("error");
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setFormStatus("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero-section" id="top-contact">
        <div className="hero-background" ref={heroBackgroundRef}>
          {/* Background image is set in CSS */}
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title" ref={titleRef}>
              Contact Us
            </h1>
            <p className="hero-subtitle" ref={subtitleRef}>
              Get in touch with the SubjuGator team
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info" ref={contactInfoRef}>
              <h2>Our Information</h2>
              <div className="section-divider"></div>
              <p className="contact-description">
                We'd love to hear from you! If you have questions about our team, 
                the SubjuGator project, or are interested in collaboration or sponsorship 
                opportunities, please reach out to us.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contact-text">
                    <h3>Location</h3>
                    <p>Machine Intelligence Laboratory</p>
                    <p>1889 Museum Road Room 3001</p>
                    <p>Gainesville, FL 32611</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-text">
                    <h3>Email</h3>
                    <p>
                      <a href="mailto:subjugatoruf@gmail.com">subjugatoruf@gmail.com</a>
                    </p>
                    <p>
                      <a href="mailto:ems@ufl.edu">ems@ufl.edu</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <FaUsers />
                  </div>
                  <div className="contact-text">
                    <h3>Faculty Advisor</h3>
                    <p>Prof. Eric M. Schwartz, MIL Director</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <a href="https://www.youtube.com/@SubjuGatorUF" target="_blank" rel="noopener noreferrer" className="social-link">
                  YouTube
                </a>
                <a href="https://www.instagram.com/ufmil" target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                </a>
                <a href="https://x.com/NaviGatorUF" target="_blank" rel="noopener noreferrer" className="social-link">
                  Twitter
                </a>
                <a href="https://github.com/uf-mil" target="_blank" rel="noopener noreferrer" className="social-link">
                  GitHub
                </a>
                <a href="https://discord.com/invite/Pw3NmhCF6U" target="_blank" rel="noopener noreferrer" className="social-link">
                  Discord
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container" ref={formRef}>
              <h2>Send Us a Message</h2>
              <div className="section-divider"></div>
              
              {formStatus === "success" && (
                <div className="form-message success">
                  <p>Your message has been sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              
              {formStatus === "error" && (
                <div className="form-message error">
                  <p>There was a problem sending your message. Please try again later.</p>
                </div>
              )}
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter message subject"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Enter your message"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3465.3559594314455!2d-82.34961482452427!3d29.648263645730302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e8a39d2a04d78f%3A0x52720ec3c33c145a!2sMachine%20Intelligence%20Laboratory!5e0!3m2!1sen!2sus!4v1681489125249!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MIL Location Map"
          ></iframe>
        </div>
      </section>

      {/* Join Us Section - Reused from other pages */}
      <section id="join" className="join-section">
        <div className="container">
          <div className="join-content">
            <h2>Join Our Team</h2>
            <p>
              We're always looking for passionate students interested in
              underwater robotics!
            </p>
            <div className="join-buttons">
              <a href="mailto:subjugatoruf@gmail.com" className="btn btn-primary">
                Email Us Directly
              </a>
              <a href="https://www.mil.ufl.edu/join/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Learn How to Join
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;