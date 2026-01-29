
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Direction, GameState, GameStats, Challenge, ColorDefinition, SwipeStats } from './types';
import { COLORS, getSimilarColors } from './constants';
import SwipeCard from './components/SwipeCard';
import StatsOverlay from './components/StatsOverlay';
import { aiService } from './services/aiService';

const INITIAL_STATS: GameStats = COLORS.reduce((acc, color) => ({
  ...acc,
  [color.id]: { correct: 0, incorrect: 0 }
}), {});

const DIRECTIONS: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    stats: INITIAL_STATS
  });

  const [challengeStack, setChallengeStack] = useState<Challenge[]>([]);
  const [feedback, setFeedback] = useState<string>("Which shade name fits?");
  const [showStats, setShowStats] = useState(false);
  const [showErrorEmoji, setShowErrorEmoji] = useState(false);

  const generateChallenges = useCallback((count: number) => {
    const newChallenges = Array.from({ length: count }).map((): Challenge => {
      const target = COLORS[Math.floor(Math.random() * COLORS.length)];
      const distractors = getSimilarColors(target, 3);
      const allOptions = [target, ...distractors].sort(() => Math.random() - 0.5);
      
      const optionsMap: any = {};
      let correctDir: Direction = 'UP';
      
      DIRECTIONS.forEach((dir, index) => {
        optionsMap[dir] = allOptions[index];
        if (allOptions[index].id === target.id) {
          correctDir = dir;
        }
      });

      return {
        target,
        options: optionsMap as Record<Direction, ColorDefinition>,
        correctDirection: correctDir
      };
    });
    setChallengeStack(prev => [...prev, ...newChallenges]);
  }, []);

  useEffect(() => {
    generateChallenges(10);
  }, [generateChallenges]);

  const updateAICommentary = useCallback(async (state: GameState) => {
    const comment = await aiService.getEncouragement(state);
    setFeedback(comment);
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#3b82f6', '#22c55e', '#ef4444', '#eab308']
    });
  };

  const handleSwipe = (direction: Direction) => {
    const currentChallenge = challengeStack[0];
    if (!currentChallenge) return;

    const isCorrect = currentChallenge.correctDirection === direction;
    const targetId = currentChallenge.target.id;
    
    if (isCorrect) {
      setGameState(prev => {
        const newStats = { ...prev.stats };
        if (!newStats[targetId]) newStats[targetId] = { correct: 0, incorrect: 0 };
        newStats[targetId].correct += 1;
        const newStreak = prev.streak + 1;
        return {
          ...prev,
          score: prev.score + 1,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          stats: newStats
        };
      });
      triggerCelebration();
      if ((gameState.score + 1) % 5 === 0) {
        updateAICommentary(gameState);
      }
    } else {
      setGameState(prev => {
        const newStats = { ...prev.stats };
        if (!newStats[targetId]) newStats[targetId] = { correct: 0, incorrect: 0 };
        newStats[targetId].incorrect += 1;
        return {
          ...prev,
          streak: 0,
          stats: newStats
        };
      });
      setShowErrorEmoji(true);
      setTimeout(() => setShowErrorEmoji(false), 800);
      setFeedback("Ouch! That was a close one.");
    }

    setChallengeStack(prev => prev.slice(1));
    if (challengeStack.length < 5) {
      generateChallenges(10);
    }
  };

  const currentChallenge = challengeStack[0];

  return (
    <div className="relative h-screen w-full bg-slate-950 overflow-hidden flex flex-col font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-50 pointer-events-none" />
      
      {/* Incorrect Feedback Overlay */}
      <AnimatePresence>
        {showErrorEmoji && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none"
          >
            <span className="text-8xl">😢</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="p-4 sm:p-6 flex justify-between items-center z-30 relative">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tighter">
            CHROMA<span className="text-blue-500">SWIPE</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Beauty Boutique Mode</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black text-white leading-none">{gameState.score}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Matches</div>
          </div>
          {gameState.streak > 2 && (
            <div className="bg-orange-500 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase animate-pulse">
              🔥 {gameState.streak}
            </div>
          )}
        </div>
      </header>

      {/* Pin-to-Edge Directional Option Labels */}
      {currentChallenge && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* UP OPTION */}
          <div className="absolute top-[15%] left-0 right-0 flex justify-center px-4">
            <motion.div 
              initial={{ y: -10, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="bg-black/40 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <span className="text-[10px] sm:text-[12px] font-black text-white/70 uppercase tracking-widest text-center">
                {currentChallenge.options.UP.name}
              </span>
            </motion.div>
          </div>

          {/* LEFT OPTION */}
          <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex items-center max-w-[100px] sm:max-w-[140px]">
            <motion.div 
              initial={{ x: -10, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              className="bg-black/40 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md"
            >
              <span className="text-[10px] sm:text-[12px] font-black text-white/70 uppercase tracking-widest text-left block leading-tight">
                {currentChallenge.options.LEFT.name}
              </span>
            </motion.div>
          </div>

          {/* RIGHT OPTION */}
          <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center max-w-[100px] sm:max-w-[140px]">
            <motion.div 
              initial={{ x: 10, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              className="bg-black/40 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md text-right"
            >
              <span className="text-[10px] sm:text-[12px] font-black text-white/70 uppercase tracking-widest text-right block leading-tight">
                {currentChallenge.options.RIGHT.name}
              </span>
            </motion.div>
          </div>

          {/* DOWN OPTION */}
          <div className="absolute bottom-[20%] left-0 right-0 flex justify-center px-4">
            <motion.div 
              initial={{ y: 10, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="bg-black/40 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <span className="text-[10px] sm:text-[12px] font-black text-white/70 uppercase tracking-widest text-center">
                {currentChallenge.options.DOWN.name}
              </span>
            </motion.div>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <main className="flex-1 relative flex items-center justify-center z-10 px-12 overflow-visible">
        <AnimatePresence mode="wait">
          {currentChallenge && (
            <motion.div
              key={currentChallenge.target.id + gameState.score}
              animate={showErrorEmoji ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex items-center justify-center"
            >
              <SwipeCard 
                color={currentChallenge.target}
                onSwipe={handleSwipe}
                isFront={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="p-4 sm:p-8 flex flex-col items-center z-30 relative">
        <motion.p 
          key={feedback}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 text-xs sm:text-sm font-medium italic mb-4 sm:mb-6 text-center max-w-[280px]"
        >
          "{feedback}"
        </motion.p>
        
        <button 
          onClick={() => setShowStats(true)}
          className="bg-white/5 border border-white/10 px-6 py-2 sm:py-3 rounded-2xl text-[10px] sm:text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-colors"
        >
          Collection Logs
        </button>
      </footer>

      {/* Stats Overlay */}
      <AnimatePresence>
        {showStats && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
              onClick={() => setShowStats(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full z-[101] flex justify-center"
            >
              <StatsOverlay state={gameState} onReset={() => setGameState({ ...gameState, score: 0, streak: 0, stats: INITIAL_STATS })} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
