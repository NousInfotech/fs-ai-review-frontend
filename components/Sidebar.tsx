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
} from "lucide-react";
import { cn } from "../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className={cn(
                    "bg-white/70 backdrop-blur-xl border-r border-slate-200/50 flex flex-col py-6 z-50 h-full fixed left-0 top-0 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-out",
                    isOpen ? "w-64 items-stretch" : "w-20 items-center"
                )}
            >
                {/* Logo Element */}
                <div
                    className={cn(
                        "mb-6 px-2 w-full flex shrink-0",
                        isOpen ? "justify-start pl-4 pr-3" : "justify-center"
                    )}
                >
                    {isOpen ? (
                        <div className="flex items-center">
                            <Image
                                src="/images/test-images/Logo.png"
                                alt="VACEl logo"
                                width={200}
                                height={62}
                                className="h-10 w-auto object-contain"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center">
                            <Image
                                src="/images/Logo.png"
                                alt="VACEl mark"
                                width={40}
                                height={40}
                                className="h-10 w-10 object-contain"
                                priority
                            />
                        </div>
                    )}
                </div>

                {/* Subtile separator */}
                <div className="w-10 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6 shrink-0"></div>

                {/* Scrollable Nav Items */}
                <div
                    className={cn(
                        "w-full flex-1 flex flex-col gap-2 overflow-y-auto pb-6 relative [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']",
                        isOpen ? "items-stretch px-2" : "items-center"
                    )}
                >
                    {menuItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        if (isOpen) {
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative w-full flex items-center gap-3 group focus:outline-none shrink-0 px-3 py-2 rounded-2xl"
                                >
                                    {/* Active Highlight Indicator */}
                                    <div
                                        className={cn(
                                            "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-300 ease-out",
                                            isActive ? "h-8 opacity-100" : "h-0 opacity-0"
                                        )}
                                    />

                                    {/* Icon */}
                                    <div
                                        className={cn(
                                            "relative z-10 w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 ease-out",
                                            isActive
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-100"
                                                : "text-slate-400 bg-transparent group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:scale-110"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "w-[22px] h-[22px] transition-transform duration-300",
                                                isActive ? "animate-in zoom-in spin-in-2" : ""
                                            )}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={cn(
                                            "relative z-10 text-sm font-semibold truncate transition-colors",
                                            isActive ? "text-slate-900" : "text-slate-500 group-hover:text-blue-700"
                                        )}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        }

                        // Collapsed: icon-only rail with tooltips
                        return (
                            <Tooltip key={item.name}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className="relative w-full flex justify-center items-center group focus:outline-none shrink-0"
                                    >
                                        {/* Active Highlight Indicator */}
                                        <div
                                            className={cn(
                                                "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-300 ease-out",
                                                isActive ? "h-8 opacity-100" : "h-0 opacity-0"
                                            )}
                                        />

                                        {/* Icon */}
                                        <div
                                            className={cn(
                                                "relative z-10 w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 ease-out",
                                                isActive
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-100"
                                                    : "text-slate-400 bg-transparent hover:text-blue-600 hover:bg-blue-50 hover:scale-110"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "w-[22px] h-[22px] transition-transform duration-300",
                                                    isActive ? "animate-in zoom-in spin-in-2" : ""
                                                )}
                                                strokeWidth={isActive ? 2.5 : 2}
                                            />
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    sideOffset={15}
                                    className="bg-slate-800/95 backdrop-blur-md text-white font-semibold px-4 py-2 rounded-xl text-sm border-none shadow-2xl shadow-slate-300/50 z-[100] animate-in slide-in-from-left-2"
                                >
                                    {item.name}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
}
