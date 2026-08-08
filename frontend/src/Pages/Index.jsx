import React from "react";
import { useState } from "react";
import { a } from "react-router-dom";
import "./Index.css";
import logo from "../images/logo.png";

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const toggleDropdown = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
    else if (!dropdownVisible) {
      setDropdownVisible(true);
    }
  }

  return (
    <div className="index">
      {/* hidden div block */}
      <div className={`topnavbar-div ${dropdownVisible ? "topnavbar-display" : ""}`}>
        <div className="mega-menu">
          <div className="mega-menu-left">
            <div className="logo-container logo-container-ht">
              <img src={logo} alt="logo" className="logo-image logo-image-ht" />
              <p>Saraswati<br></br>College</p>
            </div>
            <ul>
              <li><h2><a href="/Register"><i class="fa-solid fa-diamond-turn-right"></i>How to Apply</a></h2></li>
              <li><h2><a href="/Register"><i class="fa-solid fa-diamond-turn-right"></i>Scholarship</a></h2></li>
              <li><h2><a href="/Register"><i class="fa-solid fa-diamond-turn-right"></i>About</a></h2></li>
            </ul>
          </div>
          <div className="mega-menu-middle">
            <div className="scroll-box">
              <h1 className="helpline-title">CAMPUS HELPLINE NUMBERS</h1>
              <div className="campus-block">
                <h2>MUMBAI CAMPUS</h2>
                <p>0000-0000000 / 1000000</p>
              </div>
              <div className="campus-block">
                <h2>NOIDA CAMPUS</h2>
                <p>Admission helpline: 1234-123-123</p>
                <p>CALL CENTRE NO: 1234-123-123</p>
              </div>
              <div className="campus-block">
                <h2>PUNE CAMPUS</h2>
                <p>1234-567-890</p>
              </div>
              <div className="campus-block">
                <h2>PUNE CAMPUS</h2>
                <p>1234-567-890</p>
              </div>
              <div className="campus-block">
                <h2>PUNE CAMPUS</h2>
                <p>1234-567-890</p>
              </div>
            </div>
          </div>
          <div className="mega-menu-right">
            <div className="scroll-box">
              <h1 className="apply-heading">LAST DATE TO APPLY AT</h1>
              <div className="notice-box">
                <p>
                  <strong>Campus Tour available at Mumbai Campus:</strong> Monday to Friday Only
                  (Excluding holidays) Campus Tour Timings are:
                </p>
                <p className="time">11:30 AM & 03:00 PM ONLY</p>
              </div>
              <div className="campus-info">
                <h2>MUMBAI CAMPUS</h2>
                <p>
                  Last date to apply for UG & PG programmes for this round of admissions.
                </p>
                <p className="date">15 Feb 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* top-navbar */}
      <nav className="top-navbar">
        <div>
          <ul>
            <li onClick={() => { toggleDropdown() }} >Admissions ▾</li>
            <li><a href="/announcement">Announcement</a></li>
            <li><a href="/scholarship">Scholarship</a></li>
          </ul>
        </div>
      </nav>
      {/* navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo-image" />
          <p>Saraswati College</p>
        </div>
        <button className="hamburger-menu" onClick={toggleMobileMenu}>
          <span className="bar">&#9776;</span>
        </button>
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="drp-camp" onClick={visible ? () => setVisible(false) : () => setVisible(true)}>
            <a>Campuses ▾</a>
            <div className={`dropdown-content ${visible ? "show" : ""}`}>
              <h1>Saraswati College Capuses</h1>
              <div className="camp-list">
                <ul className="dropdown-menu">
                  <li>Mumbai</li>
                  <li>Pune</li>
                  <li>Nagpur</li>
                  <li>Bangaluru</li>
                  <li>Noida</li>
                </ul>
                <ul className="dropdown-menu">
                  <li>Kolkata</li>
                  <li>Patna</li>
                  <li>Hyderabad</li>
                  <li>Ranchi</li>
                  <li>Chennai</li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a href="/Register" className="apply-btn">Apply Now</a>
          </li>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <div className="hero">
        <h1>Welcome to Saraswati College</h1>
        <p>Empowering Students Through Quality Education & Technology</p>
        <div className="hero-buttons">
          <a href="/Register" className="btn-primary">Apply Now</a>
          <a href="/about" className="btn-secondary">Explore More</a>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section className="about-section">
        <h2>STUDY AT SARASWATI COLLEGE</h2>
        <p>
          Saraswati College provides modern education with expert faculty,
          advanced infrastructure, and digital learning tools for students,
          teachers, and administrators.
        </p>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card card-1">
          <h1>12</h1>
          <p>Universities</p>
        </div>

        <div className="feature-card card-2">
          <h1>150+</h1>
          <p>Institutions & Centers</p>
        </div>

        <div className="feature-card card-3">
          <h1>300+</h1>
          <p>Programmes</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-modern">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <img src={logo} alt="Saraswati College" />
                <h4>Saraswati College</h4>
              </div>
              <p>Empowering students through quality education since 1985.</p>
              <div className="social-links">
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
                <a href="#"><i className="fa-brands fa-youtube"></i></a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Use</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Programs</h4>
              <ul>
                <li><a href="/programs/ug">Undergraduate</a></li>
                <li><a href="/programs/pg">Postgraduate</a></li>
                <li><a href="/programs/phd">Doctoral</a></li>
                <li><a href="/programs/diploma">Diploma</a></li>
                <li><a href="/programs/certificate">Certificate</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact Info</h4>
              <ul className="contact-info">
                <li><i className="fa-solid fa-location-dot"></i> 123 Education Street, Mumbai - 400001</li>
                <li><i className="fa-solid fa-phone"></i> +91 22 1234 5678</li>
                <li><i className="fa-solid fa-envelope"></i> info@saraswati.edu</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Saraswati College. All rights reserved. Designed with <i className="fa-solid fa-heart" style={{ color: '#ff1d1d' }}></i> for education</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
