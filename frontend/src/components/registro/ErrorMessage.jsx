import React from 'react';

const ErrorMessage = ({ error }) => {
  return (
    <div className="text-red-500 text-xs mt-1">
      {error}
    </div>
  );
};

export default ErrorMessage;
