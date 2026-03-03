// src/components/LeagueFilter.tsx
import React from 'react';

interface LeagueFilterProps {
  availableLeagues: string[];
  activeLeague: string;
  setActiveLeague: (league: string) => void;
}

const LeagueFilter = ({ availableLeagues, activeLeague, setActiveLeague }: LeagueFilterProps) => {
  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-white/[0.02] border-b border-white/5 overflow-x-auto no-scrollbar">
      <button
        onClick={() => setActiveLeague('All')}
        className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
          activeLeague === 'All' ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        All Leagues
      </button>
      
      {availableLeagues.map((league) => (
        <button
          key={league}
          onClick={() => setActiveLeague(league)}
          className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
            activeLeague === league ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {league}
        </button>
      ))}
    </div>
  );
};

export default LeagueFilter;