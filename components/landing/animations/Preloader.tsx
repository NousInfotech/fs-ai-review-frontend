"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-white"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-20 h-20 md:w-24 md:h-24"
          >
            <Image
              src="/images/Logo.png"
              alt="Financial Review AI Logo"
              fill
              className="object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Text Reveal */}
        <div className="overflow-hidden mb-4">
          <motion.h2
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="text-2xl md:text-3xl font-medium text-(--landing-text-heading) tracking-tight"
          >
            Financial Review AI
          </motion.h2>
        </div>

        {/* Percentage Indicator */}
        <div className="flex flex-col items-center gap-2">
           <div className="w-48 h-[2px] bg-gray-100 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute left-0 top-0 h-full bg-(--landing-primary-blue)" 
                style={{ width: `${percent}%` }}
              />
           </div>
           <span className="text-[10px] font-bold tracking-widest text-(--landing-text-gray) uppercase">
            Initializing Compliance Engine {percent}%
           </span>
        </div>
      </div>

      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-(--landing-primary-blue)/5 rounded-full blur-[120px] -z-10" />
    </motion.div>
  );
}
