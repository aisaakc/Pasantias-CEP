import React from 'react';

export default function HeroSection() {
  return (
    <div className="flex w-1/2 bg-gradient-to-tr from-indigo-500 to-blue-600 justify-center items-center p-8">
      <div className="text-white text-center space-y-4">
        <h1 className="text-5xl font-semibold">Welcome to GoFinance</h1>
        <p className="mt-2 text-lg">A better way to manage your finances and loans.</p>
        <button
          type="button"
          className="block w-36 bg-white text-blue-600 py-2 rounded-2xl font-semibold mt-6"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
