'use client'

import { useSidebar } from "@/components/sidebar-context";

export default function DashboardPage() {

  const { isExpanded } = useSidebar();

  return (
    <>
      {/* Grid with a left and right column with fr units */}
      <div className={`grid lg:grid-cols-[65fr_35fr] ${isExpanded ? "md:grid-cols-[1fr_1fr]" : "md:grid-cols-[60fr_40fr]"}`}>
        <div className="w-full bg-amber-950 h-screen"></div>
        <div className="w-full bg-amber-400 h-screen"></div>
      </div>
    </>
  );
}