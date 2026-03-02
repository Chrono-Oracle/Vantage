"use client";

import { useAuth } from "@/utils/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/sidebar-context";
import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { dummyMatches } from "@/data/dummyMatches";

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
          <div className="relative bg-blue-500 w-full h-70 rounded-2xl">
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
              <div className="px-5 absolute bottom-0 w-full h-35 z-10">
                {/* team logos */}
                <div className="flex justify-between">
                  <div className="w-9 h-9 bg-amber-400 rounded-full" />
                  <div className="w-9 h-9 bg-amber-400 rounded-full" />
                </div>

                {/* team name abbr */}
                <div className="flex justify-between text-white">
                  <span className="">{match.homeAbbr}</span>
                  <span className="">{match.awayAbbr}</span>
                </div>
                {/* team fullname */}
                <div className="flex justify-between">
                  <span className="text-white">{match.teamHome}</span>
                  <span className="text-white">{match.teamAway}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right column */}
        <div className="w-full"></div>
      </div>
    </>
  );
}
