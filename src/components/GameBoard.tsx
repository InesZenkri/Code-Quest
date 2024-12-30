import React from 'react';
import { Bug, Cpu, Heart, Trophy } from 'lucide-react';
import { GameState, PlayerStats } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  playerStats: PlayerStats;
  input: string;
  onType: (text: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  gameState, 
  playerStats, 
  input,
  onType 
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
            <pre className="font-mono text-lg text-emerald-300 mb-4 whitespace-pre-wrap break-all">
              {gameState.currentChallenge.code}
            </pre>
            <input
              type="text"
              value={input}
              className="w-full bg-black/80 border border-emerald-500/30 rounded p-3 text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
              placeholder="Type the code here..."
              onChange={(e) => onType(e.target.value)}
              autoFocus
            />
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