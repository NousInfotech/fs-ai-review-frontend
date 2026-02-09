"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Activity, 
  LogOut,
  Settings
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Platform Users', href: '/admin/platform-users', icon: Users },
  { name: 'Test Cases', href: '/admin/test-cases', icon: FileText },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: Activity },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { platformUser } = useAdminAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col w-64 bg-[#0f1729] text-slate-200 min-h-screen border-r border-slate-800/50">
      <div className="flex items-center justify-center h-16 border-b border-slate-800/50">
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold tracking-wider text-white">Financial Review</h1>
          <span className="text-[10px] text-indigo-400 tracking-[0.2em] font-medium">ADMIN PORTAL</span>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 p-4 overflow-y-auto">
        <div className="mb-8">
          <div className="px-4 py-3 bg-slate-800/50 rounded-lg mb-6 border border-slate-700/50 backdrop-blur-sm">
            <p className="text-xs text-slate-400 uppercase font-semibold">Logged in as</p>
            <p className="font-medium truncate text-white">{platformUser?.name}</p>
            <p className="text-xs text-indigo-400 mt-1">{platformUser?.role?.replace('_', ' ')}</p>
          </div>
          
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:translate-x-1'}
                  `}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/50 bg-[#0f1729]">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors group"
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
