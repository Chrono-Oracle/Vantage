'use client'

import { useSidebar } from "@/components/sidebar-context";
import HeroCarousel from '@/components/HeroCarousel';

export default function DashboardPage() {

  const { isExpanded } = useSidebar();

  return (
    <>
      {/* Grid with a left and right column with fr units */}
      <div className={`grid lg:grid-cols-[65fr_35fr] mt-15 md:mt-16 md:pt-8 ${isExpanded ? "md:grid-cols-[1fr_1fr]" : "md:grid-cols-[60fr_40fr]"}`}>
        {/* Left column */}
        <div className="w-full">
          {/* Hero */}
          <div className="bg-blue-500 w-full h-70 rounded-2xl">
            <HeroCarousel />
          </div>
        </div>
        {/* Right column */}
        <div className="w-full"></div>
      </div>
    </>
  );
}