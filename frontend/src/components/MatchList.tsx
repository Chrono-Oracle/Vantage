// src/components/MatchList.tsx
import React from 'react';
import { dashboardMatches } from '@/data/dummyMatches';
import { Star } from 'lucide-react';

interface MatchListProps {
  activeSport: string;
  activeStatus: string;
}

const MatchList = ({ activeSport, activeStatus }: MatchListProps) => {
  
  // 1. Filtering Logic
  const filteredMatches = dashboardMatches.filter(match => {
    const sportMatch = match.sport === activeSport;
    const statusMatch = activeStatus === 'all' ? true : match.status === activeStatus;
    return sportMatch && statusMatch;
  });

  // 2. Group by League
  const groupedByLeague = filteredMatches.reduce((acc, match) => {
    if (!acc[match.league]) acc[match.league] = [];
    acc[match.league].push(match);
    return acc;
  }, {} as Record<string, typeof dashboardMatches>);

  return (
    <div className="flex flex-col">
      {Object.entries(groupedByLeague).map(([leagueName, matches]) => (
        <div key={leagueName} className="border-b border-white/5 last:border-0">
          
          {/* LEAGUE HEADER */}
          <div className="bg-white/[0.03] px-4 py-2 flex items-center gap-3">
             <div className="w-5 h-5 bg-gray-700 rounded-sm" /> {/* League Logo Placeholder */}
             <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
               {leagueName}
             </span>
          </div>

          {/* MATCH ROWS */}
          {matches.slice(0, 5).map((match) => (
            <div key={match.id} className="relative group hover:bg-white/[0.02] transition-colors px-4 py-4 flex items-center">
              
              {/* LIVE INDICATOR BAR (Only shows in 'All Games' if match is live) */}
              {activeStatus === 'all' && match.isLive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-600 shadow-[2px_0_10px_rgba(220,38,38,0.5)]" />
              )}

              {/* Time & Date */}
              <div className="w-16 flex flex-col text-[10px]">
                <span className="text-white font-medium">{match.time}</span>
                <span className="text-gray-500">{match.date}</span>
              </div>

              {/* Teams Section */}
              <div className="flex-1 flex items-center justify-center gap-8">
                {/* Home */}
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <span className="text-sm text-white font-medium">{match.homeTeam}</span>
                  <div className="w-7 h-7 bg-amber-400/20 rounded-full border border-amber-400/10" />
                </div>

                {/* Score or VS */}
                <div className="flex flex-col items-center min-w-[60px]">
                  {match.status === 'scheduled' ? (
                    <span className="text-xs text-amber-400 font-bold uppercase">VS</span>
                  ) : (
                    <div className="flex gap-2 text-lg font-black text-white italic">
                      <span>{match.score.home}</span>
                      <span className="text-gray-600">-</span>
                      <span>{match.score.away}</span>
                    </div>
                  )}
                  {match.isLive && <span className="text-[9px] text-red-500 font-bold animate-pulse">LIVE</span>}
                </div>

                {/* Away */}
                <div className="flex items-center gap-3 flex-1 justify-start">
                  <div className="w-7 h-7 bg-amber-400/20 rounded-full border border-amber-400/10" />
                  <span className="text-sm text-white font-medium">{match.awayTeam}</span>
                </div>
              </div>

              {/* Pin Icon (Placeholder for the 'Pinned' status) */}
              <div className="w-10 flex justify-end">
                <button title='star'  className="text-gray-600 hover:text-amber-400 transition-colors">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {filteredMatches.length === 0 && (
        <div className="py-20 text-center text-gray-600 text-sm">
          No matches found for this category.
        </div>
      )}
    </div>
  );
};

export default MatchList;