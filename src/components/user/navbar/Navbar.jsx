import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {!isOpen && (
        <nav className="navbar navbar-transparent">
          <div className="navbar-container">
            <a href="/" className="navbar-logo">
              <img src="/img/logo.png" alt="Logo" className='nav_logo'/>
            </a>
            <div className="flex md:order-2">
              <button
                className="navbar-menu-button text-white"
                onClick={toggleMenu}
                aria-controls="navbar-sticky"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Fullscreen menu when open */}
      {isOpen && (
        <div className="navbar-fullscreen">
          {/* Close button */}
          <div className="close-button navbar-menu-button text-3xl" onClick={toggleMenu}>&times;</div>
          <ul className="navbar-menu">
            <li className="navbar-menu-item "><Link to={"/"} className='font-extrabold'>Home</Link></li>
            <li className="navbar-menu-item "><Link to={"/inquiry"} className='font-extrabold'>Inquiry</Link></li>
            <li className="navbar-menu-item"><Link to={"/contact"} >Contact</Link></li>
            <li className="navbar-menu-item"><Link to={"/service"} >service</Link></li>
            <li className="navbar-menu-item"><Link to={"/admin"} >Login</Link></li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;