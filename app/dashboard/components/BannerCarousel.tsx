"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    image: "/images/banner_1.png",
    title: "AI-Powered Auditing",
    description: "Experience the future of financial review with our advanced AI engine."
  },
  {
    id: 2,
    image: "/images/banner_2.png",
    title: "Actionable Insights",
    description: "Turn complex data into clear, actionable steps for your organization."
  },
  {
    id: 3,
    image: "/images/banner_3.png",
    title: "Secure & Compliant",
    description: "Your data is protected by industry-leading security and compliance standards."
  }
];

export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={banners[currentIndex].image}
            alt={banners[currentIndex].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
          
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl text-white">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-4 tracking-tight"
            >
              {banners[currentIndex].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-slate-200 leading-relaxed"
            >
              {banners[currentIndex].description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${currentIndex === i ? "w-8 bg-blue-500" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
