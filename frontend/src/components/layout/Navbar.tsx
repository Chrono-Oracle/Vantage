"use client";

import { Search, ChevronDown, Globe, Wallet, PlusCircle, History, X } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { isExpanded } = useSidebar();
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const balance = 25000;
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
            <input type="text" placeholder="Search Sports" className="bg-transparent focus:outline-none w-64 md:w-80 text-sm" />
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-full border border-gray-300 dark:border-slate-700"></div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* --- WALLET (Responsive) --- */}
        <div className="relative">
          <button
            onClick={() => { setIsWalletOpen(!isWalletOpen); setIsTimezoneOpen(false); }}
            className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:bg-transparent dark:bg-slate-800 rounded-sm border border-transparent hover:border-blue-500/50 transition-all"
          >
            <div className="p-1.5 bg-blue-500 rounded-full text-white">
              <Wallet size={14} />
            </div>
            {/* Balance text hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Balance</span>
              <span className="text-xs font-bold dark:text-white">{balance.toLocaleString()} <span className="text-[9px] text-blue-500">XAF</span></span>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${isWalletOpen ? "rotate-180" : ""}`} />
          </button>

          {isWalletOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsWalletOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-800">
                  <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold tracking-widest">Available Funds</p>
                  <h4 className="text-lg font-black dark:text-white">{balance.toLocaleString()} <span className="text-xs font-normal text-blue-500">XAF</span></h4>
                </div>
                <div className="p-2 space-y-1">
                  <button className="flex items-center gap-3 w-full p-2.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                    <PlusCircle size={16} className="text-blue-500" /> Top up Balance
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
            onClick={() => { setIsTimezoneOpen(!isTimezoneOpen); setIsWalletOpen(false); }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white md:bg-transparent dark:bg-slate-800 rounded-sm border border-transparent hover:border-gray-300 transition-all"
          >
            <Globe size={14} className="text-blue-500" />
            <span className="hidden md:inline text-xs font-medium text-gray-700 dark:text-gray-200">{selected.label}</span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${isTimezoneOpen ? "rotate-180" : ""}`} />
          </button>

          {isTimezoneOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsTimezoneOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden">
                <div className="py-1">
                  {timezones.map((tz) => (
                    <button
                      key={tz.value}
                      onClick={() => { setSelected(tz); setIsTimezoneOpen(false); }}
                      className={`flex items-center justify-between w-full px-4 py-2.5 text-[11px] ${selected.value === tz.value ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                      {tz.label} <span className="font-mono opacity-50">{tz.value}</span>
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/60 z-60 backdrop-blur-sm"
            />
            {/* Search Input Box */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
              className="fixed top-0 left-15 right-0 bg-white dark:bg-slate-900 p-4 z-80 shadow-2xl flex items-center gap-3"
            >
              <div className="flex-1 bg-gray-100 dark:bg-slate-800 flex px-3 py-3 rounded-xl">
                <input autoFocus type="text" placeholder="Search Sports..." className="bg-transparent focus:outline-none w-full text-sm dark:text-white" />
                <Search size={18} className="text-gray-400" />
              </div>
              <button title="Close" onClick={() => setIsSearchOpen(false)} className="p-2 text-gray-500"><X size={24} /></button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}