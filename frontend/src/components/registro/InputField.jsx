import React from 'react';

const InputField = ({ label, name, type, placeholder, value, onChange, error, touched }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error && touched ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && touched && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

export default InputField;
