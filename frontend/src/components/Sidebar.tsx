"use client";

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
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Trophy, label: "Live Sports", href: "/dashboard/liveSports" },
  { icon: History, label: "Bet History", href: "/dashboard/betHistory" },
  { icon: LayoutList, label: "Categories", href: "/dashboard/categories" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const { isExpanded, toggleSidebar } = useSidebar();
  const pathname = usePathname();

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
                : "50vh",
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
              <div className="mt-12 w-10 h-10 bg-amber-600 rounded-full md:hidden" />
            )}

            <AnimatePresence>
              {isExpanded && (
                <motion.div className="grid justify-items-center">
                  <div className="w-15 h-15 mb-2 bg-amber-600 rounded-full" />
                  <div className="grid justify-items-center ">
                    <h3 className="text-[.9rem] font-semibold">Daniel Green</h3>
                    <div className="flex gap-3 text-[.8rem]">
                      <span className="text-gray-400 font-semibold">
                        Amateur
                      </span>
                      <span>Level 1</span>
                    </div>
                    <div className="flex gap-x-2">
                      <div className="">
                        <div className="flex font-semibold justify-center gap-1 text-[.7rem] items-center">
                          <User width={18} />
                          <span>1,546</span>
                        </div>
                        <div className="flex gap-1 text-[.7rem] items-center">
                          <Star width={12} />
                          <span>Followers</span>
                        </div>
                      </div>
                      <div className="">
                        <div className="flex font-semibold justify-center gap-1 text-[.7rem] items-center">
                          <User width={18} />
                          <span>150</span>
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
                {!isExpanded && (
                  <div className="hidden md:block fixed left-18 translate-y-1/3 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
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
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <h5 className="text-[.7rem] font-semibold text-gray-400">
                        FAVORITE SPORT
                      </h5>
                      <button title="add">
                        <BadgePlus width={18} />
                      </button>
                    </div>
                    <div className="flex gap-3 items-center py-3">
                      <div className="w-5 h-5 rounded-full bg-red-800" />
                      <span>Basketball</span>
                    </div>
                  </div>

                  {/* Favorite Club */}
                  <div className="my-5">
                    <div className="flex justify-between items-center">
                      <h5 className="text-[.7rem] font-semibold text-gray-400">
                        FAVORITE CLUB
                      </h5>
                      <button title="add">
                        <BadgePlus width={18} />
                      </button>
                    </div>
                    <div className="flex gap-3 items-center py-3">
                      <div className="w-5 h-5 rounded-full bg-blue-800" />
                      <span>Manchester United</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
