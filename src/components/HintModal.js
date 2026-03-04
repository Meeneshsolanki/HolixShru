import React from 'react';

const HintModal = ({ hint, roomNumber, onDismiss }) => {
  return (
    <div className="hint-overlay">
      <div className="hint-modal">
        <div className="hint-icon">🎉</div>
        <h3 className="hint-title">Room {roomNumber} Complete!</h3>
        <p className="hint-text">{hint}</p>
        <button className="hint-button" onClick={onDismiss}>
          {roomNumber >= 6 ? "Find Meenu! 💕" : "Next Room →"}
        </button>
      </div>
    </div>
  );
};

export default HintModal;
