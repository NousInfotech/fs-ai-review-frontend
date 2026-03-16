"use client";

import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { User, Key, ShieldCheck, Lock, Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile Details", icon: User },
    { id: "password", label: "Security & Password", icon: Lock },
  ];

  return (
    <PortalLayout>
      <div className="max-w-5xl mx-auto pt-4 pb-12 px-4">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your personal information and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-3 shadow-sm sticky top-24">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300",
                    activeTab === tab.id 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-white" : "text-slate-400")} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === "profile" ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12"
                >
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                        <User className="w-7 h-7" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
                        <p className="text-slate-500 text-sm font-medium">Your public profile data</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                       <div className="relative group">
                          <input 
                            type="text" 
                            defaultValue={user?.displayName || "Admin User"}
                            disabled
                            className="w-full pl-5 pr-12 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-700 font-bold focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                          />
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                       <div className="relative group">
                          <input 
                            type="email" 
                            defaultValue={user?.email || "admin@example.com"}
                            disabled
                            className="w-full pl-5 pr-12 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-700 font-bold outline-none"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold ml-1 italic">* Contact support to change email</p>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end">
                     <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        UPDATE PROFILE
                     </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12"
                >
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                        <ShieldCheck className="w-7 h-7" />
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">Security</h2>
                        <p className="text-slate-500 text-sm font-medium">Update your account password</p>
                     </div>
                  </div>

                  <div className="max-w-md space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                       <div className="relative">
                          <input 
                            type={showCurrentPass ? "text" : "password"} 
                            placeholder="••••••••"
                            className="w-full pl-5 pr-12 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showCurrentPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-50">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                       <div className="relative">
                          <input 
                            type={showNewPass ? "text" : "password"} 
                            placeholder="••••••••"
                            className="w-full pl-5 pr-12 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                       <div className="relative">
                          <input 
                            type={showConfirmPass ? "text" : "password"} 
                            placeholder="••••••••"
                            className="w-full pl-5 pr-12 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-medium focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                       </div>
                    </div>

                    <div className="pt-6">
                       <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 mb-8">
                          <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2">Password Requirements</h4>
                          <ul className="text-[11px] text-blue-700/80 font-bold space-y-1.5 list-disc ml-4">
                             <li>At least 8 characters long</li>
                             <li>Must include one uppercase letter</li>
                             <li>Must include one special character</li>
                          </ul>
                       </div>

                       <button className="w-full py-5 bg-blue-600 text-white rounded-[1.25rem] font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4" />
                          CHANGE PASSWORD
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

