import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [audio] = useState(new Audio('https://www.soundjay.com/button/beep-07.wav'));

  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            audio.play();
            if (isSession) {
              setIsSession(false);
              setTimeLeft(breakLength * 60);
            } else {
              setIsSession(true);
              setTimeLeft(sessionLength * 60);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isSession, sessionLength, breakLength, audio]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    audio.pause();
    audio.currentTime = 0;
  };

  const handleIncrement = (type) => {
    if (type === 'session') {
      if (sessionLength < 60) setSessionLength(sessionLength + 1);
    } else {
      if (breakLength < 60) setBreakLength(breakLength + 1);
    }
  };

  const handleDecrement = (type) => {
    if (type === 'session') {
      if (sessionLength > 1) setSessionLength(sessionLength - 1);
    } else {
      if (breakLength > 1) setBreakLength(breakLength - 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="App">
      <div id="break-label">Break Length</div>
      <div id="break-length">{breakLength}</div>
      <button id="break-decrement" onClick={() => handleDecrement('break')}>-</button>
      <button id="break-increment" onClick={() => handleIncrement('break')}>+</button>

      <div id="session-label">Session Length</div>
      <div id="session-length">{sessionLength}</div>
      <button id="session-decrement" onClick={() => handleDecrement('session')}>-</button>
      <button id="session-increment" onClick={() => handleIncrement('session')}>+</button>

      <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>

      <button id="start_stop" onClick={handleStartStop}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button id="reset" onClick={handleReset}>Reset</button>

      <audio id="beep" src="https://www.soundjay.com/button/beep-07.wav"></audio>
    </div>
  );
}

export default App;
