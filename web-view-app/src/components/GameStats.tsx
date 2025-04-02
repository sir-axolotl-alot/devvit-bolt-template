import React from 'react';
import { GameUserData } from '../../../shared/types/userData';

type GameStatsProps = {
  userData: GameUserData;
  onClose: () => void;
  won: boolean;
  guesses: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ userData, onClose, won, guesses }) => {
  const maxGuesses = Math.max(...userData.guessDistribution);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Statistics</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{userData.totalPlayed}</div>
            <div className="text-xs text-gray-400">Played</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{Math.round((userData.totalWins / userData.totalPlayed) * 100)}%</div>
            <div className="text-xs text-gray-400">Win %</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{userData.currentStreak}</div>
            <div className="text-xs text-gray-400">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{userData.bestStreak}</div>
            <div className="text-xs text-gray-400">Max Streak</div>
          </div>
        </div>

        <h3 className="font-bold mb-3">GUESS DISTRIBUTION</h3>
        <div className="space-y-1">
          {userData.guessDistribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4">{i + 1}</div>
              <div className="flex-1 h-5">
                <div
                  className={`h-full ${i + 1 === guesses && won ? 'bg-green-600' : 'bg-gray-600'}`}
                  style={{ width: `${(count / maxGuesses) * 100}%` }}
                >
                  <span className="px-1 text-sm">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};