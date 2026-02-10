"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    ChevronDown, 
    ChevronUp, 
    X, 
    FileText,
    LayoutDashboard,
    Archive,
    Upload,
    Settings
} from "lucide-react";
import { cn } from "../lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

import { useAuth } from "@/contexts/AuthContext";

interface MenuItem {
    slug: string;
    label: string;
    icon: any;
    href?: string;
    description?: string;
    section?: "primary" | "settings";
    children?: MenuItem[];
    isActive?: boolean;
}

interface SidebarProps {
    isCollapsed?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    onExpand?: () => void;
}

export default function Sidebar({ 
    isCollapsed = false, 
    isOpen = false, 
    onClose,
    onExpand
}: SidebarProps) {
    const pathname = usePathname();
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const { user, signOut } = useAuth();

    const branding = {
        sidebar_background_color: "15, 23, 41",
        sidebar_footer_color: "222 47% 16%",
        sidebar_text_color: "220 14% 96%"
    };

    const orgName = "Financial Review";
    const orgSubname = "AI POWERED";

    const menu: MenuItem[] = [
        {
            slug: "upload",
            label: "Upload Statement",
            icon: Upload,
            href: "/upload",
            description: "Process new documents",
            section: "primary"
        },
        {
            slug: "history",
            label: "History",
            icon: Archive,
            href: "/history",
            description: "Past reviews",
            section: "primary"
        },
        // {
        //     slug: "dashboard",
        //     label: "Analytics",
        //     icon: LayoutDashboard,
        //     href: "/dashboard",
        //     description: "Overview and insights",
        //     section: "primary"
        // },
        // {
        //     slug: "settings",
        //     label: "Settings",
        //     icon: Settings,
        //     href: "/settings",
        //     description: "Account and app settings",
        //     section: "settings"
        // }
    ];

    const toggleItem = (slug: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [slug]: !prev[slug],
        }));
    };

    const handleMenuClick = (e: React.MouseEvent, item: MenuItem, hasChildren: boolean) => {
        if (isCollapsed && hasChildren) {
            if (onExpand) onExpand();
            if (!openItems[item.slug]) {
                toggleItem(item.slug);
            }
            if (!item.href || item.href === "#") {
                e.preventDefault();
            }
            return;
        }

        if (hasChildren && !isCollapsed) {
            toggleItem(item.slug);
            if (!item.href || item.href === "#") {
                e.preventDefault();
            }
        } else if (item.href && item.href !== "#") {
            if (onClose) onClose();
        }
    };

    const sections = [
        { id: "primary", label: "Menu" },
        { id: "settings", label: "Settings" },
    ];

    const grouped = {
        primary: menu.filter(item => (item.section || "primary") === "primary"),
        settings: menu.filter(item => item.section === "settings"),
    };

    const renderMenuItem = (item: MenuItem, level = 1) => {
        const hasChildren = !!(item.children && item.children.length > 0);
        const isItemOpen = openItems[item.slug];
        
        const checkActive = (it: MenuItem): boolean => {
            if (!it.href || it.href === "#") {
                return !!(it.children && it.children.some(checkActive));
            }
            if (it.href === "/dashboard") {
                return pathname === "/dashboard";
            }
            const isExact = pathname === it.href;
            const isSubPath = it.href !== "/dashboard" && pathname.startsWith(it.href + "/");
            if (isExact || isSubPath) return true;
            if (it.children) return it.children.some(checkActive);
            return false;
        };
        const isActive = checkActive(item);

        if (level === 1) {
            const linkContent = (
                <Link
                    key={item.slug}
                    href={item.href || "#"}
                    onClick={(e: any) => handleMenuClick(e, item, hasChildren)}
                    className={cn(
                        'group relative flex items-center transition-all duration-300 ease-out',
                        isCollapsed 
                            ? 'justify-center px-2 py-3 rounded-2xl' 
                            : 'gap-4 px-4 py-3 rounded-2xl',
                        'hover:scale-[1.02] hover:shadow-lg border'
                    )}
                    style={{
                        backgroundColor: isActive ? `hsl(var(--sidebar-active))` : 'transparent',
                        color: isActive ? `hsl(var(--sidebar-foreground))` : `hsl(var(--sidebar-foreground) / 0.8)`,
                        borderColor: isActive ? `hsl(var(--sidebar-border))` : 'transparent'
                    }}
                >
                    {isActive && !isCollapsed && (
                        <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                            style={{ backgroundColor: `hsl(var(--sidebar-primary))` }}
                        ></div>
                    )}
                    
                    <div 
                        className={cn(
                            'relative flex items-center justify-center transition-all duration-300',
                            isCollapsed ? 'w-8 h-8' : 'w-10 h-10',
                            'rounded-xl'
                        )}
                        style={{
                            backgroundColor: isActive ? `hsl(var(--sidebar-primary))` : `hsl(var(--sidebar-active) / 0.5)`,
                            color: isActive ? `hsl(var(--sidebar-primary-foreground))` : `hsl(var(--sidebar-foreground))`
                        }}
                    >
                        <item.icon className={cn(isCollapsed ? "h-4 w-4" : "h-5 w-5")} />
                    </div>

                    {!isCollapsed && (
                        <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between w-full gap-2">
                                <span className="font-semibold text-sm truncate">{item.label}</span>
                                {hasChildren && (
                                    isItemOpen ? <ChevronUp className="h-4 w-4 opacity-50" /> : <ChevronDown className="h-4 w-4 opacity-50" />
                                )}
                            </div>
                            {item.description && (
                                <p className="text-[11px] leading-tight opacity-50 truncate mt-0.5 font-medium">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    )}

                    <div className={cn(
                        'absolute inset-0 transition-opacity duration-300 rounded-2xl pointer-events-none',
                        isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-10'
                    )}
                    style={{ backgroundColor: `hsl(var(--sidebar-foreground))` }}
                    ></div>
                </Link>
            );

            return (
                <li key={item.slug} className="space-y-1">
                    {isCollapsed ? (
                        <Tooltip>
                            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                            <TooltipContent side="right" className="bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-lg p-3 max-w-xs">
                                <div className="space-y-1">
                                    <p className="font-bold text-sm leading-none">{item.label}</p>
                                    {item.description && <p className="text-[11px] opacity-70 leading-relaxed">{item.description}</p>}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        linkContent
                    )}

                    {hasChildren && isItemOpen && !isCollapsed && (
                        <ul className="ml-5 space-y-1 mt-1 border-l border-white/10 pl-4 py-1">
                            {item.children?.map((child) => renderMenuItem(child, level + 1))}
                        </ul>
                    )}
                </li>
            );
        }

        return null;
    };

    return (
        <TooltipProvider delayDuration={300}>
            <div
                className={cn(
                    "flex flex-col transform transition-all duration-300 ease-in-out z-50",
                    "fixed inset-y-0 left-0 w-64 h-full md:h-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    isCollapsed 
                    ? "md:fixed md:top-4 md:bottom-4 md:left-4 md:w-20 md:h-[calc(100vh-2rem)]" 
                    : "md:fixed md:top-4 md:bottom-4 md:left-4 md:w-80 md:h-[calc(100vh-2rem)]",
                    "border shadow-xl",
                    "rounded-r-4xl md:rounded-4xl",
                    "bg-sidebar-background"
                )}
                style={{
                    backgroundColor: `hsl(var(--sidebar-background))`,
                    color: `hsl(var(--sidebar-foreground))`,
                    borderColor: `rgba(255,255,255,0.1)`
                }}
            >
                <div 
                    className={cn(
                        "border-b relative",
                        isCollapsed ? "p-4" : "p-6"
                    )}
                    style={{ borderColor: `rgba(255,255,255,0.1)` }}
                >
                    <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-4")}>
                        <div className="relative">
                            <div 
                                className={cn(
                                    "rounded-2xl flex items-center justify-center shadow-lg p-1 bg-white/10",
                                    isCollapsed ? "w-13 h-13" : "w-14 h-14"
                                )}
                            >
                                <div className="w-full h-full bg-primary/20 rounded-lg flex items-center justify-center border border-white/20">
                                    <FileText className="text-white w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex-1 transition-all duration-300 ease-in-out text-left">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-bold tracking-tight text-white">{orgName}</h1>
                                    <p className="text-[10px] font-medium uppercase tracking-wider opacity-70 text-white/90">{orgSubname}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className="md:hidden absolute top-6 right-6 p-2 rounded-lg transition-colors hover:bg-white/10"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
            
                <nav className="flex-1 overflow-y-auto scrollbar-hide p-4">
                    <ul className="space-y-6">
                        {sections.map((section) => {
                            const items = grouped[section.id as keyof typeof grouped];
                            if (!items?.length) return null;
                            return (
                                <li key={section.id} className="space-y-2">
                                    {!isCollapsed && (
                                        <p className="px-4 py-1 text-[10px] font-semibold tracking-widest uppercase text-white/40 text-left">
                                            {section.label}
                                        </p>
                                    )}
                                    <ul className="space-y-2">
                                        {items.map((item) => renderMenuItem(item))}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div 
                    className={cn(
                        "border-t",
                        isCollapsed ? "p-2" : "p-4"
                    )}
                    style={{ borderColor: `rgba(255,255,255,0.1)` }}
                >
                    <div 
                        className={cn(
                            "rounded-2xl p-4 bg-white/5 border border-white/10"
                        )}
                    >
                        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                            <div className="relative">
                                <div 
                                    className={cn("rounded-2xl flex items-center justify-center bg-gray-600", isCollapsed ? "w-8 h-8" : "w-10 h-10")}
                                >
                                    <span className={cn("font-bold text-white", isCollapsed ? "text-xs" : "text-sm")}>
                                        {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a]"></div>
                            </div>

                            {!isCollapsed && (
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-semibold truncate text-white">{user?.displayName || "User"}</p>
                                    <p className="text-[11px] truncate opacity-70 text-white/70">{user?.email}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider> 
    );
}
