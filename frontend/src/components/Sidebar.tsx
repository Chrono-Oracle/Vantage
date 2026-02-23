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
    <motion.aside
      initial={false}
      animate={{
        width: isExpanded ? 240 : 70,
        height: isExpanded ? "100vh" : "50vh",
        top: isExpanded ? "0%" : "20%", // Centers 50% height vertically
      }}
      className="fixed left-0 z-50 pt-2  rounded-2xl shadow-lg flex flex-col overflow-hidden overflow-y-scroll no-scrollbar"
    >
      <div className="relative">
        {/* Toggle Button */}
        <div className="">
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
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="grid justify-items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-15 h-15 mb-2 bg-amber-600 rounded-full" />
                <div className="grid justify-items-center ">
                  <h3 className="text-[.9rem] font-semibold">Daniel Green</h3>
                  <div className="flex gap-3 text-[.8rem]">
                    <span className="text-gray-400 font-semibold">Amateur</span>
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
        <nav className="flex-1 px-3 space-y-2">
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
                <div className="fixed left-18 translate-y-1/3 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2 whitespace-nowrap">
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
                    <h5 className="text-[.9rem] font-semibold">
                      Favorite Sport
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
                    <h5 className="text-[.9rem] font-semibold">Favorite Club</h5>
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
  );
}
