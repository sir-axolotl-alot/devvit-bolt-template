import React from 'react';
import classNames from 'classnames';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
];

type KeyboardProps = {
  guesses: string[];
  targetWord: string;
  onKeyPress: (key: string) => void;
}

export const Keyboard: React.FC<KeyboardProps> = ({ guesses, targetWord, onKeyPress }) => {
  const getKeyStatus = (key: string): 'correct' | 'present' | 'absent' | undefined => {
    const flatGuesses = guesses.join('');
    if (!flatGuesses.includes(key)) return undefined;

    if (guesses.some((guess, i) => guess[i] === key && targetWord[i] === key)) {
      return 'correct';
    }
    if (targetWord.includes(key)) return 'present';
    return 'absent';
  };

  return (
    <div className="flex flex-col gap-1.5">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const status = key.length === 1 ? getKeyStatus(key) : undefined;
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={classNames(
                  'h-14 rounded font-bold uppercase transition-colors duration-150',
                  {
                    'w-10': key.length === 1,
                    'px-4': key.length > 1,
                    'bg-green-600': status === 'correct',
                    'bg-yellow-500': status === 'present',
                    'bg-gray-700': status === 'absent',
                    'bg-gray-600': !status,
                    'hover:bg-gray-500': !status
                  }
                )}
              >
                {key === 'Backspace' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};