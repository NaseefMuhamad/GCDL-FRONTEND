import React, { useState, useEffect } from 'react';

function LiveClock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(function() {
    const timer = setInterval(function() {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return function() {
      clearInterval(timer);
    };
  }, []);

  return <span style={{ marginRight: '20px' }}>{time}</span>;
}

export default LiveClock;