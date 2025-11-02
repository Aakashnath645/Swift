import React, { useState } from 'react';
import { Driver } from '../types';
import { StarIcon } from './icons';

interface RatingScreenProps {
  driver: Driver;
  onSubmitRating: (rating: number, feedback: string) => void;
}

const RatingScreen: React.FC<RatingScreenProps> = ({ driver, onSubmitRating }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        onSubmitRating(rating, feedback);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 text-center animate-fadeIn">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl space-y-6">
                <div>
                    <img src={driver.avatarUrl} alt={driver.name} className="w-24 h-24 rounded-full mx-auto border-4 border-gray-300 dark:border-gray-600" />
                    <h1 className="text-2xl font-bold mt-4">How was your trip with {driver.name}?</h1>
                    <p className="text-gray-500 dark:text-gray-400">Your feedback helps us improve.</p>
                </div>

                <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                        >
                            <StarIcon className={`w-10 h-10 transition-colors ${
                                (hoverRating || rating) >= star 
                                ? 'text-amber-400' 
                                : 'text-gray-300 dark:text-gray-600'
                            }`} />
                        </button>
                    ))}
                </div>

                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Additional comments (optional)"
                    className="w-full h-24 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                <div className="space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className="w-full py-3 bg-cyan-600 text-white rounded-lg font-semibold border-b-4 border-cyan-700 hover:bg-cyan-500 hover:border-cyan-600 active:border-b-0 active:translate-y-1 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:border-b-4 disabled:border-gray-500 dark:disabled:border-gray-800 disabled:cursor-not-allowed disabled:translate-y-0"
                    >
                        Submit Feedback
                    </button>
                    <button
                        onClick={handleSubmit} // Skip also submits with 0 rating
                        className="w-full text-sm text-gray-500 dark:text-gray-400 hover:underline"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingScreen;
