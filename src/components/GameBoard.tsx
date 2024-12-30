import React from 'react';
import { Bug, Cpu, Heart, Trophy, HelpCircle } from 'lucide-react';
import { GameState, PlayerStats } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  playerStats: PlayerStats;
  input: string;
  onType: (text: string) => void;
  onShowHint: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  gameState, 
  playerStats, 
  input,
  onType,
  onShowHint
}) => {
  return (
    <div className="w-full max-w-4xl p-6 bg-black/80 rounded-lg shadow-lg backdrop-blur-sm border border-emerald-500/30">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-6 text-emerald-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            <span>{gameState.health}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span>{gameState.score}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          <span>Level {gameState.level}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative min-h-[300px] mb-6 p-6 bg-black/60 rounded border border-emerald-500/20">
        {gameState.currentChallenge && (
          <>
            <div className="absolute -top-3 -left-3">
              <Bug className="w-8 h-8 text-red-500 animate-bounce" />
            </div>
            <div className="mb-4">
              <h3 className="text-emerald-400 text-lg mb-2">Debug this code:</h3>
              <pre className="font-mono text-lg text-red-400 mb-4 whitespace-pre-wrap break-all bg-black/40 p-4 rounded">
                {gameState.currentChallenge.code}
              </pre>
              {gameState.showHint && (
                <div className="text-yellow-400 mb-4 p-2 bg-yellow-400/10 rounded">
                  💡 Hint: {gameState.currentChallenge.hint}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                className="flex-1 bg-black/80 border border-emerald-500/30 rounded p-3 text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                placeholder="Fix the code here..."
                onChange={(e) => onType(e.target.value)}
                autoFocus
              />
              <button
                onClick={onShowHint}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 transition-colors flex items-center gap-2"
              >
                <HelpCircle className="w-5 h-5" />
                Hint
              </button>
            </div>
          </>
        )}
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-black/60 p-3 rounded border border-emerald-500/20">
          <div className="text-emerald-400 text-sm">Accuracy</div>
          <div className="text-white text-lg">{playerStats.accuracy}%</div>
        </div>
        <div className="bg-black/60 p-3 rounded border border-emerald-500/20">
          <div className="text-emerald-400 text-sm">WPM</div>
          <div className="text-white text-lg">{playerStats.wpm}</div>
        </div>
        <div className="bg-black/60 p-3 rounded border border-emerald-500/20">
          <div className="text-emerald-400 text-sm">Time</div>
          <div className="text-white text-lg">{playerStats.timeElapsed}s</div>
        </div>
      </div>
    </div>
  );
};