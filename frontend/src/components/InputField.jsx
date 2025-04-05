import React from 'react';

export default function InputField({ type, value, onChange, placeholder, icon }) {
  return (
    <div className="flex items-center border-2 py-3 px-4 rounded-xl mb-5">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
      <input
        className="pl-3 outline-none border-none w-full text-gray-700"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </div>
  );
}
