"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, spring } from "framer-motion";
import { toast } from "react-toastify";
import { useUser } from "@/utils/contexts/UserContext";
import { LeagueMatchesModal } from "../LeagueMatchesModal";

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

type Choice = "1" | "X" | "2";

type BetSlipItem = {
  matchId: string;
  match: Match; // full match object for UI
  choice: Choice;
  odds: number;
};

type BetSlipState = {
  items: BetSlipItem[];
  stakePerBet: number;
  isOpen: boolean;
  isAvailable: boolean;
  errorMessage?: string;
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
  onSelectOdds,
  onViewMore,
}: {
  league: League;
  category: string;
  onSelectOdds: (match: Match, choice: Choice, odds: number) => void;
  onViewMore: (league: League) => void;
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
            <span>1</span>
            <span>X</span>
            <span>2</span>
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
                <>
                  {matches.map((match) => (
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
                            {match.teamA.shortName}
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
                            {match.teamB.shortName}
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
                  ))}

                  {matchCount > matches.length && (
                    <button
                      type="button"
                      className="mt-2 w-full text-center text-white text-[.75rem] font-semibold bg-blue-500 py-2
                       cursor-pointer"
                      onClick={() => onViewMore(league)}
                    >
                      VIEW ALL MATCHES ({matchCount - matches.length} more)
                    </button>
                  )}
                </>
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
  const [selectedSportId, setSelectedSportId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("all");
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);

  const [leagues, setLeagues] = useState<League[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  const [expandedLeague, setExpandedLeague] = useState<League | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<GameCategory>("all");

  // const [showMore, setShowMore] = useState(false);

  const { refreshUserProfile } = useUser();
  

  const [betSlip, setBetSlip] = useState<BetSlipState>({
    items: [],
    stakePerBet: 0,
    isOpen: false,
    isAvailable: true,
    errorMessage: undefined,
  });

  function removeSelectionFromSlip(matchId: string) {
    setBetSlip((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.matchId !== matchId),
    }));
  }

  function clearSlip() {
    setBetSlip({
      items: [],
      stakePerBet: 0,
      isOpen: false,
      isAvailable: true,
      errorMessage: undefined,
    });
  }

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("http://localhost:5000/sport");
        const body = (await res.json()) as { data: Sport[] };
        setSports(body.data ?? []);

        if (!selectedSportId && body.data && body.data.length > 0) {
          // Try to find Football (case‑insensitive, or by slug)
          const football =
            body.data.find(
              (s) =>
                s.name.toLowerCase() === "football" ||
                s.slug?.toLowerCase() === "football",
            ) || body.data[0];

          setSelectedSportId(football._id);
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

  function addSelectionToSlip(match: Match, choice: Choice, odds: number) {
    // Example condition: not bettable if finished or odds <= 1
    const notBettable =
      match.status === "ongoing" ||
      match.status === "finished" ||
      !odds ||
      odds <= 1;

    if (notBettable) {
      setBetSlip((prev) => ({
        ...prev,
        isOpen: true,
        isAvailable: false,
        errorMessage: "This match is not available for betting",
        items: [],
        stakePerBet: 0,
      }));

      // auto-hide after 5–6 seconds
      setTimeout(() => {
        clearSlip();
      }, 5500);

      return;
    }

    // normal add logic
    setBetSlip((prev) => {
      const existingIndex = prev.items.findIndex(
        (i) => i.matchId === match._id,
      );

      const newItem: BetSlipItem = {
        matchId: match._id,
        match,
        choice,
        odds,
      };

      let newItems: BetSlipItem[];
      if (existingIndex >= 0) {
        newItems = [...prev.items];
        newItems[existingIndex] = newItem;
      } else {
        newItems = [...prev.items, newItem];
      }

      return {
        ...prev,
        items: newItems,
        isOpen: true,
        isAvailable: true,
        errorMessage: undefined,
      };
    });
  }

  function updateSlipChoice(matchId: string, choice: Choice) {
    setBetSlip((prev) => {
      const item = prev.items.find((i) => i.matchId === matchId);
      if (!item) return prev;

      const newOdds =
        choice === "1"
          ? item.match.odds.home
          : choice === "2"
            ? item.match.odds.away
            : item.match.odds.draw;

      return {
        ...prev,
        items: prev.items.map((i) =>
          i.matchId === matchId ? { ...i, choice, odds: newOdds } : i,
        ),
      };
    });
  }

  async function handlePlaceBets() {
    if (betSlip.items.length === 0 || betSlip.stakePerBet <= 0) {
      toast.warn("Add selections and stake first");
      return;
    }

    const stored = localStorage.getItem("user");
    if (!stored) {
      toast.error("You must be logged in to place bets");
      return;
    }

    let parsed: { token?: string; role?: string };
    try {
      parsed = JSON.parse(stored);
    } catch {
      toast.error("Invalid session, please log in again");
      return;
    }

    const token = parsed.token;
    if (!token) {
      toast.error("No auth token found, please log in again");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/bet/place-from-slip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: betSlip.items.map((i) => ({
            matchId: i.matchId,
            choice: i.choice,
            odds: i.odds,
          })),
          stakePerBet: betSlip.stakePerBet,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        toast.error(body.message || "Failed to place bets");
        return;
      }

      toast.success("Bets placed successfully");
      clearSlip();
      await refreshUserProfile();
    } catch (err) {
      console.error("Error placing bets:", err);
      toast.error("Error placing bets");
    }
  }

  function handleViewOtherMatches(league: League) {
    setExpandedLeague(league);
    setExpandedCategory(selectedCategory); // or "all" if you prefer
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
            onSelectOdds={addSelectionToSlip}
            onViewMore={handleViewOtherMatches}
          />
        ))}
      </div>

      {betSlip.isOpen && !betSlip.isAvailable && (
        <div className="fixed bottom-5 right-6 w-full sm:w-96 z-50 pointer-events-none">
          <div className="bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-t-2xl sm:rounded-l-2xl shadow-md text-center">
            {betSlip.errorMessage ?? "Selection not available for betting"}
          </div>
        </div>
      )}

      {/* Bet Slip Panel */}
      {betSlip.isOpen && (
        <div
          className={`fixed bottom-5 right-6 w-full sm:w-96 bg-white rounded-t-2xl sm:rounded-l-2xl shadow-lg p-4 z-80 ${
            betSlip.isAvailable ? "" : "hidden pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-gray-500">
              YOUR BET SLIP
            </h3>
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={clearSlip}
            >
              Clear all
            </button>
          </div>

          {betSlip.items.length === 0 ? (
            <p className="text-xs text-gray-500">
              No selections yet. Tap odds to add a match.
            </p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {betSlip.items.map((item) => {
                const currentChoiceLabel =
                  item.choice === "1"
                    ? item.match.teamA.name
                    : item.choice === "2"
                      ? item.match.teamB.name
                      : "Draw";
                return (
                  <div
                    key={item.matchId}
                    className="rounded-md p-2 flex flex-col gap-1"
                  >
                    <div>
                      <button
                      title="Remove Bet"
                        type="button"
                        className="flex w-full justify-end text-[10px] text-gray-400 hover:text-red-500 cursor-pointer"
                        onClick={() => removeSelectionFromSlip(item.matchId)}
                      >
                        <Trash2 width={18} />
                      </button>
                      <div className="grid justify-center">
                        <span className="font-bold text-[.7rem] bg-blue-100 text-blue-500 py-1 px-2 rounded-md">
                          {(() => {
                            const d = new Date(item.match.startTime);

                            const month = d
                              .toLocaleString("en-GB", { month: "short" })
                              .toUpperCase(); // "MAR"
                            const day = d.toLocaleString("en-GB", {
                              day: "2-digit",
                            }); // "19"

                            const oneJan = new Date(d.getFullYear(), 0, 1);
                            const dayOfYear =
                              (d.getTime() - oneJan.getTime()) /
                                (1000 * 60 * 60 * 24) +
                              1;
                            const week = Math.ceil(dayOfYear / 7); // WEEK 1..52

                            return `${month} ${day} / WEEK ${week}`;
                          })()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 items-center justify-between px-3">
                        <div className="grid justify-items-center gap-2">
                          <img
                            className="w-10 h-10"
                            src={item.match.teamA.logo}
                            alt={item.match.teamA.name}
                          />
                          <span className="text-xs text-center font-semibold">
                            {item.match.teamA.code}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-lg font-bold">
                            {new Date(item.match.startTime).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              },
                            )}
                          </span>
                        </div>
                        <div className="grid justify-items-center gap-2">
                          <img
                            className="w-10 h-10"
                            src={item.match.teamB.logo}
                            alt={item.match.teamB.name}
                          />
                          <span className="text-xs text-center font-semibold">
                            {item.match.teamB.code}
                          </span>
                        </div>
                      </div>

                      <div className="py-5 grid gap-2">
                        <span className="text-[.7rem] text-blue-800 font-medium">
                          Match Result
                        </span>
                        <div>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                updateSlipChoice(item.matchId, "1")
                              }
                              className={`grid grid-cols-2 items-center  p-2 rounded-md text-[11px] border cursor-pointer
            ${
              item.choice === "1"
                ? "bg-blue-100 font-bold text-blue-500 border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
                            >
                              <span
                                className={`${item.choice === "1" ? "" : "font-bold text-gray-400"}`}
                              >
                                Home
                              </span>
                              <span
                                className={`${item.choice === "1" ? "" : "font-bold text-gray-800"}`}
                              >
                                {item.match.odds.home.toFixed(2)}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateSlipChoice(item.matchId, "X")
                              }
                              className={`grid grid-cols-2 items-center  px-2 py-1 rounded-md text-[11px] border cursor-pointer
            ${
              item.choice === "X"
                ? "bg-blue-100 font-bold text-blue-500 border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
                            >
                              <span
                                className={`${item.choice === "X" ? "" : "font-bold text-gray-400"}`}
                              >
                                Draw
                              </span>
                              <span
                                className={`${item.choice === "X" ? "" : "font-bold text-gray-800"}`}
                              >
                                {item.match.odds.draw.toFixed(2)}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateSlipChoice(item.matchId, "2")
                              }
                              className={`grid grid-cols-2 items-center  px-2 py-1 rounded-md text-[11px] border cursor-pointer
            ${
              item.choice === "2"
                ? "bg-blue-100 font-bold text-blue-500 border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
                            >
                              <span
                                className={`${item.choice === "2" ? "" : "font-bold text-gray-400"}`}
                              >
                                Away
                              </span>
                              <span
                                className={`${item.choice === "2" ? "" : "font-bold text-gray-800"}`}
                              >
                                {item.match.odds.away.toFixed(2)}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Stake + summary */}
          {betSlip.items.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <input
                    title="Bet Slip"
                    type="number"
                    min={0}
                    className="w-full font-semibold border-2 border-gray-300 rounded-md px-2 py-1 text-sm text-blue-500"
                    value={betSlip.stakePerBet || ""}
                    onChange={(e) =>
                      setBetSlip((prev) => ({
                        ...prev,
                        stakePerBet: Number(e.target.value) || 0,
                      }))
                    }
                  />
                  <label className="block text-[.7rem] text-gray-600">
                    Stake
                  </label>
                </div>
                <div className="grid gap-1">
                  <span className="font-semibold w-full border-2 border-gray-300 rounded-md px-2 py-1 text-sm text-green-500">
                    {betSlip.items
                      .reduce(
                        (acc, item) =>
                          acc + (betSlip.stakePerBet || 0) * item.odds,
                        0,
                      )
                      .toLocaleString("en-NG", { maximumFractionDigits: 0 })}
                  </span>
                  <label className="block text-[.7rem] text-gray-600">
                    Potential Winnings
                  </label>
                </div>
              </div>

              {/* <div className="flex justify-between items-center text-xs mt-2">
                <span>Total stake</span>
                <span className="font-semibold">
                  {betSlip.items.length * (betSlip.stakePerBet || 0)}
                </span>
              </div> */}

              <button
                type="button"
                disabled={
                  !betSlip.isAvailable ||
                  betSlip.items.length === 0 ||
                  betSlip.stakePerBet <= 0
                }
                onClick={handlePlaceBets}
                className="mt-3 w-full py-2 rounded-md text-sm font-semibold  cursor-pointer
    bg-blue-500 text-white disabled:bg-gray-300 disabled:text-gray-500"
              >
                PLACE {betSlip.items.length} BET
                {betSlip.items.length > 1 ? "S" : ""}
              </button>
            </>
          )}
        </div>
      )}
      <LeagueMatchesModal
        open={!!expandedLeague}
        league={expandedLeague}
        initialCategory={expandedCategory}
        onClose={() => setExpandedLeague(null)}
        onSelectOdds={addSelectionToSlip}
      />
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
