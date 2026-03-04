import React, { useState, useRef, useCallback, useEffect } from 'react';

const GRAVITY = 0.2;
const REQUIRED_HITS = 5;
const BALLOON_COLORS = ['#FF1493', '#FFD700', '#00BCD4', '#FF6B35', '#7C4DFF', '#00C853'];
const GAME_W = 320;
const GAME_H = 480;
const BUCKET_Y = 70;
const BUCKET_W = 50;
const START_X = GAME_W / 2;
const START_Y = GAME_H - 55;

function randWind(difficulty) {
  const range = 0.45 + difficulty * 0.2;
  return (Math.random() - 0.5) * 2 * range;
}

function randBucketX() {
  const padding = BUCKET_W / 2 + 15;
  return padding + Math.random() * (GAME_W - padding * 2);
}

function randColor() {
  return BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
}

const Room2BalloonToss = ({ onComplete }) => {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const timeoutRef = useRef(null);
  const hitsRef = useRef(0);

  const [hits, setHits] = useState(0);
  const [wind, setWind] = useState(() => randWind(0));
  const [bucketX, setBucketX] = useState(GAME_W / 2);
  const [color, setColor] = useState(randColor);
  const [throwing, setThrowing] = useState(false);
  const [pos, setPos] = useState(null);
  const [result, setResult] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (hits >= REQUIRED_HITS && !done) {
      setDone(true);
      setTimeout(onComplete, 1200);
    }
  }, [hits, done, onComplete]);

  const reset = useCallback(() => {
    setColor(randColor());
    setThrowing(false);
    setPos(null);
    setResult(null);
    setWind(randWind(hitsRef.current));
    setBucketX(randBucketX());
  }, []);

  const launch = (vx, vy) => {
    setThrowing(true);
    let x = START_X, y = START_Y;
    let velX = vx, velY = vy;
    const currentWind = wind;
    const currentBucketX = bucketX;

    const step = () => {
      velX += currentWind * 0.025;
      velY += GRAVITY;
      x += velX;
      y += velY;

      setPos({ x, y });

      const inX = x >= currentBucketX - BUCKET_W / 2 - 3 && x <= currentBucketX + BUCKET_W / 2 + 3;
      const inY = y >= BUCKET_Y - 10 && y <= BUCKET_Y + 35;

      if (inX && inY) {
        hitsRef.current += 1;
        setHits(hitsRef.current);
        setResult({ hit: true, x, y });
        setPos(null);
        timeoutRef.current = setTimeout(reset, 1100);
        return;
      }

      if (y > GAME_H + 40 || y < -120 || x < -80 || x > GAME_W + 80) {
        setResult({
          hit: false,
          x: Math.max(10, Math.min(x, GAME_W - 10)),
          y: Math.max(10, Math.min(y, GAME_H - 10)),
        });
        setPos(null);
        timeoutRef.current = setTimeout(reset, 900);
        return;
      }

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
  };

  const onDown = (e) => {
    if (throwing || done) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const p = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    setDragStart(p);
    setDragEnd(p);
  };

  const onMove = (e) => {
    if (!dragStart || throwing) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    setDragEnd({ x: t.clientX - rect.left, y: t.clientY - rect.top });
  };

  const onUp = () => {
    if (!dragStart || !dragEnd || throwing) {
      setDragStart(null);
      setDragEnd(null);
      return;
    }
    const dx = dragEnd.x - dragStart.x;
    const dy = dragEnd.y - dragStart.y;
    setDragStart(null);
    setDragEnd(null);

    if (dy >= -20) return;

    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(dist, 220);
    const angle = Math.atan2(dy, dx);
    const power = 5 + (clamped / 220) * 10;
    launch(Math.cos(angle) * power, Math.sin(angle) * power);
  };

  const windDir = wind > 0.05 ? '→' : wind < -0.05 ? '←' : '·';
  const windAbs = Math.abs(wind);
  const windText = windAbs > 0.5 ? 'Strong' : windAbs > 0.25 ? 'Medium' : windAbs > 0.08 ? 'Light' : 'Calm';

  return (
    <div className="room room-2">
      <h2 className="room-title">🎈 Balloon Toss</h2>
      <p className="room-instruction">Swipe up to throw water balloons into the bucket!</p>
      <div
        className="toss-container"
        ref={containerRef}
        style={{ width: GAME_W, height: GAME_H }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        {/* Stars in the sky */}
        <div className="toss-stars">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="toss-star"
              style={{
                left: `${8 + (i * 37) % 90}%`,
                top: `${5 + (i * 23) % 35}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Wind */}
        <div className="toss-wind">
          💨 {windText} {windDir}
        </div>

        {/* Bucket target - moves after each hit */}
        <div
          className="toss-bucket-zone"
          style={{
            left: bucketX - BUCKET_W / 2 - 5,
            top: BUCKET_Y - 5,
            width: BUCKET_W + 10,
            height: 50,
            transition: 'left 0.4s ease',
          }}
        >
          <span className="toss-bucket-emoji">🪣</span>
        </div>

        {/* Ground */}
        <div className="toss-ground" />

        {/* Balloon at rest */}
        {!throwing && !pos && !result && (
          <div
            className="toss-balloon"
            style={{
              left: START_X - 18,
              top: START_Y - 22,
              background: color,
            }}
          />
        )}

        {/* Flying balloon */}
        {pos && !result && (
          <div
            className="toss-balloon flying"
            style={{
              left: pos.x - 18,
              top: pos.y - 22,
              background: color,
            }}
          />
        )}

        {/* Splash */}
        {result && (
          <div
            className={`toss-splash ${result.hit ? 'hit' : 'miss'}`}
            style={{ left: result.x - 25, top: result.y - 25 }}
          >
            {result.hit ? '💦' : '💥'}
          </div>
        )}

        {/* Hint */}
        {!throwing && !dragStart && !result && (
          <div className="toss-hint">↑ Swipe up to throw</div>
        )}
      </div>

      <p className="room-progress">
        Hits: {hits} / {REQUIRED_HITS}
        {done && ' ✓'}
      </p>
    </div>
  );
};

export default Room2BalloonToss;
