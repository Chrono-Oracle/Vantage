"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
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
  country: string;
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
  odds: {
    home: number;
    away: number;
    draw: number;
  };
};

const categories: { value: GameCategory; label: string }[] = [
  { value: "all", label: "All Games" },
  { value: "ongoing", label: "Live Games" },
  { value: "finished", label: "Finished" },
  { value: "upcoming", label: "Scheduled" },
];

const LeagueRow = ({
  league,
  category,
}: {
  league: League;
  category: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [matchCount, setMatchCount] = useState<number>(0);

  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        // Fetch Live count
        const liveRes = await fetch(
          `http://localhost:5000/match?leagueId=${league._id}&status=ongoing`,
        );
        const liveData = await liveRes.json();

        // Fetch Scheduled count
        const upRes = await fetch(
          `http://localhost:5000/match?leagueId=${league._id}&status=upcoming`,
        );
        const upData = await upRes.json();

        const total = (liveData.data?.length || 0) + (upData.data?.length || 0);
        setMatchCount(total);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchTotalCount();
  }, [league._id]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        if (category === "all") {
          // --- PRIORITY LOGIC FOR "ALL GAMES" ---

          // 1. Try fetching Live matches first
          const liveRes = await fetch(
            `http://localhost:5000/match?leagueId=${league._id}&status=ongoing`,
          );
          const liveData = await liveRes.json();
          let results = liveData.data?.slice(0, 2) ?? [];

          // 2. If less than 2 live matches, fill the rest with Upcoming
          if (results.length < 2) {
            const upRes = await fetch(
              `http://localhost:5000/match?leagueId=${league._id}&status=upcoming`,
            );
            const upData = await upRes.json();
            const upcoming = upData.data ?? [];
            results = [...results, ...upcoming].slice(0, 2);
          }

          // 3. If still less than 2 matches, fill the rest with Finished
          if (results.length < 2) {
            const finRes = await fetch(
              `http://localhost:5000/match?leagueId=${league._id}&status=finished`,
            );
            const finData = await finRes.json();
            const finished = finData.data ?? [];
            results = [...results, ...finished].slice(0, 2);
          }

          setMatches(results);
        } else {
          // --- STANDARD LOGIC FOR SPECIFIC CATEGORIES ---
          const res = await fetch(
            `http://localhost:5000/match?leagueId=${league._id}&status=${category}`,
          );
          const body = await res.json();
          setMatches(body.data?.slice(0, 2) ?? []);
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [category, isOpen, league._id]);

  function getMatchMiddleLabel(match: Match) {
    if (match.status === "upcoming") return "vs";

    // for ongoing or finished
    const home = match.score?.home ?? 0;
    const away = match.score?.away ?? 0;
    return `${home} - ${away}`;
  }

  return (
    <div>
      {/* League Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="grid gap-y-5 bg-gray-300 p-3 mb-2 cursor-pointer"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <img
              src={league.logo}
              alt={league.shortName}
              className="w-5 h-5 mr-2 inline-block"
            />
            <div className="flex flex-col">
              <span className="flex items-center gap-x-5">
                <span className="font-bold text-sm">{league.name}</span>
                {matchCount > 0 && (
                  <span className="text-xs">{matchCount}</span>
                )}
              </span>
              <span className="text-xs text-gray-600">{league.country}</span>
            </div>
          </div>

          {/* Add 'inline-block' here */}
          <span
            className={`inline-block transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDown size={18} />
          </span>
        </div>

        <div className="grid grid-flow-col-dense items-center px-4">
          <div>Match</div>
          <div className=" gap-x-14 flex justify-end text-[.7rem]">
            <span>O</span>
            <span>D</span>
            <span>O</span>
          </div>
        </div>
      </div>

      {/* League Content */}
      {isOpen && (
        <div className="my-1">
          {isLoading ? (
            <div className="loader">Loading matches...</div> // You can style this loader later
          ) : (
            <div className="grid gap-y-3">
              {matches.length > 0 ? (
                matches.map((match) => (
                  <div key={match._id} className="flex justify-between px-3">
                    <div className="flex">
                      {/* Team A column (fixed-ish width) */}
                      <div className="flex items-center justify-start gap-2 pr-10 font-semibold w-50">
                        {match.teamA.logo && (
                          <img
                            src={match.teamA.logo}
                            alt={match.teamA.name}
                            className="w-6 h-6"
                          />
                        )}
                        <span className="text-sm truncate">
                          {match.teamA.name}
                        </span>
                      </div>

                      {/* score / vs circle column (fixed width) */}
                      <div className="flex items-center justify-center w-16">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-[.7rem] font-bold">
                          {getMatchMiddleLabel(match)}
                        </div>
                      </div>

                      {/* Team B column (fixed-ish width) */}
                      <div className="flex items-center gap-2 font-semibold w-50 justify-end pl-10">
                        <span className="text-sm truncate text-right">
                          {match.teamB.name}
                        </span>
                        {match.teamB.logo && (
                          <img
                            src={match.teamB.logo}
                            alt={match.teamB.name}
                            className="w-6 h-6"
                          />
                        )}
                      </div>
                    </div>

                    {/* Odds Display */}
                    <div className="flex gap-4">
                      <button className="bg-gray-200 py-2 px-3 rounded-lg text-[.7rem]">
                        {match.odds.home.toFixed(2)}
                      </button>
                      <button className="bg-gray-200 py-2 px-3 rounded-lg text-[.7rem]">
                        {match.odds.draw.toFixed(2)}
                      </button>
                      <button className="bg-gray-200 py-2 px-3 rounded-lg text-[.7rem]">
                        {match.odds.away.toFixed(2)}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid justify-center">
                  <span className="text-gray-400 font-bold">
                    No matches available
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function GamesBoardX() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSportId, setSelectedSportId] = useState("football-id");
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

  const selectedSport = sports.find((s) => s._id === selectedSportId);
  const filteredLeagues = leagues.filter((l) => l.name === selectedSport?.name);

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

  return (
    <section>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-gray-600">
          {selectedSport ? `${selectedSport.name} Matches` : "Select Sport"}
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

      {/* Category Filter */}
      <div className="bg-gray-100 flex justify-between items-center rounded-t-2xl overflow-hidden">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setSelectedCategory(cat.value)}
            className={`p-2 w-full cursor-pointer
    hover:bg-blue-400 hover:border-x-blue-400 hover:text-white
    ${selectedCategory === cat.value ? "bg-blue-500 text-white border-x-blue-500" : "bg-transparent text-gray-700"}
  `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Leagues List */}
      <div className="leagues-container ">
        {/* Map through leagues directly since they are already sport-filtered by your API fetch */}
        {leagues.map((league) => (
          <LeagueRow
            key={league._id}
            league={league}
            category={selectedCategory}
          />
        ))}
      </div>
    </section>
  );

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
          {selected ? selected.name : "Choose Sport"}

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
}
