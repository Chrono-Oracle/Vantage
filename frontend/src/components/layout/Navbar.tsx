"use client";

import {
  Search,
  ChevronDown,
  Globe,
  Wallet,
  PlusCircle,
  History,
  X,
  Hourglass,
  CheckCircle2,
  XCircle,
  Banknote,
  Ticket,
} from "lucide-react";
import { useSidebar } from "@/utils/contexts/sidebar-context";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/utils/contexts/UserContext";
import { imgUrl } from "@/utils/libs/cdn";

type UserProfile = {
  wallet: { balance: number; currency: string };
  fullName: string;
};

export default function Navbar() {
  const { isExpanded } = useSidebar();
  const { userProfile, refreshUserProfile } = useUser();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBetsOpen, setIsBetsOpen] = useState(false);
  const [bets, setBets] = useState<any[]>([]);
  const [betsLoading, setBetsLoading] = useState(false);

  // const balance = 25000;
  const timezones = [
    { label: "Douala, Cameroon (WAT)", value: "GMT+1" },
    { label: "London, UK (GMT)", value: "GMT+0" },
    { label: "New York, USA (EST)", value: "GMT-5" },
    { label: "Paris, France (CET)", value: "GMT+1" },
    { label: "Tokyo, Japan (JST)", value: "GMT+9" },
  ];
  const [selected, setSelected] = useState(timezones[0]);

  // Lock scroll when mobile search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSearchOpen]);

  async function fetchProfile() {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    let parsed: { token?: string };
    try {
      parsed = JSON.parse(stored);
    } catch {
      return;
    }
    if (!parsed.token) return;

    try {
      const res = await fetch("http://localhost:5000/user/me", {
        headers: {
          Authorization: `Bearer ${parsed.token}`,
        },
      });
      const body = await res.json();
      if (!res.ok) {
        console.error("Failed to fetch profile:", body.message);
        return;
      }
      // setUserProfile(body.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenBets = async () => {
    setIsBetsOpen(true);
    setBetsLoading(true);

    const stored = localStorage.getItem("user");
    if (!stored) {
      setBets([]);
      setBetsLoading(false);
      return;
    }

    let parsed: { token?: string };
    try {
      parsed = JSON.parse(stored);
    } catch {
      setBets([]);
      setBetsLoading(false);
      return;
    }

    if (!parsed.token) {
      setBets([]);
      setBetsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/bet/my", {
        headers: {
          Authorization: `Bearer ${parsed.token}`,
        },
      });
      const body = await res.json();
      if (!res.ok) {
        console.error(body.message);
        setBets([]);
      } else {
        setBets(body.data ?? []);
      }
    } catch (err) {
      console.error("Error fetching user bets:", err);
      setBets([]);
    } finally {
      setBetsLoading(false);
    }
  };

  const handleCashOut = async (betId: string) => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    let parsed: { token?: string };
    try {
      parsed = JSON.parse(stored);
    } catch {
      return;
    }
    if (!parsed.token) return;

    try {
      const res = await fetch(`http://localhost:5000/bet/${betId}/cash-out`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${parsed.token}`,
        },
      });

      const body = await res.json();

      if (!res.ok) {
        console.error(body.message);
        return;
      }

      const updatedBet = body.data?.bet;
      const cashOutAmount = body.data?.cashOutAmount;

      if (!updatedBet || !updatedBet._id) {
        console.error("Cash-out response missing bet");
        return;
      }

      // mark bet as cashed_out + attach cashOutAmount
      setBets((prev) =>
        prev.map((b) =>
          b._id === updatedBet._id
            ? { ...b, ...updatedBet, cashOutAmount, isDisappearing: true }
            : b,
        ),
      );

      // remove the bet after 10 seconds
      setTimeout(() => {
        setBets((prev) => prev.filter((b) => b._id !== updatedBet._id));
      }, 10000);

      await refreshUserProfile();
    } catch (err) {
      console.error("Error cashing out:", err);
    }
  };

  function getStatusConfig(status: string) {
    switch (status) {
      case "pending":
        return { Icon: Hourglass, className: "text-yellow-500" };
      case "won":
        return { Icon: CheckCircle2, className: "text-green-500" };
      case "lost":
        return { Icon: XCircle, className: "text-red-500" };
      case "cashed_out":
        return { Icon: Banknote, className: "text-blue-400" };
      default:
        return { Icon: Banknote, className: "text-gray-400" };
    }
  }

  const balance = userProfile?.wallet?.balance ?? 0;
  const currency = userProfile?.wallet?.currency ?? "XAF";

  return (
    <nav
      className={`p-4 bg-gray-100 flex justify-between items-center fixed top-0 right-0 z-50 transition-all duration-300  dark:bg-slate-950 border-b border-gray-100 dark:border-gray-800 ${
        isExpanded ? "md:left-60" : "left-18 md:left-20"
      } left-0`}
    >
      <div className="flex gap-x-4 md:gap-x-10 items-center">
        {/* --- SEARCH BAR (Responsive) --- */}
        <div className="relative">
          {/* Desktop View */}
          <div className="hidden md:flex bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-transparent focus-within:border-blue-500 transition-all">
            <input
              type="text"
              placeholder="Search Sports"
              className="bg-transparent focus:outline-none w-64 md:w-80 text-sm"
            />
            <Search size={18} className="text-gray-400" />
          </div>

          {/* Mobile View Toggle */}
          <button
            title="Search Sports"
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 bg-gray-100 dark:bg-slate-800 rounded-full"
          >
            <Search size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Club Icons - Hidden on small mobile */}
        <div className="hidden sm:flex space-x-2 md:space-x-4">
          {/* My Bets */}
          <button
            type="button"
            onClick={handleOpenBets}
            className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-full border border-gray-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-semibold text-gray-600 dark:text-gray-200 cursor-pointer hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out"
            title="My Bets"
          >
            <Ticket width={19} />
          </button>

          {/* other circles can stay decorative or get other features */}
          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-full border border-gray-300 dark:border-slate-700"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-full border border-gray-300 dark:border-slate-700"></div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* --- WALLET (Responsive) --- */}
        <div className="relative">
          <button
            onClick={() => {
              setIsWalletOpen(!isWalletOpen);
              setIsTimezoneOpen(false);
            }}
            className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:bg-transparent dark:bg-slate-800 rounded-sm border border-transparent hover:border-blue-500/50 transition-all"
          >
            <div className="p-1.5 bg-blue-500 rounded-full text-white">
              <Wallet size={14} />
            </div>
            {/* Balance text hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                Balance
              </span>
              <span className="text-xs font-bold dark:text-white">
                {balance.toLocaleString()}{" "}
                <span className="text-[9px] text-blue-500">{currency}</span>
              </span>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${isWalletOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isWalletOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsWalletOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-800">
                  <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">
                    Available Funds
                  </p>
                  <h4 className="text-lg font-black dark:text-white">
                    {balance.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-blue-500">
                      XAF
                    </span>
                  </h4>
                </div>
                <div className="p-2 space-y-1">
                  <button className="flex items-center gap-3 w-full p-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                    <PlusCircle size={16} className="text-blue-500" /> Top up
                    Balance
                  </button>
                  <button className="flex items-center gap-3 w-full p-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                    <History size={16} className="text-gray-400" /> History
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* --- TIMEZONE (Responsive) --- */}
        <div className="relative">
          <button
            onClick={() => {
              setIsTimezoneOpen(!isTimezoneOpen);
              setIsWalletOpen(false);
            }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white md:bg-transparent dark:bg-slate-800 rounded-sm border border-transparent hover:border-gray-300 transition-all"
          >
            <Globe size={14} className="text-blue-500" />
            <span className="hidden md:inline text-xs font-medium text-gray-700 dark:text-gray-200">
              {selected.label}
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${isTimezoneOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isTimezoneOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsTimezoneOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden">
                <div className="py-1">
                  {timezones.map((tz) => (
                    <button
                      key={tz.value}
                      onClick={() => {
                        setSelected(tz);
                        setIsTimezoneOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-[11px] ${selected.value === tz.value ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                      {tz.label}{" "}
                      <span className="font-mono opacity-50">{tz.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- MOBILE SEARCH OVERLAY --- */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/60 z-60 backdrop-blur-sm"
            />
            {/* Search Input Box */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed top-0 left-15 right-0 bg-white dark:bg-slate-900 p-4 z-80 shadow-2xl flex items-center gap-3"
            >
              <div className="flex-1 bg-gray-100 dark:bg-slate-800 flex px-3 py-3 rounded-xl">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search Sports..."
                  className="bg-transparent focus:outline-none w-full text-sm dark:text-white"
                />
                <Search size={18} className="text-gray-400" />
              </div>
              <button
                title="Close"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-500"
              >
                <X size={24} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bet Tracker */}
      <AnimatePresence>
        {isBetsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsBetsOpen(false)}
            />
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4  dark:border-gray-800">
                <h3 className="text-sm font-semibold">MY BETS</h3>
                <button
                  type="button"
                  className="text-xs text-gray-500 cursor-pointer"
                  onClick={() => setIsBetsOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {betsLoading ? (
                  <p className="text-xs text-gray-500">Loading bets...</p>
                ) : bets.length === 0 ? (
                  <p className="text-xs font-bold grid justify-center items-center h-full text-gray-500">
                    PLACE YOUR FIRST BET !!!
                  </p>
                ) : (
                  bets.map((bet) => {
                    const match = bet.match;
                    const sport = match?.sport;
                    const league = match?.league;
                    const statusColor =
                      bet.status === "won"
                        ? "text-green-500"
                        : bet.status === "lost"
                          ? "text-red-500"
                          : bet.status === "cashed_out"
                            ? "text-yellow-500"
                            : "text-gray-500";

                    const canCashOut =
                      bet.status === "pending" &&
                      bet.match?.status !== "finished";

                    const cashOutLabel = bet.cashOutAmount
                      ? `Cashed out ${bet.cashOutAmount.toLocaleString()} ${userProfile?.wallet.currency ?? "XAF"}`
                      : "Cash Out";

                    const pickedOdds = bet.oddsAtPlacement;
                    const { Icon, className } = getStatusConfig(bet.status);

                    return (
                      <div
                        key={bet._id}
                        className="shadow-md dark:border-gray-800 rounded-md p-3 text-xs flex flex-col gap-1"
                      >
                        {/* <div className="flex justify-between items-center">
                          <span className="font-semibold">
                            {match?.teamA?.name} vs {match?.teamB?.name}
                          </span>
                          <span className={statusColor}>{bet.status}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">
                          {new Date(bet.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                        <div className="flex justify-between">
                          <span>
                            Stake:{" "}
                            <span className="font-semibold">
                              {bet.stake}{" "}
                              {userProfile?.wallet.currency ?? "XAF"}
                            </span>
                          </span>
                          <span>
                            Pot. payout:{" "}
                            <span className="font-semibold">
                              {bet.potentialPayout}
                            </span>
                          </span>
                        </div>
                        {bet.status === "cashed_out" && bet.cashOutAmount && (
                          <div className="mt-2 text-[11px] text-white font-semibold text-right">
                            Cashed out {bet.cashOutAmount.toLocaleString()}{" "}
                            {userProfile?.wallet.currency ?? "XAF"}
                          </div>
                        )}

                        {canCashOut && (
                          <div className="mt-2 flex justify-end">
                            <button
                              type="button"
                              className="cursor-pointer transition duration-200 ease-in-out px-3 py-1 rounded-md text-[11px] font-semibold bg-yellow-400 hover:bg-yellow-500 hover:text-white text-gray-900"
                              onClick={() => handleCashOut(bet._id)}
                            >
                              Cash Out
                            </button>
                          </div>
                        )} */}

                        <div className="flex items-center gap-2">
                          {sport?.logo && (
                            <img
                              src={imgUrl(sport.logo)}
                              alt={sport?.name || "Sport"}
                              className="w-5 h-5 rounded-full"
                            />
                          )}
                          <div>
                            <div className="font-bold text-gray-500">
                              <span>{league?.country ?? "Unknown"}</span>.
                              <span> {league?.name ?? "Unknown League"}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500">
                                {new Date(bet.createdAt).toLocaleString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="px-7 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <span className="text-right w-15 text-[.75rem] font-bold text-gray-700">
                              {match?.teamA?.name}
                            </span>
                            <img
                              className="w-9 h-9"
                              src={match?.teamA?.logo}
                              alt={match?.teamA?.name}
                            />
                          </div>
                          <div>
                            <span className="font-bold text-lg">vs</span>
                          </div>
                          <div className="flex items-center gap-5">
                            <img
                              className="w-9 h-9"
                              src={match?.teamB?.logo}
                              alt={match?.teamB?.name}
                            />
                            <span className=" w-15 font-bold text-[.75rem] text-gray-700">
                              {match?.teamB?.name}
                            </span>
                          </div>
                        </div>

                        <div className="py-4 grid gap-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-gray-500">
                                Stake:{" "}
                              </span>
                              <span className="font-bold">
                                {bet.stake}{" "}
                                {userProfile?.wallet.currency ?? "XAF"}
                              </span>
                            </div>
                            <span className="font-bold">
                              {pickedOdds?.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-500">
                              Status:{" "}
                            </span>
                            <div className="flex items-center gap-1">
                              <Icon className={`w-4 h-4 ${className}`} />
                              <span
                                className={`text-xs font-semibold capitalize ${className}`}
                              >
                                {bet.status.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {bet.status === "cashed_out" && bet.cashOutAmount && (
                          <div className="mt-2 text-[11px] text-white font-semibold text-right">
                            Cashed out {bet.cashOutAmount.toLocaleString()}{" "}
                            {userProfile?.wallet.currency ?? "XAF"}
                          </div>
                        )}

                        {bet.isDisappearing && (
                          <div className="mt-2 w-full bg-gray-800/40 rounded-full overflow-hidden">
                            <div className="cashout-timer-bar" />
                          </div>
                        )}

                        {canCashOut && (
                          <div className="mt-2 flex justify-end">
                            <button
                              type="button"
                              className="cursor-pointer transition duration-200 ease-in-out px-3 py-1 rounded-md text-[11px] font-semibold bg-red-400 hover:bg-red-500 hover:text-white text-gray-900"
                              onClick={() => handleCashOut(bet._id)}
                            >
                              Cash Out
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
