import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onStart }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`splash-screen ${show ? 'show' : ''}`}>
      <div className="splash-emoji">🎉</div>
      <h1 className="splash-title">Find Meenu!</h1>
      <p className="splash-subtitle">A Holi Escape Room Adventure</p>
      <div className="splash-story">
        <p>Hey <strong>Shru</strong>! 💜</p>
        <p>
          Meenu is hiding somewhere in the Holi celebration! 🙈
        </p>
        <p>
          Solve <strong>6 puzzles</strong> to find him before the colors fade!
        </p>
      </div>
      <button className="start-button" onClick={onStart}>
        Let's Play! 🎯
      </button>
    </div>
  );
};

export default SplashScreen;
