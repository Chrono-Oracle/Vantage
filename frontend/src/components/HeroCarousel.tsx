"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dummyMatches } from "@/data/dummyMatches";
import Image from "next/image";

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dummyMatches.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const match = dummyMatches[currentIndex];

  return (
    <div className="relative w-full h-full rounded-3xl px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={match.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="relative h-full w-full"
        >
          {/* Image Hero */}
          <div className="relative overflow-hidden -translate-y-1/6 w-full h-[120%] bottom-0 ">
            <Image
              src={match.mainPlayerImg}
              alt="Main Player"
              width={500}
              height={450}
              className=" absolute left-1/2 -translate-y-5 -translate-x-1/2  object-contain object-bottom z-20"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      

      {/* Dots Indicator */}
      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {dummyMatches.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${i === currentIndex ? "bg-white w-4" : "bg-white/30"}`}
          />
        ))}
      </div> */}
    </div>
  );
}
