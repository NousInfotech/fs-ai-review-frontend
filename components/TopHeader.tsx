"use client";

import { LogOut, Settings as SettingsIcon, User, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

interface TopHeaderProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    user?: any;
    signOut?: () => void;
}

export default function TopHeader({ 
    isSidebarOpen, 
    onToggleSidebar, 
    user: propUser, 
    signOut: propSignOut 
}: TopHeaderProps) {
    const { user: authUser, signOut: authSignOut } = useAuth();
    
    const user = propUser || authUser;
    const signOut = propSignOut || authSignOut;

    return (
        <header className="h-[80px] flex items-center justify-between pl-6 pr-5 sm:pl-8 sm:pr-6 lg:pl-10 lg:pr-8 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-40 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">

            {/* Left Title */}
            <div className="flex items-center gap-3 lg:gap-6">
                <button
                    type="button"
                    onClick={onToggleSidebar}
                    className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200/70 shadow-sm hover:shadow-md transition-all"
                    aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {isSidebarOpen ? (
                        <PanelLeftClose className="w-4 h-4" />
                    ) : (
                        <PanelLeftOpen className="w-4 h-4" />
                    )}
                </button>

                <h1 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-1">
                    <span>Financial&nbsp;Review</span>
                    <span className="text-blue-600">AI</span>
                </h1>

            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 lg:gap-6">

                {/* Notification Bell */}
                {/* <button className="relative p-2.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-full transition-all shadow-sm hover:shadow-md">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white pointer-events-none"></span>
                </button> */}

                <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

                {/* Dropdown Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-full p-1.5 pr-4 shadow-sm">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-inner font-bold text-sm ring-2 ring-white group-hover:ring-blue-100 transition-all">
                            {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div className="flex flex-col items-start hidden sm:flex text-left">
                            <span className="text-[13px] font-bold text-slate-800 leading-none mb-1 group-hover:text-blue-600 transition-colors">
                                {user?.displayName || "User"}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400 leading-none">
                                {user?.email || "admin@example.com"}
                            </span>
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-64 p-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 mt-2 z-50">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="p-3">
                                <div className="flex flex-col space-y-1.5">
                                    <p className="text-sm font-bold text-slate-800 leading-none">{user?.displayName || "Admin User"}</p>
                                    <p className="text-xs font-semibold text-slate-500 leading-none truncate">{user?.email || "admin@example.com"}</p>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                        <DropdownMenuItem className="p-0 border-none outline-none group/item">
                            <Link href="/profile" className="flex items-center gap-3 w-full p-3 text-slate-600 group-hover/item:bg-blue-50/80 group-focus/item:bg-blue-50/80 group-hover/item:text-blue-700 cursor-pointer rounded-xl transition-all font-semibold">
                                <User className="w-[18px] h-[18px]" />
                                <span>My Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0 border-none outline-none group/item">
                            <Link href="/settings" className="flex items-center gap-3 w-full p-3 text-slate-600 group-hover/item:bg-blue-50/80 group-focus/item:bg-blue-50/80 group-hover/item:text-blue-700 cursor-pointer rounded-xl transition-all font-semibold">
                                <SettingsIcon className="w-[18px] h-[18px]" />
                                <span>Account Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100 mx-2" />
                        <DropdownMenuItem
                            onClick={signOut}
                            className="p-3 text-red-600 focus:bg-red-50 focus:text-red-700 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-xl transition-all font-semibold flex items-center gap-3"
                        >
                            <LogOut className="w-[18px] h-[18px]" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
