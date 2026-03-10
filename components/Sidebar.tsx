"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Home,
    FileText,
    UploadCloud,
    Settings
} from "lucide-react";
import { cn } from "../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Upload", href: "/upload", icon: UploadCloud },
    { name: "History", href: "/history", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={0}>
            <div className="w-20 lg:w-20 bg-white border-r border-[#e2e8f0] flex flex-col items-center py-6 z-50 h-full fixed left-0 top-0 shadow-sm">
                {/* Logo */}
                <div className="mb-8">
                    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl shadow-md shadow-blue-500/20">
                        <FileText className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Nav Items */}
                <div className="w-full flex-1 flex flex-col items-center gap-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        
                        return (
                            <Tooltip key={item.name}>
                                <TooltipTrigger asChild>
                                    <Link 
                                        href={item.href}
                                        className="relative w-full flex justify-center py-2 group focus:outline-none"
                                    >
                                        {/* Blue active indicator connected to right */}
                                        {isActive && (
                                            <div className="absolute left-0 top-1 bottom-1 w-[85%] bg-blue-600 rounded-r-xl shadow-sm" />
                                        )}
                                        
                                        <div className={cn(
                                            "relative z-10 w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200",
                                            isActive 
                                                ? "text-white" 
                                                : "text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50"
                                        )}>
                                            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" strokeWidth={isActive ? 2.5 : 2} />
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={10} className="bg-slate-800 text-white font-medium px-3 py-1.5 rounded-lg text-sm border-none shadow-xl shadow-slate-200/50">
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
