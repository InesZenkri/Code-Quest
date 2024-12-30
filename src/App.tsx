import React from 'react';
import { Terminal } from 'lucide-react';
import { GameBoard } from './components/GameBoard';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const { gameState, playerStats, input, startGame, handleType } = useGameLogic();

  return (
    <div 
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)'
      }}
    >
      {/* Game Title */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Terminal className="w-8 h-8 text-emerald-400" />
          <h1 className="text-4xl font-bold text-white">Code Quest</h1>
        </div>
        <p className="text-emerald-400">Debug. Type. Conquer.</p>
      </div>

      {gameState.gameStatus === 'idle' ? (
        <button
          onClick={startGame}
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors mb-8"
        >
          Start Game
        </button>
      ) : gameState.gameStatus === 'gameOver' ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-emerald-400 mb-4">Final Score: {gameState.score}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      ) : (
        <GameBoard
          gameState={gameState}
          playerStats={playerStats}
          input={input}
          onType={handleType}
        />
      )}
    </div>
  );
}

export default App;