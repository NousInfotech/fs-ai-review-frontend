"use client";

import { Bell, LogOut, Settings as SettingsIcon, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopHeader() {
    const { user, signOut } = useAuth();
    
    return (
        <header className="h-20 flex items-center justify-between px-10 bg-white border-b border-slate-100 sticky top-0 z-40 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    AI Financial Statement <span className="text-blue-600 font-semibold under">Review</span>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="h-6 w-px bg-slate-200"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-bold text-slate-700 leading-none mb-1 group-hover:text-blue-600 transition-colors">
                                {user?.displayName || "Admin User"}
                            </span>
                            <span className="text-xs font-medium text-slate-500 leading-none">
                                {user?.email || "admin@example.com"}
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold text-sm border-2 border-white ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                            {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end" className="w-60 p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-slate-100 mt-2">
                        <DropdownMenuLabel className="p-3">
                            <div className="flex flex-col space-y-1.5">
                                <p className="text-sm font-semibold text-slate-800 leading-none">{user?.displayName || "Admin User"}</p>
                                <p className="text-xs font-medium text-slate-500 leading-none">{user?.email || "admin@example.com"}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                        <DropdownMenuItem asChild className="p-3 text-slate-600 focus:bg-blue-50 focus:text-blue-700 cursor-pointer rounded-xl transition-colors font-medium">
                            <Link href="/profile" className="flex items-center gap-3">
                                <User className="w-4 h-4" />
                                <span>My Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="p-3 text-slate-600 focus:bg-blue-50 focus:text-blue-700 cursor-pointer rounded-xl transition-colors font-medium">
                            <Link href="/settings" className="flex items-center gap-3">
                                <SettingsIcon className="w-4 h-4" />
                                <span>Account Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                        <DropdownMenuItem 
                            onClick={signOut}
                            className="p-3 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer rounded-xl transition-colors font-medium flex items-center gap-3"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
