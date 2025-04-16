import React, { useState, useEffect } from 'react';

function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="live-clock">{currentTime}</span>
  );
}

export default LiveClock;