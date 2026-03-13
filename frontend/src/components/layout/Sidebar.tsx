"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Trophy,
  History,
  User,
  ChevronRight,
  ChevronLeft,
  Settings,
  LayoutList,
  Star,
  Check,
  BadgePlus,
  CircleMinus,
  ChevronDown,
} from "lucide-react";
import { useSidebar } from "@/utils/contexts/sidebar-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { imgUrl } from "@/utils/libs/cdn";
import { LogoutButton } from "../LogoutButton";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Trophy, label: "Live Sports", href: "/dashboard/liveSports" },
  { icon: History, label: "Bet History", href: "/dashboard/betHistory" },
  { icon: LayoutList, label: "Categories", href: "/dashboard/categories" },
  { icon: User, label: "Profile", href: "/dashboard/profile" }
  // { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

type User = {
  _id: string;
  fullName: string;
  email: string;
  avatar: string | null;

  // Gamification
  level: number;
  rankTitle: string;
  experiencePoints: number;

  // Social counts
  followersCount: number;
  followingCount: number;

  // Favorites (populated)
  favoriteSports?: {
    _id: string;
    name: string;
    logo?: string;
  }[];

  favoriteClubs?: {
    _id: string;
    name: string;
    logo?: string;
  }[];
};

// Sidebar grouping: favorite clubs by their sport
type ClubWithSport = any & { sport?: any };

export function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const { isExpanded, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  //Favorite Sports and Club
  const [availableSports, setAvailableSports] = useState<any[]>([]);
  const [availableClubs, setAvailableClubs] = useState<any[]>([]);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [showClubSideMenu, setShowClubSideMenu] = useState(false);
  const [expandedSports, setExpandedSports] = useState<Record<string, boolean>>(
    {},
  );
  const [selectedClubIds, setSelectedClubIds] = useState<string[]>([]);
  const [expandedClubGroups, setExpandedClubGroups] = useState<
    Record<string, boolean>
  >({});

  const sportCountLabel = `${user?.favoriteSports?.length || 0}/3`;
  const clubsBySport =
    user?.favoriteSports?.map((sport: any) => ({
      sport,
      clubs: availableClubs.filter((club) => club.sport === sport._id),
    })) || [];

  const clubsBySportForSidebar =
    (user?.favoriteSports || []).map((sport) => ({
      sport,
      clubs:
        (user?.favoriteClubs as ClubWithSport[] | undefined)?.filter(
          (club) =>
            club.sport?.toString?.() === sport._id.toString?.() ||
            club.sport === sport._id,
        ) || [],
    })) || [];
  // Helper: already followed clubs per sport (from user.favoriteClubs)
  // Build a map: sportId -> count of favorite clubs for that sport
  const favoriteClubCountsBySport: Record<string, number> = {};
  user?.favoriteClubs?.forEach((club: any) => {
    const sportId = club.sport?.toString?.() ?? club.sport; // depends on populate
    if (!sportId) return;
    favoriteClubCountsBySport[sportId] =
      (favoriteClubCountsBySport[sportId] || 0) + 1;
  });
  const followedClubIds = new Set(
    (user?.favoriteClubs || []).map((c: any) => c._id.toString()),
  );
  const hasFavoriteSports = (user?.favoriteSports?.length || 0) > 0;

  //Fetch User Profile
  useEffect(() => {
    const fetchUser = async () => {
      const stored = localStorage.getItem("user");

      if (!stored) {
        console.log("No user in localStorage, redirecting to login");
        router.push("/login");
        return;
      }

      const { token } = JSON.parse(stored) as { token: string; role: string };

      try {
        const res = await fetch("http://localhost:5000/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.log("Failed to fetch user, status:", res.status);
          router.push("/login");
          return;
        }

        const body = (await res.json()) as {
          error: boolean;
          data: User;
          message: string;
        };
        console.log("User from backend:", body.data);

        if (!body.error) {
          setUser(body.data);
          console.log("favoriteSports from backend:", body.data.favoriteSports);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  //Fetch Available Sports and Clubs
  useEffect(() => {
    const fetchChoices = async () => {
      try {
        const [sportsRes, clubsRes] = await Promise.all([
          fetch("http://localhost:5000/sport"),
          fetch("http://localhost:5000/team"),
        ]);

        if (!sportsRes.ok || !clubsRes.ok) {
          console.log(
            "Failed to fetch choices",
            sportsRes.status,
            clubsRes.status,
          );
          return;
        }

        // console.log("Raw Sports Data:", sportsRes);
        // console.log("Raw Clubs Data:", clubsRes);

        const sportsData = await sportsRes.json();
        const clubsData = await clubsRes.json();

        // console.log("Raw Sports Data:", sportsData);

        setAvailableSports(
          Array.isArray(sportsData) ? sportsData : sportsData.data || [],
        );
        setAvailableClubs(clubsData.data || []);
      } catch (err) {
        console.error("Error fetching choices:", err);
      }
    };

    fetchChoices();
  }, []);

  const handleToggleFavorite = async (
    type: "sport" | "club",
    id: string,
    action: "follow" | "unfollow",
  ) => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const { token } = JSON.parse(stored);

    try {
      // 1. Perform the Toggle
      const res = await fetch("http://localhost:5000/user/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, type, id }),
      });

      const body = await res.json();

      if (res.ok && !body.error) {
        // 2. RE-FETCH FRESH USER DATA
        // This ensures the sidebar always has populated names and images
        const userRes = await fetch("http://localhost:5000/user/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const userBody = await userRes.json();
        if (!userBody.error) {
          setUser(userBody.data); // Update state with perfect data
        }

        if (
          type === "sport" &&
          action === "unfollow" &&
          (userBody.data.favoriteSports?.length || 0) === 0
        ) {
          setShowClubSideMenu(false); // only close side menu, not sidebar
        }

        setShowSportDropdown(false);
      } else {
        // This handles the "Already followed" or "Not following" 400 errors
        console.error("Toggle failed:", body.message);
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  //Default Profile Pic
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  return (
    <>
      {/* Mobile Toggle Trigger - Only visible on Mobile */}
      <motion.button
        initial={false}
        animate={{
          // We use the same logic as your sidebar width to ensure they stay glued together
          left: isExpanded ? 220 : 48, // 220px (left-55) vs 48px (left-12)
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        onClick={toggleSidebar}
        className="fixed top-3 z-80 md:hidden p-2 bg-background dark:bg-slate-800 rounded-full"
      >
        {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </motion.button>
      <motion.aside
        initial={false}
        animate={{
          width: isExpanded ? 240 : 70,
          x: 0,
          height:
            typeof window !== "undefined" && window.innerWidth < 768
              ? "100vh"
              : isExpanded
                ? "100vh"
                : "45vh",
          top:
            typeof window !== "undefined" && window.innerWidth < 768
              ? "0%"
              : isExpanded
                ? "0%"
                : "20%",
        }}
        className={`fixed left-0 z-70 pt-2 md:rounded-md shadow-lg flex flex-col overflow-hidden overflow-y-scroll no-scrollbar bg-background dark:bg-slate-900 ${isExpanded ? "h-screen" : "h-screen md:h-1/2"}`}
      >
        <div className="relative">
          {/* Toggle Button */}
          <div className="hidden md:block">
            <button
              onClick={toggleSidebar}
              className="p-2 grid rounded-lg transition-colors"
            >
              {isExpanded ? (
                <div className="absolute top-10 right-5">
                  <ChevronLeft size={20} />
                </div>
              ) : (
                <div className="absolute inset-0 translate-x-1/3">
                  <ChevronRight size={20} />
                </div>
              )}
            </button>
          </div>

          {/* Top Header */}
          <div className="mb-5 grid justify-items-center">
            {!isExpanded && (
              <div className="mt-12 w-10 h-10 rounded-full md:hidden">
                {user?.avatar && (
                  <img
                    className="object-cover"
                    src={imgUrl(user.avatar)}
                    alt="User"
                  />
                )}
              </div>
            )}

            <AnimatePresence>
              {isExpanded && (
                <motion.div className="grid justify-items-center">
                  <div className=" mb-2 rounded-full w-15 h-15 overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 text-white font-bold">
                    {user?.avatar ? (
                      <img
                        src={imgUrl(user.avatar)}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm tracking-tighter">
                        {getInitials(user?.fullName || "User")}
                      </span>
                    )}
                  </div>
                  <div className="grid justify-items-center ">
                    <h3 className="text-[.9rem] font-semibold">
                      {user?.fullName}
                    </h3>
                    <div className="flex gap-3 text-[.8rem]">
                      <span className="text-gray-400 font-semibold">
                        {user?.rankTitle}
                      </span>
                      <span>Level {user?.level}</span>
                    </div>
                    <div className="flex gap-x-2">
                      <div className="">
                        <div className="flex font-semibold justify-center gap-1 text-[.7rem] items-center">
                          <User width={18} />
                          <span>{user?.followersCount}</span>
                        </div>
                        <div className="flex gap-1 text-[.7rem] items-center">
                          <Star width={12} />
                          <span>Followers</span>
                        </div>
                      </div>
                      <div className="">
                        <div className="flex font-semibold justify-center gap-1 text-[.7rem] items-center">
                          <User width={18} />
                          <span>{user?.followingCount}</span>
                        </div>
                        <div className="flex gap-1 text-[.7rem] items-center">
                          <Check width={12} />
                          <span>Following</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-1 space-y-2 mx-2 mt-1 py-5 md:mt-0 md:py-0 border-y-2 border-gray-100 md:border-none">
            <p className="block md:hidden px-2 text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
              {isExpanded ? "Menu" : "Menu"}
            </p>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative grid gap-y-3 group ${pathname === item.href ? "text-blue-400" : ""}`}
              >
                <button className="w-full flex items-center p-3 hover:bg-linear-to-br from-blue-300 to-blue-500 hover:text-white rounded-xl transition ease-in-out duration-100 group cursor-pointer">
                  <item.icon size={18} className="min-w-6" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="ml-3 font-medium text-[.9rem] whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Tooltip  */}
                {/* {!isExpanded && (
                  <div className="hidden md:block fixed left- translate-y-1/3 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2 whitespace-nowrap">
                    {item.label}
                  </div>
                )} */}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-4">
                  {/* Favorite Sport */}
                  <div className="mt-2 relative">
                    <div className="flex justify-between relative items-center">
                      <h5 className="text-[.7rem] font-semibold text-gray-400">
                        FAVORITE SPORT ({sportCountLabel})
                      </h5>
                      <button
                        title="add"
                        onClick={() => setShowSportDropdown(!showSportDropdown)}
                        className="cursor-pointer hover:text-green-500 transition ease-in-out duration-100"
                      >
                        <BadgePlus width={15} />
                      </button>
                    </div>

                    {/* Dropdown Menu for Sports */}
                    {showSportDropdown && (
                      <ul className="absolute z-20 w-50 top-8 left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-md shadow-md rounded-md overflow-hidden ">
                        {availableSports.map((s) => (
                          <li
                            key={s._id}
                            onClick={() =>
                              handleToggleFavorite("sport", s._id, "follow")
                            }
                            className="flex items-center p-3 gap-2 cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300 ease-in-out"
                          >
                            <img
                              src={imgUrl(s.logo)}
                              alt={s.name}
                              className="w-5 h-5"
                            />
                            <span>{s.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* List of followed sports with Remove button */}
                    {user?.favoriteSports?.map((sport) => (
                      <div
                        key={sport._id}
                        className="flex justify-between items-center py-2"
                      >
                        <div className="flex gap-3 items-center">
                          <img
                            src={imgUrl(sport.logo)}
                            alt={sport?.name}
                            className="w-5 h-5"
                          />
                          <span className="font-bold text-sm">
                            {sport?.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          title="remove"
                          onClick={() =>
                            handleToggleFavorite("sport", sport._id, "unfollow")
                          }
                          className="text-red-500"
                        >
                          <CircleMinus width={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Favorite Club */}
                  <div
                    className={`my-5 ${
                      hasFavoriteSports ? "" : "opacity-40 pointer-events-none"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h5 className="text-[.7rem] font-semibold text-gray-400">
                        FAVORITE CLUB
                      </h5>
                      <button title="add">
                        <BadgePlus
                          width={15}
                          className="cursor-pointer hover:text-green-500 transition ease-in-out duration-100"
                          onClick={() => {
                            setShowClubSideMenu(true);
                            setExpandedSports({}); // reset expansion
                            setSelectedClubIds([]); // reset selection
                          }}
                        />
                      </button>
                    </div>
                    <div className="w-full flex justify-between items-center pb-3">
                      {/* Grouped favorite clubs by sport */}
                      <div className="w-full mt-2 space-y-3">
                        {clubsBySportForSidebar.map(({ sport, clubs }) => {
                          if (clubs.length === 0) return null; // skip sports with no clubs

                          const isOpen = expandedClubGroups[sport._id] ?? true; // default open

                          return (
                            <div
                              key={sport._id}
                              className="border border-gray-200 rounded-md"
                            >
                              {/* Sport header row */}
                              <button
                                type="button"
                                className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold"
                                onClick={() =>
                                  setExpandedClubGroups((prev) => ({
                                    ...prev,
                                    [sport._id]: !isOpen,
                                  }))
                                }
                              >
                                <div className="flex items-center gap-2">
                                  {sport.logo && (
                                    <img
                                      src={imgUrl(sport.logo)}
                                      alt={sport.name}
                                      className="w-4 h-4"
                                    />
                                  )}
                                  <span>{sport.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                  <span>
                                    {clubs.length} club
                                    {clubs.length === 1 ? "" : "s"}
                                  </span>
                                  <ChevronDown
                                    size={12}
                                    className={
                                      isOpen
                                        ? "rotate-180 transition"
                                        : "transition"
                                    }
                                  />
                                </div>
                              </button>

                              {/* Clubs for this sport */}
                              {isOpen && (
                                <div className="border-t border-gray-100 py-1 space-y-1">
                                  {clubs.map((club: any) => (
                                    <div
                                      key={club._id}
                                      className="px-2 flex justify-between items-center text-xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        <img
                                          src={club.logo}
                                          alt={club.name}
                                          className="w-4 h-4"
                                        />
                                        <span>{club.name}</span>
                                      </div>
                                      <button
                                        type="button"
                                        title="remove"
                                        onClick={() =>
                                          handleToggleFavorite(
                                            "club",
                                            club._id,
                                            "unfollow",
                                          )
                                        }
                                        className="text-red-500"
                                      >
                                        <CircleMinus width={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Fallback if absolutely no clubs across any sport */}
                        {(!user?.favoriteClubs ||
                          user.favoriteClubs.length === 0) && (
                          <p className="text-xs text-gray-400">
                            No favorite clubs yet
                          </p>
                        )}
                      </div>

                      {/* Club selection side menu */}
                      <AnimatePresence>
                        {showClubSideMenu && (
                          <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 24,
                            }}
                            className="fixed inset-y-0 right-0 z-100 w-80 bg-white/30 backdrop-blur-md shadow-xl p-4 flex flex-col"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-semibold">
                                Select Favorite Clubs
                              </h3>
                              <button
                                className="text-xs text-gray-500"
                                onClick={() => setShowClubSideMenu(false)}
                              >
                                Close
                              </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3">
                              {clubsBySport.map(({ sport, clubs }) => {
                                const isExpanded =
                                  expandedSports[sport._id] ?? true;

                                const selectedCountForSport =
                                  selectedClubIds.filter((id) =>
                                    clubs.some((c: any) => c._id === id),
                                  ).length;

                                const alreadyFollowedForSport =
                                  favoriteClubCountsBySport[sport._id] || 0;

                                const maxPerSport = 5;
                                const totalForSport =
                                  alreadyFollowedForSport +
                                  selectedCountForSport;
                                const remainingForSport = Math.max(
                                  maxPerSport - totalForSport,
                                  0,
                                );

                                return (
                                  <div
                                    key={sport._id}
                                    className="border border-gray-200 rounded-md"
                                  >
                                    {/* Sport header row */}
                                    <button
                                      type="button"
                                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium"
                                      onClick={() =>
                                        setExpandedSports((prev) => ({
                                          ...prev,
                                          [sport._id]: !isExpanded,
                                        }))
                                      }
                                    >
                                      <div className="flex items-center gap-2">
                                        {/* sport logo optional */}
                                        {/* <img src={imgUrl(sport.logo)} className="w-4 h-4" /> */}
                                        <span>{sport.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>
                                          {selectedCountForSport} selected ·{" "}
                                          {remainingForSport} left
                                        </span>
                                        <ChevronDown
                                          size={14}
                                          className={
                                            isExpanded
                                              ? "rotate-180 transition"
                                              : "transition"
                                          }
                                        />
                                      </div>
                                    </button>

                                    {/* Clubs list for this sport */}
                                    {isExpanded && clubs.length > 0 && (
                                      <div className="border-t border-gray-200">
                                        {clubs.map((club: any) => {
                                          const clubId = club._id.toString();
                                          const isSelected =
                                            selectedClubIds.includes(club._id);
                                          const isAlreadyFollowed =
                                            followedClubIds.has(clubId);
                                          const sportHasSpace =
                                            remainingForSport > 0 || isSelected;

                                          const disabled =
                                            isAlreadyFollowed || !sportHasSpace;

                                          return (
                                            <button
                                              key={club._id}
                                              type="button"
                                              disabled={disabled}
                                              onClick={() => {
                                                if (disabled && !isSelected)
                                                  return; // extra safety

                                                setSelectedClubIds(
                                                  (prev) =>
                                                    isSelected
                                                      ? prev.filter(
                                                          (id) => id !== clubId,
                                                        ) // deselect
                                                      : [...prev, clubId], // select
                                                );
                                              }}
                                              className={`w-full flex items-center justify-between px-3 py-2 text-xs  
        ${isSelected ? "bg-blue-50" : ""}
        ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-500 hover:text-white transition ease-in-out duration-200  cursor-pointer"}
        ${isAlreadyFollowed ? "hover:bg-none " : " "}`}
                                            >
                                              <div className="flex items-center gap-2 ">
                                                <img
                                                  src={club.logo}
                                                  alt={club.name}
                                                  className="w-4 h-4"
                                                />
                                                <span>{club.name}</span>
                                              </div>

                                              {isAlreadyFollowed &&
                                                !isSelected && (
                                                  <span className="text-[10px] text-white bg-green-500 p-1 w-4 h-4 flex items-center justify-center rounded-full">
                                                    <Check
                                                      width={12}
                                                      strokeWidth={5}
                                                    />
                                                  </span>
                                                )}
                                              {isSelected &&
                                                !isAlreadyFollowed && (
                                                  <Check
                                                    size={14}
                                                    className="text-green-500 "
                                                  />
                                                )}
                                            </button>
                                          );
                                        })}
                                        {clubs.length === 0 && (
                                          <div className="px-3 py-2 text-xs text-gray-400">
                                            No clubs for this sport yet.
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Bottom Add button */}
                            <div className="pt-3  mt-3">
                              <button
                                type="button"
                                disabled={selectedClubIds.length === 0}
                                onClick={async () => {
                                  // Call backend for each selected club or send them in bulk
                                  const stored = localStorage.getItem("user");
                                  if (!stored) return;
                                  const { token } = JSON.parse(stored);

                                  // Simple version: one request per club
                                  await Promise.all(
                                    selectedClubIds.map((clubId) =>
                                      fetch(
                                        "http://localhost:5000/user/favorites/toggle",
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                          },
                                          body: JSON.stringify({
                                            action: "follow",
                                            type: "club",
                                            id: clubId,
                                          }),
                                        },
                                      ),
                                    ),
                                  );

                                  // Re-fetch user to update favoriteClubs
                                  const userRes = await fetch(
                                    "http://localhost:5000/user/me",
                                    {
                                      method: "GET",
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    },
                                  );
                                  const userBody = await userRes.json();
                                  if (!userBody.error) setUser(userBody.data);

                                  setShowClubSideMenu(false);
                                }}
                                className="w-full py-2 text-sm font-semibold rounded-md bg-blue-500 text-white disabled:bg-gray-300"
                              >
                                Add {selectedClubIds.length} club
                                {selectedClubIds.length === 1 ? "" : "s"}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isExpanded && <div className="p-4"><LogoutButton /></div>}
      </motion.aside>
    </>
  );
}
