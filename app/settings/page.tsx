"use client";

import PortalLayout from "@/components/PortalLayout";
import { User, Bell, Shield, Key } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <PortalLayout title="Settings" description="Manage your account structure and preferences">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Nav */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-blue-700 bg-blue-50 flex items-center gap-3">
            <User className="w-4 h-4" /> Account
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 disabled:opacity-50">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 disabled:opacity-50">
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 disabled:opacity-50">
            <Key className="w-4 h-4" /> API Keys
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="audit-card w-full p-6">
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-1">Profile Details</h2>
            <p className="text-sm text-slate-500 mb-6">Update your personal information and email address.</p>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  disabled
                  defaultValue={user?.displayName || "Admin User"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  defaultValue={user?.email || "admin@example.com"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none"
                />
              </div>
              
              <button 
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors mt-2 opacity-50 cursor-not-allowed"
                disabled
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
