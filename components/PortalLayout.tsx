"use client";

import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Search, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PortalLayout({ children, title, description }: PortalLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[var(--color-content-bg)]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[var(--color-content-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 rounded-lg hover:bg-black/5 text-gray-500 lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            {/* Breadcrumb or simple title if needed */}
            <div className="hidden md:flex items-center text-sm text-gray-500">
              <span className="font-medium text-gray-900">Portal</span>
              <span className="mx-2">/</span>
              <span>{title || "Dashboard"}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all w-64 shadow-sm">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search engagements..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-gray-700"
              />
            </div>

            <button className="relative p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-500 hover:text-indigo-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--color-content-bg)]"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-300 mx-1"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-none">{user?.displayName || "User"}</p>
                <p className="text-xs text-gray-500 mt-1">Auditor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {(title || description) && (
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">{title}</h1>
                {description && <p className="mt-1 text-[var(--color-text-secondary)]">{description}</p>}
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
