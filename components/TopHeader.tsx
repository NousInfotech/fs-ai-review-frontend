"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, Settings as SettingsIcon, User, Search, FileText, AlertTriangle, ArrowRight, Loader, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface TopHeaderProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
}

export default function TopHeader({ isSidebarOpen, onToggleSidebar }: TopHeaderProps) {
    const { user, signOut } = useAuth();
    const router = useRouter();

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch Real Documents for Search
    const { data: documents } = useQuery({
        queryKey: ['headerSearchReviews'],
        queryFn: async () => {
            try {
                const response = await api.get('/api/v1/reviews/');
                return (response.data as any[]).map(item => {
                    const id = item.id || item._id;
                    const companyName = item.companyName || item.company_name || item.metadata?.companyName || "Unknown Company";
                    return {
                        id: id,
                        title: companyName,
                        type: item.status?.toLowerCase() === "processing" ? "Processing" : "Statement",
                        url: `/results/${id}`,
                        icon: item.status?.toLowerCase() === "processing" ? <Loader className="w-4 h-4 text-blue-400 animate-spin" /> : <FileText className="w-4 h-4 text-blue-500" />,
                        raw: item
                    };
                });
            } catch (error) {
                console.error("Search fetch failed", error);
                return [];
            }
        },
        staleTime: 60000
    });

    const searchResults = searchQuery.trim() === ""
        ? []
        : (documents || []).filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.raw.documentDate && String(item.raw.documentDate).includes(searchQuery))
        ).slice(0, 8);

    const handleSearchSelect = (url: string) => {
        setSearchQuery("");
        setIsSearchOpen(false);
        router.push(url);
    };

    return (
        <header className="h-[80px] flex items-center justify-between px-8 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-40 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">

            {/* Left Title & Search */}
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

                {/* Sleek Search Bar */}
                <div className="hidden md:flex relative group z-50" ref={searchRef}>
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search statements or issues..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearchOpen(true);
                        }}
                        onFocus={() => setIsSearchOpen(true)}
                        className="w-64 lg:w-80 bg-slate-50/80 border border-slate-200/60 text-slate-700 text-sm rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                    />

                    {/* Search Dropdown Modal */}
                    {isSearchOpen && searchQuery.trim().length > 0 && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            {searchResults.length > 0 ? (
                                <div className="flex flex-col">
                                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Top Results
                                    </div>
                                    {searchResults.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleSearchSelect(result.url)}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors group/result"
                                        >
                                            <div className="p-2 bg-slate-100/50 rounded-lg group-hover/result:bg-white group-hover/result:shadow-sm transition-all shrink-0">
                                                {result.icon}
                                            </div>
                                            <div className="flex-1 truncate">
                                                <p className="text-sm font-semibold text-slate-700 truncate">{result.title}</p>
                                                <p className="text-xs text-slate-400 capitalize">{result.type}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover/result:text-blue-500 opacity-0 group-hover/result:opacity-100 transition-all -translate-x-2 group-hover/result:translate-x-0" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-8 text-center flex flex-col items-center">
                                    <Search className="w-8 h-8 text-slate-200 mb-2" />
                                    <p className="text-sm font-medium text-slate-600">No results found</p>
                                    <p className="text-xs text-slate-400 mt-1">Try another search term.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 lg:gap-6">

                {/* Notification Bell */}
                <button className="relative p-2.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-full transition-all shadow-sm hover:shadow-md">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white pointer-events-none"></span>
                </button>

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
