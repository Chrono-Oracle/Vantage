"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

// import the types from GamesBoardX file OR re-declare them here

type GameCategory = "all" | "ongoing" | "finished" | "upcoming";

type League = {
  _id: string;
  name: string;
  logo: string;
  shortName: string;
  country: string;
};

type TeamLite = {
  _id: string;
  name: string;
  logo?: string;
  shortName: string;
  code: string;
};

type Match = {
  _id: string;
  teamA: TeamLite;
  teamB: TeamLite;
  startTime: string;
  status: "upcoming" | "ongoing" | "finished";
  league: League;
  score?: { home: number; away: number };
  odds: { home: number; away: number; draw: number };
};

type Choice = "1" | "X" | "2";

const categories: { value: GameCategory; label: string }[] = [
  { value: "all", label: "All Games" },
  { value: "ongoing", label: "Live Games" },
  { value: "finished", label: "Finished" },
  { value: "upcoming", label: "Scheduled" },
];

type LeagueMatchesModalProps = {
  open: boolean;
  league: League | null;
  initialCategory: GameCategory;
  onClose: () => void;
  onSelectOdds: (match: Match, choice: Choice, odds: number) => void;
};

export function LeagueMatchesModal({
  open,
  league,
  initialCategory,
  onClose,
  onSelectOdds,
}: LeagueMatchesModalProps) {
  const [category, setCategory] = useState<GameCategory>(initialCategory);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !league) return;

    const fetchMatches = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("leagueId", league._id);
        if (category !== "all") params.set("status", category);

        const res = await fetch(
          `http://localhost:5000/match?${params.toString()}`,
        );
        const body = (await res.json()) as { data: Match[] };
        setMatches(body.data ?? []);
      } catch (err) {
        console.error("Error fetching league matches:", err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [open, league?._id, category]);

  const panelVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 40,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 560,
        damping: 22,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 40,
      transition: {
        type: "spring",
        stiffness: 560,
        damping: 22,
      },
    },
  };

  function getMatchMiddleLabel(match: Match) {
    if (match.status === "upcoming") return "vs";

    // for ongoing or finished
    const home = match.score?.home ?? 0;
    const away = match.score?.away ?? 0;
    return `${home} - ${away}`;
  }

  return (
    <AnimatePresence>
      {open && league && (
        <>
          {/* Blur backdrop */}
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-transparent dark:bg-slate-900"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          {/* Panel */}
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 flex flex-col bg-white dark:bg-slate-900 w-[60vw] h-[80vh] rounded-md shadow-md -translate-x-1/2 -translate-y-1/2"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={league.logo}
                  alt={league.shortName}
                  className="w-6 h-6"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{league.name}</span>
                  <span className="text-[11px] text-gray-500">
                    {league.country}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            {/* Categories inside modal */}
            <div className="bg-gray-100 flex justify-between items-center">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-2 w-full text-[.75rem] cursor-pointer
                    ${
                      category === cat.value
                        ? "bg-blue-500 text-white"
                        : "bg-transparent text-gray-700"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto ">
              {loading ? (
                <p className="text-xs text-gray-500">Loading matches...</p>
              ) : matches.length === 0 ? (
                <p className="text-xs text-gray-500">
                  No matches available in this category.
                </p>
              ) : (
                matches.map((match) => (
                  <div
                    key={match._id}
                    className="flex border-t border-gray-200 py-2 justify-between px-3"
                  >
                    <div className="flex gap-x-8 items-center">
                      <div className="flex gap-8">
                        <div>
                          <span className="text-[.8rem] text-gray-600 font-semibold">
                            {new Date(match.startTime).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              },
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-[.8rem] text-gray-600 font-semibold">
                            {new Date(match.startTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                      {/* Team A column (fixed-ish width) */}
                      <div className="flex items-center justify-end gap-4 pl-15 font-semibold w-50">
                        <span className="text-sm truncate">
                          {match.teamA.shortName}
                        </span>
                        {match.teamA.logo && (
                          <img
                            src={match.teamA.logo}
                            alt={match.teamA.name}
                            className="w-6 h-6"
                          />
                        )}
                      </div>

                      {/* score / vs circle column (fixed width) */}
                      <div className="flex items-center justify-center w-16">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-[.7rem] font-bold">
                          {getMatchMiddleLabel(match)}
                        </div>
                      </div>

                      {/* Team B column (fixed-ish width) */}
                      <div className="flex items-center gap-4 font-semibold w-50 justify-start pr-15">
                        {match.teamB.logo && (
                          <img
                            src={match.teamB.logo}
                            alt={match.teamB.name}
                            className="w-6 h-6"
                          />
                        )}
                        <span className="text-sm truncate text-right">
                          {match.teamB.shortName}
                        </span>
                      </div>
                    </div>

                    {/* Odds Display */}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="bg-gray-200 py-2 px-3 rounded-lg text-[.7rem] cursor-pointer hover:shadow-md hover:bg-blue-500 hover:text-white hover:font-bold transition duration-100 ease-in-out"
                        onClick={() =>
                          onSelectOdds(match, "1", match.odds.home)
                        }
                      >
                        {match.odds.home.toFixed(2)}
                      </button>

                      <button
                        type="button"
                        className="bg-gray-200 py-2 px-3 rounded-lg text-[.7rem] cursor-pointer hover:shadow-md hover:bg-blue-500 hover:text-white hover:font-bold transition duration-100 ease-in-out"
                        onClick={() =>
                          onSelectOdds(match, "X", match.odds.draw)
                        }
                      >
                        {match.odds.draw.toFixed(2)}
                      </button>

                      <button
                        type="button"
                        className="bg-gray-200 py-2 px-3 rounded-lg text-[.7rem] cursor-pointer hover:shadow-md hover:bg-blue-500 hover:text-white hover:font-bold transition duration-100 ease-in-out"
                        onClick={() =>
                          onSelectOdds(match, "2", match.odds.away)
                        }
                      >
                        {match.odds.away.toFixed(2)}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
