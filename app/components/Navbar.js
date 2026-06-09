'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Program', path: '/program' },
    { name: 'Speakers', path: '/speakers' },
    { name: 'Registration', path: '/register' },
    { name: 'Sponsorship', path: '/sponsorship' },
    { name: 'Accommodation', path: '/accommodation' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, padding: '10px 0', zIndex: 1000 }}>
      <div className="container navbar-container" style={{ display: 'flex', alignItems: 'center', maxWidth: '100%', padding: '0 4rem' }}>
        
        {/* Left Side: Logos */}
        <div className="navbar-logos-wrapper" style={{ flex: '0 0 50%', display: 'flex', justifyContent: 'flex-start' }}>
          <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={closeMobileMenu}>
            <img src="/nest-logo.png" alt="NEST Cluster Logo" className="brand-logo nest-logo" />
            <img src="/iitg-logo.svg" alt="IIT Guwahati Logo" className="brand-logo iitg-logo" />
            <div className="logo-divider"></div>
            <img src="/mdoner-logo.png" alt="MDoNER Logo" className="brand-logo mdoner-logo" />
            <img src="/nec-logo.png" alt="North Eastern Council Logo" className="brand-logo nec-logo" />
          </Link>
        </div>

        {/* Right Side: Desktop Buttons */}
        <div className="navbar-links-wrapper desktop-only" style={{ flex: '0 0 50%', display: 'flex', justifyContent: 'flex-start' }}>
          <ul className="nav-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', margin: 0, padding: 0 }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.path} 
                  className={`nav-link ${pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                Admin
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="mobile-toggle-wrapper mobile-only" style={{ display: 'none', marginLeft: 'auto' }}>
          <button 
            className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                href={link.path} 
                className={`mobile-nav-link ${pathname === link.path ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: '1rem' }}>
            <Link href="/admin" className="btn btn-outline mobile-btn" onClick={closeMobileMenu}>
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
