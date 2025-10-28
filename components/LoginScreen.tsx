
import React, { useState } from 'react';
import { Logo } from './icons';

interface LoginScreenProps {
  onLogin: () => void;
  onSwitchToSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gray-900 animate-fadeIn">
        <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-12">
                <Logo className="w-12 h-12 text-cyan-400 mx-auto" />
                <h1 className="text-4xl font-bold mt-4">Welcome to Swift</h1>
                <p className="text-gray-400 mt-2">Sign in to continue</p>
            </div>
            <form onSubmit={handleLoginClick} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
                 <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors disabled:bg-gray-500 flex items-center justify-center"
                >
                    {isLoading ? (
                         <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>
        </div>
        <div className="text-center text-gray-500">
            <p>Don't have an account? <button onClick={onSwitchToSignUp} className="text-cyan-400 font-medium bg-transparent border-none p-0 cursor-pointer hover:underline focus:outline-none">Sign up</button></p>
        </div>
    </div>
  );
};

export default LoginScreen;