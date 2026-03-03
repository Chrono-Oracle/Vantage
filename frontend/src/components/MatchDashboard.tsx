
"use client";
import React, { useState } from 'react';
import { ChevronDown, Trophy, Clock, Star, Activity } from 'lucide-react';

// 1. Status Filter Constants (Constant for all sports)
const STATUS_FILTERS = [
  { id: 'all', label: 'All Games' },
  { id: 'live', label: 'Live Games' },
  { id: 'finished', label: 'Finished' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'pinned', label: 'Pinned' },
];

const MatchDashboard = () => {
  const [activeSport, setActiveSport] = useState('Football');
  const [activeStatus, setActiveStatus] = useState('all');
  const [isSportMenuOpen, setIsSportMenuOpen] = useState(false);

  const sports = ['Football', 'Basketball', 'Tennis', 'Ice Hockey'];

  return (
    <div className="w-full bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
      
      {/* HEADER & SPORT SWITCHER */}
      <div className="p-4 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-white font-bold tracking-tight">Match Center</h2>
        </div>

        {/* Sport Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsSportMenuOpen(!isSportMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white transition-all border border-white/10"
          >
            {activeSport}
            <ChevronDown className={`w-4 h-4 transition-transform ${isSportMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSportMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => {
                    setActiveSport(sport);
                    setIsSportMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-amber-400 hover:text-black transition-colors"
                >
                  {sport}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FIRST ROW: STATUS FILTERS (Remains constant) */}
      <div className="flex items-center gap-2 p-2 bg-black/40 overflow-x-auto no-scrollbar border-b border-white/5">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveStatus(filter.id)}
            className={`flex-none px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeStatus === filter.id 
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* PHASE 2 PLACEHOLDER: LEAGUES & MATCH LIST */}
      <div className="p-4 text-gray-500 text-center text-sm italic">
        Loading {activeSport} matches for {activeStatus} section...
      </div>
    </div>
  );
};

export default MatchDashboard;