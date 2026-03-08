// components/GamesBoard.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, spring } from "framer-motion";

type GameCategory = "all" | "ongoing" | "finished" | "upcoming";

type Sport = {
  _id: string;
  name: string;
  slug: string;
};

type League = {
  _id: string;
  name: string;
  logo: string;
  shortName: string;
};

type TeamLite = {
  _id: string;
  name: string;
  logo?: string;
};

type Match = {
  _id: string;
  teamA: TeamLite;
  teamB: TeamLite;
  startTime: string;
  status: "upcoming" | "ongoing" | "finished";
  league: League;
  score?: {
    home: number;
    away: number;
  };
};

const categories: { value: GameCategory; label: string }[] = [
  { value: "all", label: "All Games" },
  { value: "ongoing", label: "Live Games" },
  { value: "finished", label: "Finished" },
  { value: "upcoming", label: "Scheduled" },
];

export default function GamesBoard() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("all");
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);

  const [leagues, setLeagues] = useState<League[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("http://localhost:5000/sport");
        const body = (await res.json()) as { data: Sport[] };
        console.log("Sports body:", body);
        setSports(body.data ?? []);

        // set default selected sport if none yet
        if (!selectedSportId && body.data && body.data.length > 0) {
          setSelectedSportId(body.data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching sports:", err);
      }
    };

    fetchSports();
  }, [selectedSportId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSportId) {
        console.log("No selectedSportId yet, skipping fetch");
        return;
      }

      setLoading(true);
      try {
        console.log("Fetching leagues for sport:", selectedSportId);

        // 1) leagues for this sport
        const leaguesRes = await fetch(
          `http://localhost:5000/league?sport=${selectedSportId}`,
        );
        console.log("Leagues response status:", leaguesRes.status);

        const leaguesBody = (await leaguesRes.json()) as { data: League[] };
        console.log("Leagues body:", leaguesBody);

        setLeagues(leaguesBody.data ?? []);

        // 2) matches based on filters
        const params = new URLSearchParams();
        params.set("sport", selectedSportId);
        if (selectedCategory !== "all") params.set("status", selectedCategory);
        if (selectedLeagueId) params.set("leagueId", selectedLeagueId);

        console.log("Match query params:", params.toString());

        const matchesRes = await fetch(
          `http://localhost:5000/match?${params.toString()}`,
        );
        console.log("Matches response status:", matchesRes.status);

        const matchesBody = (await matchesRes.json()) as { data: Match[] };
        console.log("Matches body:", matchesBody);

        setMatches(matchesBody.data ?? []);
      } catch (err) {
        console.error("Error fetching games board data:", err);
        setLeagues([]);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSportId, selectedCategory, selectedLeagueId]);

  const visibleLeagues = leagues.slice(0, 4);
  const extraLeagues = leagues.slice(4);

  const selectedSport = sports.find((s) => s._id === selectedSportId);

  const popVariants = {
    closed: { opacity: 0, scale: 0.8, y: -8 },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: spring,
        stiffness: 260,
        damping: 20,
      },
    },
  };

  function formatMatchTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); // e.g. "13:00"
  }

  function formatMatchDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }); // e.g. "08 Mar"
  }

  function getMatchMiddleLabel(match: Match) {
    if (match.status === "upcoming") return "vs";

    // for ongoing or finished
    const home = match.score?.home ?? 0;
    const away = match.score?.away ?? 0;
    return `${home} - ${away}`;
  }

  return (
    <section>
      {/* Header row: title + More Bets dropdown */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-600">
          {selectedSport ? `${selectedSport.name} Games` : "Games"}
        </h2>

        <SportsDropdown
          sports={sports}
          selectedSportId={selectedSportId}
          onChange={(id) => {
            setSelectedSportId(id);
            setSelectedLeagueId(null);
          }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex justify-between mt-4 md:px-3 py-2 rounded-md bg-gray-200">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(cat.value)}
            className={`cursor-pointer px-4 py-1 rounded-md
    hover:bg-blue-400 hover:text-white
    ${selectedCategory === cat.value ? "bg-blue-500 text-white" : "bg-transparent text-gray-700"}
  `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* League filter row */}
      <div className="flex justify-between mt-2 md:px-3 py-2 rounded-md bg-gray-200">
        <button
          type="button"
          onClick={() => setSelectedLeagueId(null)}
          className={`
    cursor-pointer px-4 py-1 rounded-md
    hover:bg-blue-400 hover:text-white
    ${
      selectedLeagueId === null
        ? "bg-blue-500 text-white"
        : "bg-transparent text-gray-700"
    }
  `}
        >
          Show All
        </button>

        {visibleLeagues.map((league) => (
          <button
            key={league._id}
            type="button"
            onClick={() => setSelectedLeagueId(league._id)}
            className={`cursor-pointer px-4 py-1 rounded-md flex items-center
        hover:bg-blue-400 hover:text-white
        ${
          selectedLeagueId === league._id
            ? "bg-blue-500 text-white"
            : "bg-transparent text-gray-700"
        }`}
          >
            <img src={league.logo} alt={league.name} className="w-5 h-5 mr-2" />
            {league.name}
          </button>
        ))}

        {extraLeagues.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMore((p) => !p)}
              className="cursor-pointer px-4 py-1 rounded-md bg-gray-300 hover:bg-blue-400 hover:text-white flex items-center gap-1"
            >
              More
              <span
                className={`
          transition-transform duration-200
          ${showMore ? "rotate-180" : "rotate-0"}
        `}
              >
                <ChevronDown size={14} />
              </span>
            </button>

            <AnimatePresence>
              {showMore && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 mt-2 bg-gray-100 rounded shadow z-10 origin-top"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={popVariants}
                >
                  {extraLeagues.map((league) => (
                    <button
                      key={league._id}
                      type="button"
                      onClick={() => {
                        setSelectedLeagueId(league._id);
                        setShowMore(false);
                      }}
                      className={`
      flex gap-2 w-35 text-left px-3 py-1 cursor-pointer
      hover:bg-blue-400 hover:text-white
      ${
        selectedLeagueId === league._id
          ? "bg-blue-500 text-white"
          : "bg-transparent text-gray-700"
      }
    `}
                    >
                      <img
                        src={league.logo}
                        alt={league.shortName}
                        className="w-5 h-5 mr-2 inline-block"
                      />
                      {league.shortName}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Matches list */}
      <div className="mt-4 grid grid-cols-1 gap-3">
        {loading && <p>Loading...</p>}
        {!loading && matches.length === 0 && (
          <div className="bg-white p-2 grid justify-center font-bold text-gray-400">
            <span>No matches found</span>
          </div>
        )}

        {!loading &&
          matches.map((match) => (
            <div
              key={match._id}
              className="flex items-center bg-white px-4 py-2 rounded-md"
            >
              {/* left: time/date (fixed width) */}
              <div className="flex flex-col text-xs font-semibold text-gray-600 w-20">
                <span>{formatMatchTime(match.startTime)}</span>
                <span>{formatMatchDate(match.startTime)}</span>
              </div>

              {/* Team A column (fixed-ish width) */}
              <div className="flex items-center justify-end gap-2 pr-10 font-semibold w-50">
                <span className="text-sm truncate">{match.teamA.name}</span>
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
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-sm font-bold">
                  {getMatchMiddleLabel(match)}
                </div>
              </div>

              {/* Team B column (fixed-ish width) */}
              <div className="flex items-center gap-2 font-semibold w-50 justify-start pl-10">
                {match.teamB.logo && (
                  <img
                    src={match.teamB.logo}
                    alt={match.teamB.name}
                    className="w-6 h-6"
                  />
                )}
                <span className="text-sm truncate text-right">
                  {match.teamB.name}
                </span>
              </div>

              {/* right: action (fixed width) */}
              <div className="w-16 flex justify-end text-xs text-blue-500">
                Pics
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

function SportsDropdown({
  sports,
  selectedSportId,
  onChange,
}: {
  sports: Sport[];
  selectedSportId: string | null;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const selected = sports.find((s) => s._id === selectedSportId);
  const popVariants = {
    closed: { opacity: 0, scale: 0.8, y: -8 },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: spring,
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 bg-gray-300  py-2 px-4 rounded-md cursor-pointer"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selected ? selected.name : "More Bets"}

        <span
          className={`
        transition-transform duration-200
        ${open ? "rotate-180" : "rotate-0"}
      `}
        >
          <ChevronDown width={15} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 left-0 mt-2 w-30 bg-white rounded shadow origin-top"
            initial="closed"
            animate="open"
            exit="closed"
            variants={popVariants}
          >
            {sports.map((sport) => (
              <button
                key={sport._id}
                type="button"
                onClick={() => {
                  onChange(sport._id);
                  setOpen(false);
                }}
                className="block w-full text-left px-3 py-1 cursor-pointer hover:bg-blue-400 hover:text-white"
              >
                {sport.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
