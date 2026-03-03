// src/components/MatchRow.tsx
import React from 'react';
import { Star, Clock } from 'lucide-react';

interface MatchRowProps {
  match: any;
  activeStatus: string;
}

const MatchRow = ({ match, activeStatus }: MatchRowProps) => {
  const isFinished = match.status === 'finished';
  const isScheduled = match.status === 'scheduled';
  const isLive = match.status === 'live';

  return (
    <div className={`relative flex items-center px-3 py-4 sm:px-6 transition-all border-b border-white/5 group
      ${isFinished ? 'opacity-60 grayscale-[0.5]' : 'hover:bg-white/[0.02]'}
    `}>
      {/* 1. THE LIVE BAR (Requirement: Only in "All Games") */}
      {activeStatus === 'all' && isLive && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-600 shadow-[2px_0_12px_rgba(220,38,38,0.6)]" />
      )}

      {/* 2. TIME / DATE COLUMN */}
      <div className="flex flex-col w-12 sm:w-20 flex-shrink-0">
        <span className={`text-[10px] sm:text-xs font-bold leading-none ${isLive ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          {isLive ? match.time : match.time}
        </span>
        <span className="text-[9px] sm:text-[10px] text-gray-500 mt-1 uppercase font-medium">
          {match.date}
        </span>
      </div>

      {/* 3. TEAMS & SCORE CENTER */}
      <div className="flex-1 flex items-center justify-between px-2 sm:px-8">
        {/* Home Team */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end text-right">
          <span className="text-xs sm:text-sm text-white font-semibold truncate max-w-[60px] sm:max-w-none">
            {match.homeTeam}
          </span>
          <div className="w-6 h-6 sm:w-9 sm:h-9 bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/5 p-1 flex-shrink-0">
            {/* <img src={match.homeLogo} className="w-full h-full object-contain" /> */}
            <div className="w-full h-full bg-amber-400/20 rounded-full" />
          </div>
        </div>

        {/* Score/VS Center Box */}
        <div className="flex flex-col items-center justify-center w-16 sm:w-24 mx-2">
          <div className={`flex items-center gap-2 sm:gap-3 px-3 py-1 rounded-lg ${isLive ? 'bg-red-500/10' : 'bg-white/5'}`}>
            {isScheduled ? (
              <span className="text-[10px] text-amber-400 font-black tracking-widest uppercase">VS</span>
            ) : (
              <div className="flex gap-2 text-sm sm:text-xl font-black text-white italic tracking-tighter">
                <span>{match.score.home}</span>
                <span className="text-white/20">-</span>
                <span>{match.score.away}</span>
              </div>
            )}
          </div>
          {isLive && (
            <div className="flex items-center gap-1 mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
              <span className="text-[8px] text-red-500 font-bold uppercase tracking-tighter">Live</span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-start">
          <div className="w-6 h-6 sm:w-9 sm:h-9 bg-gradient-to-br from-white/10 to-transparent rounded-full border border-white/5 p-1 flex-shrink-0">
             {/* <img src={match.awayLogo} className="w-full h-full object-contain" /> */}
             <div className="w-full h-full bg-amber-400/20 rounded-full" />
          </div>
          <span className="text-xs sm:text-sm text-white font-semibold truncate max-w-[60px] sm:max-w-none">
            {match.awayTeam}
          </span>
        </div>
      </div>

      {/* 4. PIN/ACTION AREA */}
      <div className="w-8 flex justify-end">
        <button className={`p-2 transition-transform active:scale-90 ${match.isPinned ? 'text-amber-400' : 'text-white/10 group-hover:text-white/30'}`}>
          <Star size={14} fill={match.isPinned ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
};

export default MatchRow;