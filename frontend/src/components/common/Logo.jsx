import React from 'react';
import './Logo.css';

// Text-only, responsive logo. Consumers (Navbar/Footer) don't need to change.
const Logo = ({ width = 160, height = 42, className = "" }) => {
  return (
    <div className={`logo-link ${className}`} aria-label="Skill Bridge Logo">
      <span className="logo-text">
        <span className="logo-skill">Skill</span>
        <span className="logo-bridge"> Bridge</span>
      </span>
    </div>
  );
};

export default Logo;
