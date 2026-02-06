"use client";

import { PanelLeft, PanelLeftClose, ChevronRight, Calendar, User, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { generateDisplayId } from "@/lib/utils";

interface TopHeaderProps {
    onSidebarToggle: () => void;
    isSidebarCollapsed: boolean;
}

export default function TopHeader({ 
    onSidebarToggle, 
    isSidebarCollapsed,
}: TopHeaderProps) {
    const pathname = usePathname();
    const { signOut } = useAuth();
    
    // Check if we are in the results or processing page and extract ID
    const uploadIdMatch = pathname.match(/\/(?:results|processing)\/([^\/]+)/);
    const uploadId = uploadIdMatch ? uploadIdMatch[1] : null;

    // Fetch metadata if we have an uploadId
    const { data: metadata } = useQuery({
        queryKey: ['reviewMetadata', uploadId],
        queryFn: async () => {
            if (!uploadId) return null;
            try {
                const response = await api.get(`/api/v1/reviews/${uploadId}`);
                const item = response.data;
                const id = item.id || item._id || uploadId;
                return {
                    id: id,
                    displayId: item.displayId || generateDisplayId(id),
                };
            } catch (error) {
                console.error("Failed to fetch metadata for header", error);
                return { id: uploadId, displayId: generateDisplayId(uploadId) };
            }
        },
        enabled: !!uploadId,
        staleTime: 60000 // Cache for 1 minute
    });

    // Generate breadcrumbs from pathname
    const breadcrumbs = useMemo(() => {
        const paths = pathname.split('/').filter(Boolean);
        if (paths.length === 0) return [{ label: 'Dashboard', href: '/dashboard' }];
        
        return paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join('/')}`;
            let label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
            
            // Replace ID with Display ID if metadata is available
            if (uploadId && path === uploadId) {
                label = metadata?.displayId || generateDisplayId(path);
            }

            return { label, href };
        });
    }, [pathname, uploadId, metadata]);

    // Current date
    const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });

    return (
        <header 
            className="h-16 flex items-center justify-between px-6 sticky top-4 z-40 mx-4 my-4 border border-white/10 rounded-2xl shadow-xl"
            style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}
        >
            {/* Left Section: Toggle & Breadcrumbs */}
            <div className="flex items-center gap-4">
                <button
                    className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition-colors group text-white/70 hover:text-white"
                    onClick={onSidebarToggle}
                    aria-label="Toggle Sidebar"
                >
                    {isSidebarCollapsed ? (
                        <PanelLeft className="h-5 w-5" />
                    ) : (
                        <PanelLeftClose className="h-5 w-5" />
                    )}
                </button>

                {/* Divider */}
                <div className="h-4 w-px bg-white/10 hidden sm:block"></div>

                {/* Breadcrumbs */}
                <nav className="hidden sm:flex items-center text-sm">
                    <span className="text-white/40 font-medium">Financial Review</span>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.href} className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-white/20 mx-1" />
                            <span className={`font-medium ${index === breadcrumbs.length - 1 ? 'text-white' : 'text-white/40'}`}>
                                {crumb.label}
                            </span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right Section: Date & Status & Logout */}
            <div className="flex items-center gap-6">
                {/* Date Display */}
                <div className="hidden md:flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="h-4 w-4 text-white/40" />
                    <span>{currentDate}</span>
                </div>

                {/* User Status (Minimal) */}
                <div className="flex items-center gap-2 pl-6 border-l border-white/10">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                        <User className="h-4 w-4 text-white/80" />
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={signOut}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                    aria-label="Log out"
                    title="Sign out"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
