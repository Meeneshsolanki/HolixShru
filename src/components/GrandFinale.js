import React, { useState, useEffect } from 'react';

const CONFETTI_COLORS = ['#FF1493', '#FFD700', '#00BCD4', '#FF6B35', '#7C4DFF', '#00C853'];

const GrandFinale = ({ elapsedTime, onRestart }) => {
  const [show, setShow] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 500);
    const t2 = setTimeout(() => setShowMessage(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  return (
    <div className={`finale ${show ? 'show' : ''}`}>
      <div className="confetti-container">
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              '--delay': `${Math.random() * 3}s`,
              '--x': `${Math.random() * 100}vw`,
              '--color': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              '--duration': `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="finale-heart">💕</div>
      <h1 className="finale-title">You Found Meenu!</h1>

      <div className={`finale-message ${showMessage ? 'show' : ''}`}>
        <p className="finale-letter">Happy Holi, Shru! 🎨</p>
        <p className="finale-letter-body">
          No matter where I hide, you always find your way to my heart.
        </p>
        <p className="finale-letter-body">
          Rang barse! 🌈💕
        </p>
        <p className="finale-sign">— Meenu</p>
      </div>

      <div className="finale-stats">
        ⏱ Completed in: <strong>{formatTime(elapsedTime)}</strong>
      </div>

      <button className="restart-button" onClick={onRestart}>
        Play Again 🔄
      </button>
    </div>
  );
};

export default GrandFinale;
