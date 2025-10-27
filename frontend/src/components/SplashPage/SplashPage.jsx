import React, { useEffect, useState } from 'react';
import './SplashPage.css';

/**
 * SplashPage Component
 * Initial welcome screen that collects user's first and last name for identification
 */
const SplashPage = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmitName = (e) => {
    e.preventDefault();
    
    if (firstName.trim() && lastName.trim()) {
      const username = `${firstName.trim().toLowerCase()}_${lastName.trim().toLowerCase()}`;
      localStorage.setItem('userId', username);
      setFadeOut(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className={`splash-page ${fadeOut ? 'fade-out' : ''}`}>
      <div className="name-prompt">
        <h2 className="name-prompt-title">Welcome to EduWatch</h2>
        
        <form onSubmit={handleSubmitName} className="name-form">
          <div className="name-inputs">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="name-input"
              autoFocus
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="name-input"
              required
            />
          </div>
          
          <button type="submit" className="name-submit-button">
            Continue
          </button>
        </form>
      </div>

      <div className="splash-bg-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  );
};

export default SplashPage;