import React from 'react';

function FormError({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div style={{ color: 'red', marginBottom: '10px' }}>
      {errors.map(function(error, index) {
        return (
          <p key={index}>
            <img
              src="https://images.unsplash.com/photo-1600585154347-4be52e62b1e1"
              alt="Error Icon"
              style={{ width: '16px', marginRight: '5px', verticalAlign: 'middle' }}
            />
            {error}
          </p>
        );
      })}
    </div>
  );
}

export default FormError;