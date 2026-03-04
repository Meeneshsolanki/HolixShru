import React, { useState, useMemo } from 'react';

const ORIGINAL_MESSAGE = "HAPPY HOLI SHRU YOU FOUND ME";
const SHIFT = 5;

function encodeChar(ch, shift) {
  if (ch >= 'A' && ch <= 'Z') {
    return String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26) + 65);
  }
  return ch;
}

function decodeChar(ch, shift) {
  if (ch >= 'A' && ch <= 'Z') {
    return String.fromCharCode(((ch.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
  }
  return ch;
}

function transformMessage(msg, shiftFn, shift) {
  return msg.split('').map(ch => shiftFn(ch, shift)).join('');
}

const Room5_LoveDecoder = ({ onComplete }) => {
  const encodedMessage = useMemo(
    () => transformMessage(ORIGINAL_MESSAGE, encodeChar, SHIFT),
    [],
  );
  const [currentShift, setCurrentShift] = useState(0);
  const [solved, setSolved] = useState(false);

  const decodedPreview = useMemo(
    () => transformMessage(encodedMessage, decodeChar, currentShift),
    [encodedMessage, currentShift],
  );

  const isCorrect = currentShift === SHIFT;

  const handleConfirm = () => {
    if (isCorrect) {
      setSolved(true);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="room room-5">
      <h2 className="room-title">🔐 Love Decoder</h2>
      <p className="room-instruction">
        Meenu left a secret message! Each letter was shifted forward by a number.
        Use the arrows to find the right shift and decode it!
      </p>

      <div className="decoder-encoded">
        <label>Encoded Message:</label>
        <div className="encoded-text">{encodedMessage}</div>
      </div>

      <div className="decoder-controls">
        <button
          className="shift-btn"
          onClick={() => setCurrentShift(s => (s - 1 + 26) % 26)}
          disabled={solved}
        >
          ◀
        </button>
        <div className="shift-display">
          Shift: <strong>{currentShift}</strong>
        </div>
        <button
          className="shift-btn"
          onClick={() => setCurrentShift(s => (s + 1) % 26)}
          disabled={solved}
        >
          ▶
        </button>
      </div>

      <div className={`decoder-preview ${isCorrect ? 'correct' : ''} ${solved ? 'solved' : ''}`}>
        <label>Decoded:</label>
        <div className="decoded-text">{decodedPreview}</div>
      </div>

      {isCorrect && !solved && (
        <button className="decode-confirm-btn" onClick={handleConfirm}>
          That's the message! 💌
        </button>
      )}

      {solved && (
        <div className="decode-success">💕 Message decoded! 💕</div>
      )}
    </div>
  );
};

export default Room5_LoveDecoder;
