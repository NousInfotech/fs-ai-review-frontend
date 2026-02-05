"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PortalLayout({ children, title, description }: PortalLayoutProps) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved === "true";
    }
    return false;
  });

  const handleSidebarToggle = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  const handleExpand = () => {
    setIsSidebarCollapsed(false);
    localStorage.setItem("sidebar-collapsed", "false");
  };

  return (
    <div className="flex h-screen bg-[#f5f7ff] relative overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block h-full">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          isOpen={true}
          onExpand={handleExpand}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-50 transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar 
          isCollapsed={false} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0 pr-2",
          isSidebarCollapsed ? "lg:ml-28" : "lg:ml-88"
        )}
      >
        {/* Header */}
        <TopHeader
          onSidebarToggle={handleSidebarToggle}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {(title || description) && (
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-primary tracking-tight">{title}</h1>
                {description && <p className="mt-1 text-gray-500">{description}</p>}
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
