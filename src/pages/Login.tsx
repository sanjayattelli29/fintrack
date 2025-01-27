import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { DollarSign } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isCreatingAccount) {
      if (login(username, password)) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } else {
      console.log('Account created:', { name, username, password });
      setIsCreatingAccount(false);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#123b70] to-[#09090b] py-12 px-6 sm:px-8 ">
<div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 shadow-md">
            <DollarSign className="h-10 w-10 text-blue-600 dark:text-blue-300" />
          </div>
          <h2 className="mt-4 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
            {isCreatingAccount ? 'Create an account' : 'Sign in to your account'}
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isCreatingAccount && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-center text-red-600 text-sm font-medium">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isCreatingAccount ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsCreatingAccount(!isCreatingAccount);
              setError('');
              setName('');
              setUsername('');
              setPassword('');
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-400 transition duration-300"
          >
            {isCreatingAccount
              ? 'Already have an account? Sign In'
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
