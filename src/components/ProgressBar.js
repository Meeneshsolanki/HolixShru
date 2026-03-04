import React from 'react';

const ProgressBar = ({ completedRooms, currentRoom, elapsedTime, roomNames }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-steps">
        {roomNames.map((name, index) => {
          const roomNum = index + 1;
          let status = 'pending';
          if (roomNum <= completedRooms) status = 'completed';
          else if (roomNum === currentRoom) status = 'current';

          return (
            <React.Fragment key={roomNum}>
              {index > 0 && (
                <div className={`progress-connector ${roomNum <= completedRooms ? 'completed' : ''}`} />
              )}
              <div className={`progress-step ${status}`} title={name}>
                {status === 'completed' ? '✓' : roomNum}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="timer">⏱ {formatTime(elapsedTime)}</div>
    </div>
  );
};

export default ProgressBar;
