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
    <div className="relative py-10 md:pt-30 flex flex-col lg:flex-row items-center px-5 md:px-10 overflow-hidden gap-5 min-h-[85vh] bg-gray-50/50">
      {/* Skeleton Content */}
      <div className="mx-auto w-full relative z-10 space-y-7">
        {/* Badge Skeleton */}
        <div className="relative w-64 h-6 bg-gray-200 rounded-full overflow-hidden">
          <Shimmer />
        </div>
        
        {/* Title Skeleton */}
        <div className="space-y-3">
          <div className="relative w-full max-w-3xl h-12 md:h-16 bg-gray-200 rounded-2xl overflow-hidden">
            <Shimmer />
          </div>
          <div className="relative w-2/3 h-12 md:h-16 bg-gray-200 rounded-2xl overflow-hidden">
            <Shimmer />
          </div>
        </div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 max-w-xl">
          <div className="relative w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
            <Shimmer />
          </div>
          <div className="relative w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
            <Shimmer />
          </div>
          <div className="relative w-3/4 h-4 bg-gray-200 rounded-lg overflow-hidden">
            <Shimmer />
          </div>
        </div>
        
        {/* Buttons Skeleton */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-48 h-12 bg-gray-200 rounded-xl overflow-hidden">
            <Shimmer />
          </div>
          <div className="relative w-full md:w-48 h-12 bg-gray-200 rounded-xl overflow-hidden">
            <Shimmer />
          </div>
        </div>

        {/* Status Items Skeleton */}
        <div className="flex items-center gap-6 pt-4">
          <div className="relative w-32 h-4 bg-gray-200 rounded-lg overflow-hidden">
            <Shimmer />
          </div>
          <div className="relative w-32 h-4 bg-gray-200 rounded-lg overflow-hidden">
            <Shimmer />
          </div>
        </div>
      </div>
      
      {/* Video Skeleton */}
      <div className="z-10 w-full lg:w-1/2 mt-10 lg:mt-0">
        <div className="relative w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
          <Shimmer />
        </div>
      </div>
    </div>
  )
}
