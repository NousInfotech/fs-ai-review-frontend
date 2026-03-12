"use client";

import { useState } from "react";
import { cn } from "../lib/utils";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import { motion } from "framer-motion";

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PortalLayout({ children, title, description }: PortalLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#f3f5f9]">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-out",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <TopHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1280px] mx-auto w-full">
            {/* If there is a title passed strictly, maybe show it, but new dash relies on custom rendering */}
            {(title || description) && (
              <div className="mb-6">
                {title && <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>}
                {description && <p className="mt-1 text-slate-500">{description}</p>}
              </div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
