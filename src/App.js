import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import ProgressBar from './components/ProgressBar';
import HintModal from './components/HintModal';
import Room1ColorMemory from './components/Room1_ColorMemory';
import Room2BalloonToss from './components/Room2_BalloonToss';
import Room3ColorSplash from './components/Room3_ColorSplash';
import Room4FindMeenu from './components/Room3_FindMeenu';
import Room5ColorMixer from './components/Room4_ColorMixer';
import Room6LoveDecoder from './components/Room5_LoveDecoder';
import GrandFinale from './components/GrandFinale';

const TOTAL_ROOMS = 6;

const HINTS = [
  "Meenu is somewhere colorful... 🌈",
  "Meenu is dodging water balloons nearby... 💦",
  "He's hiding behind a colorful building... 🏠",
  "Meenu spotted! But he ran away... 🏃",
  "Almost there! Meenu is behind one last door... 🚪",
  "You decoded his message! Now go find him! 💌",
];

const ROOM_NAMES = [
  "Color Memory",
  "Balloon Toss",
  "Color Splash",
  "Find Meenu",
  "Color Mixer",
  "Love Decoder",
];

function App() {
  const [currentRoom, setCurrentRoom] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedRooms, setCompletedRooms] = useState(0);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleStart = () => {
    setCurrentRoom(1);
    setTimerRunning(true);
  };

  const handleRoomComplete = useCallback((roomNumber) => {
    setCompletedRooms(roomNumber);
    setCurrentHint(HINTS[roomNumber - 1]);
    setShowHint(true);
  }, []);

  const handleHintDismiss = () => {
    setShowHint(false);
    if (completedRooms >= TOTAL_ROOMS) {
      setTimerRunning(false);
      setCurrentRoom(TOTAL_ROOMS + 1);
    } else {
      setCurrentRoom(completedRooms + 1);
    }
  };

  const handleRestart = () => {
    setCurrentRoom(0);
    setElapsedTime(0);
    setCompletedRooms(0);
    setTimerRunning(false);
    setShowHint(false);
  };

  const renderRoom = () => {
    switch (currentRoom) {
      case 0: return <SplashScreen onStart={handleStart} />;
      case 1: return <Room1ColorMemory onComplete={() => handleRoomComplete(1)} />;
      case 2: return <Room2BalloonToss onComplete={() => handleRoomComplete(2)} />;
      case 3: return <Room3ColorSplash onComplete={() => handleRoomComplete(3)} />;
      case 4: return <Room4FindMeenu onComplete={() => handleRoomComplete(4)} />;
      case 5: return <Room5ColorMixer onComplete={() => handleRoomComplete(5)} />;
      case 6: return <Room6LoveDecoder onComplete={() => handleRoomComplete(6)} />;
      case 7: return <GrandFinale elapsedTime={elapsedTime} onRestart={handleRestart} />;
      default: return <SplashScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="App">
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
        <div className="blob blob-6" />
      </div>
      {currentRoom > 0 && currentRoom <= TOTAL_ROOMS && (
        <>
          <ProgressBar
            completedRooms={completedRooms}
            currentRoom={currentRoom}
            elapsedTime={elapsedTime}
            roomNames={ROOM_NAMES}
          />
          <button
            className="skip-button"
            onClick={() => handleRoomComplete(currentRoom)}
          >
            Skip ⏭
          </button>
        </>
      )}
      <div className="room-container">
        {renderRoom()}
      </div>
      {showHint && (
        <HintModal
          hint={currentHint}
          roomNumber={completedRooms}
          onDismiss={handleHintDismiss}
        />
      )}
    </div>
  );
}

export default App;
