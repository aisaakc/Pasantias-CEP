// registro/InputField.jsx
import React from 'react';

const InputField = ({ label, name, type, placeholder, onChange, value }) => (
  <div className="mb-4 col-span-2 sm:col-span-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
    />
  </div>
);

export default InputField;
