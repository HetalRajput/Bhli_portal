"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFENCE_FACTS = [
  "Did you know? The Indian Army is the second-largest standing army in the world.",
  "Did you know? The Indian Air Force operates at the highest battlefield in the world, Siachen.",
  "Did you know? The Indian Navy's MARCOS are among the most elite special forces globally.",
  "Did you know? India has the world's largest voluntary military force.",
  "Did you know? The National Defence Academy (NDA) in Pune is the world's first tri-service academy.",
];

export default function DefenceLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    // Pick a random fact on mount
    setFactIndex(Math.floor(Math.random() * DEFENCE_FACTS.length));

    // Hide loader after 3.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a170f] text-white overflow-hidden"
        >
          {/* Subtle Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#cda653]/10 rounded-full blur-[100px]" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Ashoka Chakra Spinner */}
            <div className="relative w-28 h-28 mb-10">
              <svg className="absolute inset-0 w-full h-full text-[#cda653] animate-[spin_4s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="50" cy="50" r="45" strokeOpacity="0.8" />
                <circle cx="50" cy="50" r="10" fill="#cda653" stroke="none" />
                <circle cx="50" cy="50" r="4" fill="#0a170f" stroke="none" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line key={i} x1="50" y1="50" x2={Number((50 + 45 * Math.cos((i * 15 * Math.PI) / 180)).toFixed(4))} y2={Number((50 + 45 * Math.sin((i * 15 * Math.PI) / 180)).toFixed(4))} strokeOpacity="0.8" />
                ))}
              </svg>
            </div>

            {/* Fact Container */}
            <div className="h-20 flex items-center justify-center px-6 text-center max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl lg:text-2xl font-serif text-[#e2e8f0] tracking-wide leading-relaxed"
              >
                {DEFENCE_FACTS[factIndex]}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
