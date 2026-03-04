import React, { useState } from 'react';

const CHALLENGES = [
  { target: 'Orange', targetColor: '#FF9800', answer: ['Red', 'Yellow'] },
  { target: 'Green', targetColor: '#4CAF50', answer: ['Blue', 'Yellow'] },
  { target: 'Purple', targetColor: '#9C27B0', answer: ['Red', 'Blue'] },
  { target: 'Pink', targetColor: '#FF80AB', answer: ['Red', 'White'] },
  { target: 'Teal', targetColor: '#009688', answer: ['Blue', 'Green'] },
];

const SOURCE_COLORS = [
  { name: 'Red', color: '#F44336', textColor: '#fff' },
  { name: 'Blue', color: '#2196F3', textColor: '#fff' },
  { name: 'Yellow', color: '#FFEB3B', textColor: '#333' },
  { name: 'White', color: '#FFFFFF', textColor: '#333' },
  { name: 'Green', color: '#4CAF50', textColor: '#fff' },
];

const Room4_ColorMixer = ({ onComplete }) => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [shaking, setShaking] = useState(false);

  const challenge = CHALLENGES[challengeIndex];

  const handleColorClick = (colorName) => {
    if (feedback) return;
    if (selected.includes(colorName)) {
      setSelected(selected.filter(c => c !== colorName));
    } else if (selected.length < 2) {
      setSelected([...selected, colorName]);
    }
  };

  const handleMix = () => {
    if (selected.length !== 2 || feedback) return;

    const sortedSelected = [...selected].sort();
    const sortedAnswer = [...challenge.answer].sort();

    if (sortedSelected[0] === sortedAnswer[0] && sortedSelected[1] === sortedAnswer[1]) {
      setFeedback('correct');
      setTimeout(() => {
        if (challengeIndex < CHALLENGES.length - 1) {
          setChallengeIndex(i => i + 1);
          setSelected([]);
          setFeedback('');
        } else {
          onComplete();
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        setSelected([]);
        setFeedback('');
      }, 1000);
    }
  };

  return (
    <div className="room room-4">
      <h2 className="room-title">🧪 Color Mixer</h2>
      <p className="room-instruction">Pick two colors and mix them to make the target!</p>

      <div className={`mixer-target ${shaking ? 'shake' : ''}`}>
        <span>Make this color:</span>
        <div className="target-color-display" style={{ backgroundColor: challenge.targetColor }}>
          {challenge.target}
        </div>
      </div>

      <div className="source-colors">
        {SOURCE_COLORS.map((c) => (
          <div
            key={c.name}
            className={`source-color ${selected.includes(c.name) ? 'selected' : ''}`}
            style={{ backgroundColor: c.color, color: c.textColor }}
            onClick={() => handleColorClick(c.name)}
          >
            {c.name}
          </div>
        ))}
      </div>

      <button
        className={`mix-button ${feedback}`}
        onClick={handleMix}
        disabled={selected.length !== 2 || !!feedback}
      >
        {feedback === 'correct' ? '✓ Correct!' : feedback === 'wrong' ? '✗ Try Again!' : 'Mix! 🎨'}
      </button>

      <p className="room-progress">
        Challenge: {challengeIndex + 1} / {CHALLENGES.length}
      </p>
    </div>
  );
};

export default Room4_ColorMixer;
