"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Home,
    FileText,
    AlertTriangle,
    BarChart2,
    Settings,
    UploadCloud,
    Loader,
    CheckSquare,
    LogOut,
    User,
    ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Upload", href: "/upload", icon: UploadCloud },
    { name: "Processing", href: "/processing", icon: Loader },
    { name: "Results", href: "/results", icon: CheckSquare },
    { name: "Financial Statements", href: "/history", icon: FileText },
    { name: "Issues", href: "/issues", icon: AlertTriangle },
    { name: "Reports", href: "/reports", icon: BarChart2 },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    return (
        <TooltipProvider delayDuration={0}>
            <motion.div
                initial={false}
                animate={{ 
                    width: isOpen ? 280 : 88,
                    transition: { type: "spring", stiffness: 300, damping: 30 }
                }}
                className={cn(
                    "bg-white/40 backdrop-blur-2xl border-r border-white/20 flex flex-col pt-8 pb-6 z-50 h-full fixed left-0 top-0 overflow-hidden shadow-[20px_0_40px_rgba(0,0,0,0.02)]"
                )}
            >
                {/* Background decorative element */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200 blur-[100px] rounded-full" />
                </div>

                {/* Logo Section */}
                <div className="px-5 mb-10 overflow-hidden shrink-0">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="logo-open"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden p-1.5">
                                    <Image
                                        src="/images/Logo.png"
                                        alt="VACEI"
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-contain brightness-0 invert"
                                    />
                                </div>
                                <span className="text-xl font-black text-slate-900 tracking-tighter">VACEI <span className="text-blue-600">AI</span></span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logo-closed"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex justify-center"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 overflow-hidden p-2">
                                    <Image
                                        src="/images/Logo.png"
                                        alt="VACEI"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-contain brightness-0 invert"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        const NavLink = (
                            <Link
                                href={item.href}
                                className={cn(
                                    "relative flex items-center group px-4 py-3.5 rounded-2xl transition-all duration-300",
                                    isActive 
                                        ? "bg-white shadow-[0_10px_20px_rgba(0,0,0,0.04)] text-slate-900" 
                                        : "text-slate-500 hover:bg-white/50 hover:text-slate-900"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                
                                <div className={cn(
                                    "flex items-center justify-center transition-all duration-300",
                                    isOpen ? "mr-4" : "mx-auto"
                                )}>
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-blue-600" : "group-hover:text-blue-600"
                                    )} strokeWidth={isActive ? 2.5 : 2} />
                                </div>

                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm font-bold whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}

                                {isOpen && isActive && (
                                    <ChevronRight className="ml-auto w-4 h-4 text-slate-400" />
                                )}
                            </Link>
                        );

                        if (!isOpen) {
                            return (
                                <Tooltip key={item.name}>
                                    <TooltipTrigger asChild>
                                        {NavLink}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" sideOffset={20} className="bg-slate-900 text-white border-none rounded-xl px-4 py-2 font-bold text-xs shadow-2xl">
                                        {item.name}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return <div key={item.name}>{NavLink}</div>;
                    })}
                </nav>

                {/* User Profile Section */}
                <div className="px-4 mt-auto">
                    <div className={cn(
                        "rounded-[2rem] p-2 transition-all duration-500",
                        isOpen ? "bg-slate-900/5 backdrop-blur-sm" : ""
                    )}>
                        <button className={cn(
                            "w-full flex items-center rounded-[1.5rem] transition-all duration-300",
                            isOpen ? "px-4 py-3 hover:bg-white/80" : "flex-col gap-4 py-4"
                        )}>
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                            </div>

                            {isOpen && (
                                <div className="ml-3 text-left overflow-hidden">
                                    <p className="text-xs font-black text-slate-900 truncate uppercase tracking-wider">{user?.displayName || "User"}</p>
                                    <p className="text-[10px] font-bold text-slate-500 truncate">{user?.email || "user@example.com"}</p>
                                </div>
                            )}
                        </button>
                        
                        {isOpen && (
                            <button 
                                onClick={() => signOut()}
                                className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-[1.5rem] text-red-500 hover:bg-red-50 transition-all font-black text-[10px] tracking-widest uppercase"
                            >
                                <LogOut className="w-4 h-4" />
                                LOGOUT ACCOUNT
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}

