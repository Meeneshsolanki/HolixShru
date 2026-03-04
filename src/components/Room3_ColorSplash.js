import React, { useState, useRef, useCallback, useEffect } from 'react';

const WINDOW_ROWS = 4;
const WINDOW_COLS = 3;
const TOTAL_WINDOWS = WINDOW_ROWS * WINDOW_COLS;
const REQUIRED_HITS = 15;
const FACES = ['😄', '😆', '🤣', '😜', '🤪', '😝', '🥳', '😎', '🤗', '😏'];
const SPLASH_COLORS = ['#FF1493', '#FFD700', '#00BCD4', '#FF6B35', '#7C4DFF', '#00C853'];

function getDifficulty(hits) {
  if (hits < 4) return { peek: 2000, maxVisible: 2, spawnMin: 700, spawnMax: 1200, label: 'Easy' };
  if (hits < 8) return { peek: 1400, maxVisible: 3, spawnMin: 450, spawnMax: 800, label: 'Medium' };
  if (hits < 12) return { peek: 900, maxVisible: 4, spawnMin: 300, spawnMax: 550, label: 'Hard' };
  return { peek: 600, maxVisible: 5, spawnMin: 200, spawnMax: 400, label: 'Insane!' };
}

const Room3ColorSplash = ({ onComplete }) => {
  const windowsRef = useRef(Array(TOTAL_WINDOWS).fill(null));
  const timersRef = useRef({});
  const spawnRef = useRef(null);
  const hitsRef = useRef(0);
  const missesRef = useRef(0);

  const [windows, setWindows] = useState(Array(TOTAL_WINDOWS).fill(null));
  const [splashes, setSplashes] = useState({});
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);
  const [difficulty, setDifficulty] = useState('Easy');

  const spawnPerson = useCallback(() => {
    if (hitsRef.current >= REQUIRED_HITS) return;

    const current = windowsRef.current;
    const emptyIndices = [];
    let visibleCount = 0;
    for (let i = 0; i < TOTAL_WINDOWS; i++) {
      if (current[i] === null) emptyIndices.push(i);
      else visibleCount++;
    }

    const diff = getDifficulty(hitsRef.current);
    setDifficulty(diff.label);

    if (emptyIndices.length === 0 || visibleCount >= diff.maxVisible) return;

    const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const face = FACES[Math.floor(Math.random() * FACES.length)];

    const newWindows = [...current];
    newWindows[idx] = face;
    windowsRef.current = newWindows;
    setWindows([...newWindows]);

    // Occasional quick-peek to keep player on their toes
    const isQuickPeek = Math.random() < 0.2 && hitsRef.current >= 4;
    const peekDuration = isQuickPeek ? diff.peek * 0.5 : diff.peek;

    if (timersRef.current[idx]) clearTimeout(timersRef.current[idx]);
    timersRef.current[idx] = setTimeout(() => {
      const c = windowsRef.current;
      if (c[idx] !== null) {
        const updated = [...c];
        updated[idx] = null;
        windowsRef.current = updated;
        setWindows([...updated]);
        missesRef.current += 1;
        setMisses(missesRef.current);
      }
    }, peekDuration);
  }, []);

  useEffect(() => {
    if (done) return;
    let mounted = true;

    const scheduleSpawn = () => {
      if (!mounted) return;
      const diff = getDifficulty(hitsRef.current);
      const delay = diff.spawnMin + Math.random() * (diff.spawnMax - diff.spawnMin);
      spawnRef.current = setTimeout(() => {
        if (!mounted) return;
        spawnPerson();
        scheduleSpawn();
      }, delay);
    };

    spawnRef.current = setTimeout(() => {
      if (!mounted) return;
      spawnPerson();
      scheduleSpawn();
    }, 600);

    return () => {
      mounted = false;
      if (spawnRef.current) clearTimeout(spawnRef.current);
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, [done, spawnPerson]);

  const handleWindowClick = (index) => {
    if (hitsRef.current >= REQUIRED_HITS) return;

    const current = windowsRef.current;
    if (current[index] === null) return;

    if (timersRef.current[index]) {
      clearTimeout(timersRef.current[index]);
      delete timersRef.current[index];
    }

    const newWindows = [...current];
    newWindows[index] = null;
    windowsRef.current = newWindows;
    setWindows([...newWindows]);

    const splashColor = SPLASH_COLORS[Math.floor(Math.random() * SPLASH_COLORS.length)];
    setSplashes(prev => ({ ...prev, [index]: splashColor }));

    hitsRef.current += 1;
    setHits(hitsRef.current);
    setDifficulty(getDifficulty(hitsRef.current).label);

    if (hitsRef.current >= REQUIRED_HITS) {
      setDone(true);
      setTimeout(onComplete, 1200);
    }

    setTimeout(() => {
      setSplashes(prev => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }, 700);
  };

  return (
    <div className="room room-cs">
      <h2 className="room-title">🏠 Color Splash!</h2>
      <p className="room-instruction">Tap on people peeking from windows before they hide!</p>
      <div className="building">
        <div className="building-roof">
          <div className="roof-flag">🚩</div>
        </div>
        <div className="building-wall">
          <div className="wall-splotch" style={{ top: '15%', left: '8%', background: '#FF149366' }} />
          <div className="wall-splotch" style={{ top: '55%', right: '5%', background: '#7C4DFF55' }} />
          <div className="wall-splotch" style={{ bottom: '10%', left: '40%', background: '#00C85344' }} />
          <div className="wall-splotch" style={{ top: '35%', left: '60%', background: '#FFD70055' }} />

          <div className="building-grid">
            {Array.from({ length: TOTAL_WINDOWS }, (_, i) => {
              const hasPerson = windows[i] !== null;
              const hasSplash = splashes[i];
              return (
                <div
                  key={i}
                  className={`building-window ${hasPerson ? 'occupied' : ''}`}
                  onClick={() => handleWindowClick(i)}
                >
                  <div className="window-shutter-left" />
                  <div className="window-shutter-right" />
                  <div className="window-inside">
                    {hasPerson && (
                      <div className="window-person" key={`person-${i}-${windows[i]}`}>
                        <span className="person-face">{windows[i]}</span>
                      </div>
                    )}
                    {hasSplash && (
                      <div
                        className="window-splash"
                        style={{ backgroundColor: splashes[i] }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="cs-stats">
        <span className="cs-hits">Hits: {hits}/{REQUIRED_HITS}</span>
        <span className={`cs-difficulty ${difficulty.toLowerCase().replace('!', '')}`}>
          {difficulty}
        </span>
        <span className="cs-misses">Missed: {misses}</span>
      </div>
    </div>
  );
};

export default Room3ColorSplash;
