
import React, { useState } from 'react';
import { Logo } from './icons';

interface SignUpScreenProps {
  onSignUp: () => void;
  onSwitchToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUpClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSignUp();
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gray-900 animate-fadeIn">
        <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-12">
                <Logo className="w-12 h-12 text-cyan-400 mx-auto" />
                <h1 className="text-4xl font-bold mt-4">Create Account</h1>
                <p className="text-gray-400 mt-2">Get started with Swift</p>
            </div>
            <form onSubmit={handleSignUpClick} className="space-y-4">
                 <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
                 <button
                    type="submit"
                    disabled={isLoading || !name || !email || !password}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors disabled:bg-gray-500 flex items-center justify-center"
                >
                    {isLoading ? (
                         <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                        'Sign Up'
                    )}
                </button>
            </form>
        </div>
        <div className="text-center text-gray-500">
            <p>Already have an account? <button onClick={onSwitchToLogin} className="text-cyan-400 font-medium bg-transparent border-none p-0 cursor-pointer hover:underline focus:outline-none">Sign in</button></p>
        </div>
    </div>
  );
};

export default SignUpScreen;
