// src/components/MatchTable.tsx
import React from 'react';
import { Star } from 'lucide-react';
import MatchRow from './MatchRow';
import { dashboardMatches } from '@/data/dashboardData';

interface Match {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  time: string;
  date: string;
  status: string;
  isLive: boolean;
  score: {
    home: number;
    away: number;
  };
  isPinned: boolean;
}

interface MatchTableProps {
  activeSport: string;
  activeStatus: string;
}

const MatchTable = ({ activeSport, activeStatus }: MatchTableProps) => {
  
  // 1. Filter Logic
  const filteredMatches = dashboardMatches.filter(match => {
    const sportMatch = match.sport === activeSport;
    
    let statusMatch = false;
    if (activeStatus === 'all') statusMatch = true;
    else if (activeStatus === 'pinned') statusMatch = match.isPinned;
    else statusMatch = match.status === activeStatus;

    return sportMatch && statusMatch;
  });

  // 2. Grouping by League
  const leagues = Array.from(new Set(filteredMatches.map(m => m.league)));

  return (
    <div className="flex flex-col w-full bg-[#0d0d0d]">
      {leagues.map((leagueName) => {
        // Get top 5 matches for this specific league
        const leagueMatches = filteredMatches
          .filter(m => m.league === leagueName)
          .slice(0, 5);

        return (
          <div key={leagueName} className="flex flex-col mb-4">
            {/* League Header */}
            <div className="bg-white/[0.03] px-4 py-2 flex items-center gap-3 border-y border-white/5">
              <div className="w-5 h-5 bg-gray-700 rounded-sm" /> 
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {leagueName}
              </span>
            </div>

            {/* Matches List */}
            {leagueMatches.map((match) => (
              <div 
                key={match.id} 
                className="relative group flex items-center px-4 py-4 hover:bg-white/[0.02] border-b border-white/5 transition-all"
              >
                {/* LIVE RED BAR: Only in 'All Games' section */}
                {activeStatus === 'all' && match.status === 'live' && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-600 shadow-[2px_0_10px_rgba(220,38,38,0.4)]" />
                )}

                {/* Match Time/Status */}
                <div className="flex flex-col w-16 text-[10px]">
                  <span className={`${match.status === 'live' ? 'text-red-500 font-bold' : 'text-white'}`}>
                    {match.time}
                  </span>
                  <span className="text-gray-500">{match.date}</span>
                </div>

                {/* Teams Section */}
                <div className="flex-1 flex items-center justify-between px-4">
                  {/* Home Team */}
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="text-sm text-white font-medium">{match.homeTeam}</span>
                    <div className="w-8 h-8 bg-amber-400/10 rounded-full border border-white/5" />
                  </div>

                  {/* Score / VS */}
                  <div className="flex flex-col items-center justify-center w-24">
                    <div className="flex items-center gap-3 text-lg font-black text-white italic tracking-tighter">
                      {match.status === 'scheduled' ? (
                        <span className="text-xs text-amber-400 not-italic uppercase tracking-widest">vs</span>
                      ) : (
                        <>
                          <span>{match.score.home}</span>
                          <span className="text-gray-600">-</span>
                          <span>{match.score.away}</span>
                        </>
                      )}
                    </div>
                    {match.status === 'live' && (
                      <span className="text-[8px] text-red-500 font-bold animate-pulse uppercase">Live</span>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-3 flex-1 justify-start">
                    <div className="w-8 h-8 bg-amber-400/10 rounded-full border border-white/5" />
                    <span className="text-sm text-white font-medium">{match.awayTeam}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-10 flex justify-end">
                  <button title='pin' className={`${match.isPinned ? 'text-amber-400' : 'text-gray-600 hover:text-white'} transition-colors`}>
                    <Star size={16} fill={match.isPinned ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Empty State */}
      {leagues.length === 0 && (
        <div className="py-20 text-center text-gray-600 text-sm italic">
          No matches found for {activeSport} in the {activeStatus} category.
        </div>
      )}
    </div>
  );
};

export default MatchTable;