"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  Settings, 
  LogOut, 
  User as UserIcon,
  PieChart
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: "Main Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "History", href: "/history", icon: FileText },
    { name: "Upload Financial Statement", href: "/upload", icon: UploadCloud },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col shrink-0 sidebar-gradient text-[var(--color-sidebar-text)] transition-all duration-300">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center border border-[var(--color-accent)]/30">
          <FileText className="h-6 w-6 text-[var(--color-accent)]" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">Financial Review</h1>
          <p className="text-xs text-[var(--color-sidebar-text-muted)]">AI POWERED</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        <div className="mb-2 px-4 text-xs font-semibold text-[var(--color-sidebar-text-muted)] uppercase tracking-wider">
          Menu
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-slate-800 text-white shadow-lg shadow-black/20"
                  : "text-[var(--color-sidebar-text-muted)] hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={clsx(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-white" : "text-gray-400 group-hover:text-white"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10 mx-4 mb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group relative">
          <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center border border-[var(--color-accent)]/30 text-[var(--color-accent)]">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="font-semibold text-sm">
                {user?.email?.[0].toUpperCase() || "U"}
              </span>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          
          <button 
            onClick={() => signOut()}
            className="p-1.5 rounded-lg hover:bg-white/20 text-gray-400 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
