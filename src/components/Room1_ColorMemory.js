import React, { useState, useEffect, useCallback } from 'react';

const HOLI_COLORS = [
  { name: 'Gulaal Pink', color: '#FF1493' },
  { name: 'Turmeric', color: '#FFD700' },
  { name: 'Teal', color: '#00BCD4' },
  { name: 'Saffron', color: '#FF6B35' },
  { name: 'Purple', color: '#7C4DFF' },
  { name: 'Neem Green', color: '#00C853' },
  { name: 'Rose', color: '#E91E63' },
  { name: 'Sky Blue', color: '#03A9F4' },
];

const Room1_ColorMemory = ({ onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const doubled = [...HOLI_COLORS, ...HOLI_COLORS];
    const shuffled = doubled
      .map((card, i) => ({ ...card, id: i }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const checkComplete = useCallback((matchedSet) => {
    if (matchedSet.size === HOLI_COLORS.length * 2) {
      setTimeout(onComplete, 800);
    }
  }, [onComplete]);

  const handleClick = (id) => {
    if (disabled || flipped.includes(id) || matched.has(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.name === secondCard.name) {
        const newMatched = new Set(matched);
        newMatched.add(firstId);
        newMatched.add(secondId);
        setMatched(newMatched);
        setFlipped([]);
        setDisabled(false);
        checkComplete(newMatched);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="room room-1">
      <h2 className="room-title">🎴 Color Memory</h2>
      <p className="room-instruction">Match the Holi color pairs!</p>
      <div className="memory-grid">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.has(card.id);
          const isMatched = matched.has(card.id);
          return (
            <div
              key={card.id}
              className={`memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => handleClick(card.id)}
            >
              <div className="card-inner">
                <div className="card-front">🎨</div>
                <div className="card-back" style={{ backgroundColor: card.color }}>
                  <span className="card-color-name">{card.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="room-progress">
        Pairs found: {matched.size / 2} / {HOLI_COLORS.length}
      </p>
    </div>
  );
};

export default Room1_ColorMemory;
