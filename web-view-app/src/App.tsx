import React, { useEffect, useState, useCallback } from 'react';
import devvitClient from './lib/DevvitClient';
import { PostData } from '../../shared/types/postData';
import { GameUserData } from '../../shared/types/userData';
import { Keyboard } from './components/Keyboard';
import { Grid } from './components/Grid';
import { GameStats } from './components/GameStats';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

type GameState = {
  guesses: string[];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
}

function App() {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [userData, setUserData] = useState<GameUserData | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    currentGuess: '',
    gameOver: false,
    won: false
  });
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;
      
      if (e.key === 'Enter') {
        submitGuess();
      } else if (e.key === 'Backspace') {
        setGameState(prev => ({
          ...prev,
          currentGuess: prev.currentGuess.slice(0, -1)
        }));
      } else if (/^[a-zA-Z]$/.test(e.key) && gameState.currentGuess.length < WORD_LENGTH) {
        setGameState(prev => ({
          ...prev,
          currentGuess: prev.currentGuess + e.key.toLowerCase()
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    devvitClient.on('fetchPostDataResponse', (message) => {
      if (message.type === 'fetchPostDataResponse') {
        setPostData(message.data.postData);
      }
    });

    devvitClient.on('fetchUserDataResponse', (message) => {
      if (message.type === 'fetchUserDataResponse') {
        setUserData(message.data.dbUser);
      }
    });

    devvitClient.postMessage({ type: 'fetchPostData' });
    devvitClient.postMessage({ type: 'fetchUserData' });

    return () => {
      devvitClient.off('fetchPostDataResponse');
      devvitClient.off('fetchUserDataResponse');
    }
  }, []);

  const submitGuess = useCallback(() => {
    if (gameState.currentGuess.length !== WORD_LENGTH || !postData) return;

    const newGuesses = [...gameState.guesses, gameState.currentGuess];
    const won = gameState.currentGuess === postData.targetWord;
    const gameOver = won || newGuesses.length === MAX_ATTEMPTS;

    setGameState({
      guesses: newGuesses,
      currentGuess: '',
      gameOver,
      won
    });

    if (gameOver) {
      devvitClient.postMessage({
        type: 'gameComplete',
        data: {
          result: {
            success: won,
            guesses: newGuesses.length
          }
        }
      });
      setShowStats(true);
    }
  }, [gameState, postData]);

  const onKeyPress = (key: string) => {
    if (gameState.gameOver) return;
    
    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1)
      }));
    } else if (gameState.currentGuess.length < WORD_LENGTH) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key.toLowerCase()
      }));
    }
  };

  if (!postData) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-900 text-gray-100 p-4">
      <header className="w-full text-center border-b border-gray-700 pb-2">
        <h1 className="text-3xl font-bold">Reddit Wordle</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto gap-8">
        <Grid 
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          targetWord={postData.targetWord}
        />
        
        <Keyboard 
          guesses={gameState.guesses}
          targetWord={postData.targetWord}
          onKeyPress={onKeyPress}
        />
      </main>

      {showStats && userData && (
        <GameStats
          userData={userData}
          onClose={() => setShowStats(false)}
          won={gameState.won}
          guesses={gameState.guesses.length}
        />
      )}
    </div>
  );
}

export default App;