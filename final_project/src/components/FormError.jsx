import React from 'react';

const FormErrors = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div style={{ color: 'red', marginBottom: '10px' }}>
      {errors.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  );
};

export default FormErrors;