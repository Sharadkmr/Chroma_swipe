
import React from 'react';
import { GameState, SwipeStats } from '../types';
import { COLORS } from '../constants';

interface StatsOverlayProps {
  state: GameState;
  onReset: () => void;
}

const StatsOverlay: React.FC<StatsOverlayProps> = ({ state, onReset }) => {
  // Only show colors that the user has actually swiped at least once
  const activeColors = COLORS.filter(c => {
    const stats = state.stats[c.id];
    return stats && (stats.correct > 0 || stats.incorrect > 0);
  });

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-900/90 backdrop-blur-2xl rounded-t-[3rem] w-full max-w-md border-t border-slate-700 shadow-2xl h-[70vh]">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div>
          <h3 className="text-xl font-bold text-white">Mastery Log</h3>
          <p className="text-xs text-slate-500 font-medium">Tracking {activeColors.length} unique hues encountered</p>
        </div>
        <button 
          onClick={onReset}
          className="text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-300 rounded-full transition-all border border-slate-700"
        >
          Reset All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeColors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 italic text-center p-10">
            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Swipe some cards to start tracking stats!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {activeColors.map((c) => {
              const stats = state.stats[c.id] || { correct: 0, incorrect: 0 };
              const accuracy = stats.correct + stats.incorrect > 0 
                ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100) 
                : 0;

              return (
                <div key={c.id} className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${c.bgTailwind} shadow-lg shrink-0`} />
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-tight">{c.name}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{c.direction} Swipe</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <div className="text-[10px] text-green-500 font-bold uppercase">Hits</div>
                      <div className="text-sm font-black text-white">{stats.correct}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-red-500 font-bold uppercase">Miss</div>
                      <div className="text-sm font-black text-white">{stats.incorrect}</div>
                    </div>
                    <div className="min-w-[40px]">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">%</div>
                      <div className={`text-sm font-black ${accuracy >= 70 ? 'text-blue-400' : 'text-slate-400'}`}>{accuracy}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-2 pt-4 border-t border-slate-800 shrink-0 flex justify-between items-center bg-slate-900/50 -mx-6 px-6 pb-2">
        <div>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Global Best</div>
          <div className="text-2xl font-black text-amber-400">{state.bestStreak}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Avg Accuracy</div>
          <div className="text-2xl font-black text-white">
            {state.score > 0 
              ? Math.round((state.score / (state.score + (Object.values(state.stats) as SwipeStats[]).reduce((acc, s) => acc + s.incorrect, 0))) * 100) 
              : 0}%
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default StatsOverlay;
