"use client"
import React from 'react'
import { motion } from "framer-motion";

const Shimmer = () => (
  <motion.div
    initial={{ x: "-100%" }}
    animate={{ x: "100%" }}
    transition={{
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    }}
    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent z-10"
  />
);

export default function HeroSkeleton() {
  return (
    <div className="relative w-full aspect-video bg-gray-200/50 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/20 backdrop-blur-sm">
      <Shimmer />
      {/* Decorative center icon or placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-slate-400/10 flex items-center justify-center animate-pulse">
          <div className="w-10 h-10 rounded-full bg-slate-400/20" />
        </div>
      </div>
    </div>
  )
}
