import React, { useState, useEffect } from 'react';

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img
        src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1"
        alt="Clock Icon"
        style={{ width: '16px', marginRight: '5px' }}
      />
      {time.toLocaleTimeString()}
    </div>
  );
}

export default LiveClock;