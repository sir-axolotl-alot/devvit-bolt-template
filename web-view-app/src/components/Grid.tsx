import React from 'react';
import classNames from 'classnames';

type GridProps = {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
}

export const Grid: React.FC<GridProps> = ({ guesses, currentGuess, targetWord }) => {
  const empties = Array(6 - guesses.length - 1).fill('');
  
  const getLetterStatus = (letter: string, index: number, word: string) => {
    if (targetWord[index] === letter) return 'correct';
    if (targetWord.includes(letter)) return 'present';
    return 'absent';
  };

  return (
    <div className="grid grid-rows-6 gap-1">
      {guesses.map((guess, i) => (
        <div key={i} className="grid grid-cols-5 gap-1">
          {guess.split('').map((letter, j) => (
            <div
              key={j}
              className={classNames(
                'w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-colors duration-500',
                {
                  'bg-green-600 border-green-600': getLetterStatus(letter, j, guess) === 'correct',
                  'bg-yellow-500 border-yellow-500': getLetterStatus(letter, j, guess) === 'present',
                  'bg-gray-700 border-gray-700': getLetterStatus(letter, j, guess) === 'absent',
                }
              )}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
      
      {currentGuess && (
        <div className="grid grid-cols-5 gap-1">
          {currentGuess.padEnd(5).split('').map((letter, i) => (
            <div
              key={i}
              className="w-14 h-14 border-2 border-gray-600 flex items-center justify-center text-2xl font-bold uppercase"
            >
              {letter}
            </div>
          ))}
        </div>
      )}

      {empties.map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-1">
          {Array(5).fill('').map((_, j) => (
            <div
              key={j}
              className="w-14 h-14 border-2 border-gray-800 flex items-center justify-center"
            />
          ))}
        </div>
      ))}
    </div>
  );
};