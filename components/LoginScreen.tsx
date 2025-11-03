import React, { useState } from 'react';
import { Logo } from './icons';
import { usePlatform } from '../hooks/usePlatform';

interface LoginScreenProps {
  onLogin: (details: { email: string, password: string }) => Promise<string | null>;
  onSwitchToSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const platform = usePlatform();

  const handleLoginClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const loginError = await onLogin({ email, password });
    setIsLoading(false);
    if (loginError) {
        setError(loginError);
    }
  };

  const inputClasses = platform === 'ios' 
    ? "w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black dark:text-white"
    : "w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-black dark:text-white transition-colors";

  const buttonClasses = `w-full py-3 bg-cyan-600 text-white rounded-lg font-semibold border-b-4 border-cyan-700 hover:bg-cyan-500 hover:border-cyan-600 active:border-b-0 active:translate-y-1 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-900 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:border-b-4 disabled:border-gray-500 dark:disabled:border-gray-800 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center`;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white dark:bg-gray-900 animate-fadeIn">
        <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-12">
                <Logo className="w-12 h-12 text-cyan-500 dark:text-cyan-400 mx-auto" />
                <h1 className="text-4xl font-bold mt-4">Welcome to Swift</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue</p>
            </div>
            <form onSubmit={handleLoginClick} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 rounded-lg text-center text-sm">
                        {error}
                    </div>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses}
                />
                 <button
                    type="submit"
                    disabled={isLoading}
                    className={buttonClasses}
                >
                    {isLoading ? (
                         <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    ) : (
                        'Sign In'
                    )}
                </button>
            </form>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-500">
            <p>Don't have an account? <button onClick={onSwitchToSignUp} className="text-cyan-600 dark:text-cyan-400 font-medium bg-transparent border-none p-0 cursor-pointer hover:underline focus:outline-none">Sign up</button></p>
        </div>
    </div>
  );
};

export default LoginScreen;
