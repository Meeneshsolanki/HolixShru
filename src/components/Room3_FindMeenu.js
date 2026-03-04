import React, { useState } from 'react';

const CHARACTERS = [
  { id: 1, emoji: '👦', outfit: '#FF6B35', name: 'Rahul', accessory: '🎈' },
  { id: 2, emoji: '👧', outfit: '#E91E63', name: 'Priya', accessory: '🪣' },
  { id: 3, emoji: '👨', outfit: '#3F51B5', name: 'Arjun', accessory: '🎨' },
  { id: 4, emoji: '👩', outfit: '#9C27B0', name: 'Ananya', accessory: '💃' },
  { id: 5, emoji: '🧑', outfit: '#2196F3', name: 'Meenu', accessory: '🔫', isMeenu: true },
  { id: 6, emoji: '👦', outfit: '#00C853', name: 'Vikram', accessory: '🎵' },
  { id: 7, emoji: '👧', outfit: '#FF1493', name: 'Neha', accessory: '🎈' },
  { id: 8, emoji: '👨', outfit: '#00BCD4', name: 'Rohan', accessory: '🪣' },
  { id: 9, emoji: '👩', outfit: '#F44336', name: 'Kavya', accessory: '🎨' },
  { id: 10, emoji: '🧑', outfit: '#8BC34A', name: 'Amit', accessory: '🔫' },
  { id: 11, emoji: '👦', outfit: '#7C4DFF', name: 'Sahil', accessory: '🎵' },
  { id: 12, emoji: '👧', outfit: '#FF9800', name: 'Riya', accessory: '💃' },
  { id: 13, emoji: '👨', outfit: '#009688', name: 'Karan', accessory: '🎈' },
  { id: 14, emoji: '👩', outfit: '#FFD700', name: 'Divya', accessory: '🎨' },
  { id: 15, emoji: '🧑', outfit: '#03A9F4', name: 'Nikhil', accessory: '🪣' },
  { id: 16, emoji: '👧', outfit: '#E91E63', name: 'Pooja', accessory: '🎵' },
];

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const HINTS_PROGRESSION = [
  "Meenu loves wearing blue... 💙",
  "Look for someone with a pichkari (water gun)! 🔫",
  "He's the one in BLUE with a PICHKARI! 💙🔫",
];

const Room3_FindMeenu = ({ onComplete }) => {
  const [characters] = useState(() => shuffleArray(CHARACTERS));
  const [attempts, setAttempts] = useState(0);
  const [found, setFound] = useState(false);
  const [wrongClicks, setWrongClicks] = useState(new Set());
  const [showHintText, setShowHintText] = useState('');

  const handleCharacterClick = (char) => {
    if (found || wrongClicks.has(char.id)) return;

    if (char.isMeenu) {
      setFound(true);
      setTimeout(onComplete, 1200);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setWrongClicks(prev => {
        const next = new Set(prev);
        next.add(char.id);
        return next;
      });
      if (newAttempts <= 3) {
        setShowHintText(HINTS_PROGRESSION[Math.min(newAttempts - 1, 2)]);
      }
    }
  };

  return (
    <div className="room room-3">
      <h2 className="room-title">🔍 Find Meenu!</h2>
      <p className="room-instruction">
        Tap the person you think is Meenu hiding in the Holi crowd!
      </p>
      {showHintText && (
        <div className="room-hint-banner">💡 Hint: {showHintText}</div>
      )}
      <div className="character-grid">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`character-card ${found && char.isMeenu ? 'found' : ''} ${wrongClicks.has(char.id) ? 'wrong' : ''}`}
            onClick={() => handleCharacterClick(char)}
          >
            <div className="character-avatar">
              <span className="character-emoji">{char.emoji}</span>
            </div>
            <div className="character-outfit" style={{ backgroundColor: char.outfit }} />
            <div className="character-accessory">{char.accessory}</div>
            {wrongClicks.has(char.id) && <div className="wrong-mark">✗</div>}
            {found && char.isMeenu && <div className="found-mark">💕 Found!</div>}
          </div>
        ))}
      </div>
      <p className="room-progress">Wrong guesses: {attempts}</p>
    </div>
  );
};

export default Room3_FindMeenu;
