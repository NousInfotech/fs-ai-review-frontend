"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePerformance } from "../../contexts/ReduceMotionContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

const PageHeader = ({ title, breadcrumbs }: PageHeaderProps) => {
  const { isIPhone, isLowPerformance } = usePerformance();

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#020410] border border-white/5 shadow-2xl my-6">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center justify-center py-20 md:py-32 lg:py-40 px-6 text-center">
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-12 tracking-tight max-w-4xl"
        >
          {title}
        </motion.h1>

        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            "flex items-center gap-4 rounded-full px-8 py-3.5 border border-white/20 relative z-10",
            isIPhone || isLowPerformance ? "bg-white/20" : "bg-white/10 backdrop-blur-xl shadow-2xl"
          )}
        >
          <Link
            href="/"
            className="text-white/70 hover:text-white transition-all flex items-center gap-2 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-sm font-bold">Home</span>
          </Link>

          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <span className="text-white/20 text-[10px] select-none">●</span>

              <div className="relative flex items-center">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white transition-all text-sm font-bold"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white text-sm font-bold truncate max-w-[200px] md:max-w-md">
                    {item.label}
                  </span>
                )}
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PageHeader;

