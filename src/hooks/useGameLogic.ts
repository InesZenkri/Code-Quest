import { useState, useEffect } from 'react';
import { GameState, PlayerStats } from '../types/game';
import { codeChallenges } from '../data/challenges';

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    health: 3,
    currentChallenge: null,
    gameStatus: 'idle'
  });

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    accuracy: 100,
    wpm: 0,
    timeElapsed: 0
  });

  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      currentChallenge: codeChallenges[0],
      gameStatus: 'playing'
    }));
    setStartTime(Date.now());
  };

  const handleType = (text: string) => {
    setInput(text);
    
    if (!gameState.currentChallenge) return;

    // Calculate accuracy
    const target = gameState.currentChallenge.code;
    let correctChars = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === target[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / Math.max(text.length, 1)) * 100);

    // Calculate WPM
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000;
      const words = text.length / 5; // Standard WPM calculation
      const wpm = Math.round((words / timeElapsed) * 60);

      setPlayerStats(prev => ({
        ...prev,
        accuracy,
        wpm,
        timeElapsed: Math.round(timeElapsed)
      }));
    }

    // Check if code is correct
    if (text === target) {
      const nextLevel = gameState.level;
      const nextChallenge = codeChallenges[nextLevel];
      
      if (nextChallenge) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + 100,
          level: prev.level + 1,
          currentChallenge: nextChallenge
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          gameStatus: 'gameOver'
        }));
      }
      setInput('');
      setStartTime(Date.now());
    }
  };

  return {
    gameState,
    playerStats,
    input,
    startGame,
    handleType
  };
}