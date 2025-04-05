import React, { useState } from 'react';
import InputField from './InputField';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);
    // Lógica de autenticación aquí (puedes conectarlo con un backend)
  };

  return (
    <div className="flex w-1/2 justify-center items-center bg-white p-8">
      <form onSubmit={handleLogin} className="w-full max-w-md">
        <h1 className="text-gray-800 font-bold text-3xl mb-3">Sign In</h1>
        <p className="text-sm font-normal text-gray-600 mb-6">Please enter your credentials to access your account.</p>

        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          icon="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
        />
        
        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          icon="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        />

        <button
          type="submit"
          className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold mt-4"
        >
          Log In
        </button>

        <div className="flex justify-between items-center mt-6">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
          <span className="text-sm text-blue-600 cursor-pointer">Forgot Password?</span>
        </div>
      </form>
    </div>
  );
}
