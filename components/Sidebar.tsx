"use client";

import Link from "next/link";
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
    Zap
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

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            <div className="w-20 lg:w-20 bg-white/70 backdrop-blur-xl border-r border-slate-200/50 flex flex-col items-center py-6 z-50 h-full fixed left-0 top-0 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all">
                
                {/* Logo Element */}
                <div className="mb-6 px-2 w-full flex justify-center shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center rounded-2xl shadow-lg shadow-blue-500/30 transform transition-transform hover:scale-105 hover:rotate-3">
                        <Zap className="w-6 h-6 fill-white drop-shadow-md" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Subtile separator */}
                <div className="w-10 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6 shrink-0"></div>

                {/* Scrollable Nav Items */}
                <div className="w-full flex-1 flex flex-col items-center gap-3 overflow-y-auto pb-6 relative
                                [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        
                        return (
                            <Tooltip key={item.name}>
                                <TooltipTrigger asChild>
                                    <Link 
                                        href={item.href}
                                        className="relative w-full flex justify-center items-center group focus:outline-none shrink-0"
                                    >
                                        {/* Active Highlight Indicator (Smooth scale in) */}
                                        <div className={cn(
                                            "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-300 ease-out",
                                            isActive ? "h-8 opacity-100" : "h-0 opacity-0"
                                        )} />
                                        
                                        {/* Icon Container with subtle background and pop */}
                                        <div className={cn(
                                            "relative z-10 w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 ease-out",
                                            isActive 
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-100" 
                                                : "text-slate-400 bg-transparent hover:text-blue-600 hover:bg-blue-50 hover:scale-110"
                                        )}>
                                            <item.icon className={cn(
                                              "w-[22px] h-[22px] transition-transform duration-300",
                                              isActive ? "animate-in zoom-in spin-in-2" : ""
                                            )} strokeWidth={isActive ? 2.5 : 2} />
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
                        )
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
}
