"use client";

import { useAuth } from "@/utils/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/utils/contexts/sidebar-context";
import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { dummyMatches } from "@/data/dummyMatches";
import GamesBoard from "@/components/boards/GamesBoard";
import GamesBoardX from "@/components/boards/GameBoardX";

export default function DashboardPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const router = useRouter();

  const { isLogin, isAuthLoading } = useAuth();

  const { isExpanded } = useSidebar();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dummyMatches.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const match = dummyMatches[currentIndex];

  useEffect(() => {
    console.log("isLogin: ", isLogin);
    console.log("isAuthLoading: ", isAuthLoading);

    if (!isAuthLoading && !isLogin) {
      router.push("/login");
    }
  }, [isLogin, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* Grid with a left and right column with fr units */}
      <div
        className={`grid lg:grid-cols-[65fr_35fr] mt-15 md:mt-16 md:pt-8 ${isExpanded ? "md:grid-cols-[1fr_1fr]" : "md:grid-cols-[60fr_40fr]"}`}
      >
        {/* Left column */}
        <div className="relative w-full">
          {/* Hero */}
          <div className="relative  bg-blue-500 w-full h-70 rounded-2xl">
            <HeroCarousel />

            {/* Main hero comps */}
            <div key={match.id} className="">
              {/* Top Info */}
              <div className="absolute top-0 w-full h-10 z-10 p-5">
                <div className="flex gap-2 text-white items-center">
                  <div className="text-white bg-white/20 p-1.5 rounded-md">
                    <Clock width={19} />
                  </div>
                  <span>{match.time}</span>
                </div>
              </div>
              <div className="px-5 absolute bottom-4 left-0 right-0 z-10">
                <div className="flex flex-col gap-4 w-full max-w-full">
                  {/* Team Info Section */}
                  <div className="grid w-full">
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-y-1 items-start">
                        <div className="w-10 h-10 bg-amber-400 rounded-full shadow-lg" />
                        <span className="text-white font-bold text-sm uppercase">
                          {match.homeAbbr}
                        </span>
                        <span className="text-white/80 text-xs hidden sm:block">
                          {match.teamHome}
                        </span>
                      </div>

                      <div className="flex flex-col gap-y-1 items-end">
                        <div className="w-10 h-10 bg-amber-400 rounded-full mb-1 shadow-lg" />
                        <span className="text-white font-bold text-sm uppercase">
                          {match.awayAbbr}
                        </span>
                        <span className="text-white/80 text-xs hidden sm:block">
                          {match.teamAway}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Probability Bar */}
                  <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-white/10 backdrop-blur-md">
                    <div
                      className="probability-bar-segment bg-green-500"
                      style={
                        {
                          "--segment-width": match.odds.home,
                        } as React.CSSProperties
                      }
                      title={`Home: ${match.odds.home}`}
                    />
                    <div
                      className="probability-bar-segment bg-gray-400"
                      style={
                        {
                          "--segment-width": match.odds.draw,
                        } as React.CSSProperties
                      }
                      title={`Draw: ${match.odds.draw}`}
                    />
                    <div
                      className="probability-bar-segment bg-red-500"
                      style={
                        {
                          "--segment-width": match.odds.away,
                        } as React.CSSProperties
                      }
                      title={`Away: ${match.odds.away}`}
                    />
                  </div>

                  {/* Match Brief Info - Using flex-1 to allow shrinking */}
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <div className="flex-1 h-8 bg-white/10 backdrop-blur-sm rounded-full border border-white/5" />
                    <div className="flex-1 h-8 bg-white/10 backdrop-blur-sm rounded-full border border-white/5" />
                    <div className="flex-1 h-8 bg-white/10 backdrop-blur-sm rounded-full border border-white/5" />
                  </div>
                </div>
              </div>
            </div>


            {/* Matchboard Section */}
            <div className="my-10">
              {/* <GamesBoard/> */}
              <GamesBoardX/>
            </div>

            Below
          </div>
        </div>
        {/* Right column */}
        <div className="w-full"></div>
      </div>
    </>
  );
}
