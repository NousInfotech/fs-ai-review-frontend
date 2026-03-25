"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Users, FileText, CheckCircle, Clock, ShieldCheck, ArrowRight, Activity, User } from "lucide-react";
import api from "@/lib/api";
import BannerCarousel from "@/app/dashboard/components/BannerCarousel";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TestCase, AuditLog, AdminRole } from "@/types/admin";

type AdminStatsApiResponse = {
  users?: { total?: number };
  uploads?: { total?: number; completed?: number; processing?: number; failed?: number };
  tests?: { total?: number; passed?: number; failed?: number; warnings?: number; pass_rate?: string };
};

type AdminAuditLogApi = {
  _id: string;
  actor_id: string;
  actor_email?: string;
  action: string;
  target?: string;
  target_id?: string;
  details?: Record<string, unknown>;
  timestamp: string;
};

type AdminDashboardStats = {
  totalUsers: number;
  totalTestCases: number;
  activeTestCases: number;
  recentActions: AuditLog[];
};

const fetchStats = async (): Promise<AdminDashboardStats> => {
  const [statsRes, testCasesRes, logsRes] = await Promise.allSettled([
    api.get<AdminStatsApiResponse>('/api/v1/admin/stats'),
    api.get<TestCase[]>('/api/v1/admin/test-cases'),
    api.get<AdminAuditLogApi[]>('/api/v1/admin/audit-logs?limit=4'),
  ]);

  const statsData = statsRes.status === "fulfilled" ? statsRes.value.data : {};
  const testCases = testCasesRes.status === "fulfilled" ? testCasesRes.value.data : [];
  const logs = logsRes.status === "fulfilled" ? logsRes.value.data : [];

  return {
    totalUsers: Number(statsData.users?.total ?? 0),
    totalTestCases: testCases.length,
    activeTestCases: testCases.filter((tc) => tc.enabled).length,
    recentActions: logs.map((log) => ({
      _id: log._id,
      actor_id: log.actor_id,
      actor_name: log.actor_email || log.actor_id,
      role: inferRole(log),
      action: buildActionText(log),
      metadata: log.details,
      timestamp: log.timestamp,
    })),
  };
};


export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchStats
  });

  if (!stats && !isLoading) return null;

  return (
    <div className="w-full h-full flex flex-col pt-2 pb-8 scrollbar-hide overflow-y-auto">
      {/* Top Banner - Reusing the same premium carousel for visual parity */}
      <BannerCarousel />

      {/* Admin Stats Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Platform Overview
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Real-time system statistics and administrative activity</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard 
          label="Total Platform Users" 
          value={stats?.totalUsers} 
          icon={<Users className="w-6 h-6 text-blue-600" strokeWidth={1.5} />} 
          iconBoxClass="bg-blue-50 border border-blue-100"
          isLoading={isLoading}
        />
        <StatsCard 
          label="Total Test Cases" 
          value={stats?.totalTestCases} 
          icon={<FileText className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />} 
          iconBoxClass="bg-indigo-50 border border-indigo-100"
          isLoading={isLoading}
        />
        <StatsCard 
          label="Active Test Cases" 
          value={stats?.activeTestCases} 
          icon={<CheckCircle className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />} 
          iconBoxClass="bg-emerald-50 border border-emerald-100"
          isLoading={isLoading}
        />
      </div>

      {/* Recent Actions Feed */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
             <Clock className="w-5 h-5 text-slate-400" />
             Recent System Actions
           </h3>
           <Link
             href="/admin/audit-logs"
             className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
           >
             View All Activity
             <ArrowRight className="w-4 h-4" />
           </Link>
        </div>

        <div className="audit-card overflow-hidden">
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="px-6 py-5 animate-pulse flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-64 bg-slate-100 rounded"></div>
                    <div className="h-3 w-32 bg-slate-50 rounded"></div>
                  </div>
                  <div className="h-4 w-24 bg-slate-100 rounded"></div>
                </div>
              ))
            ) : (!stats?.recentActions || stats.recentActions.length === 0) ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Activity className="w-8 h-8" />
                </div>
                <p className="text-slate-500 font-bold">No recent administrative actions found</p>
                <p className="text-slate-400 text-sm">Activity will appear here as users interact with the platform</p>
              </div>
            ) : (
              stats.recentActions.slice(0, 4).map((action, idx) => (
                <motion.div 
                  key={action._id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg",
                      action.role === 'SUPER_ADMIN' ? "bg-purple-600 shadow-purple-200" : "bg-blue-600 shadow-blue-200"
                    )}>
                      {action.role === 'SUPER_ADMIN' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {action.action}
                      </p>
                      <div className="flex items-center mt-1 gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase",
                          getRoleBadgeColor(action.role)
                        )}>
                          {action.role}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 truncate max-w-[150px]">
                          ACTOR: {action.actor_id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(action.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                      {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon, iconBoxClass, isLoading }: any) {
  return (
    <div className="audit-card p-6 flex items-center gap-5">
       {/* Icon Box */}
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${iconBoxClass}`}>
         {icon}
       </div>
       
       {/* Info */}
       <div className="flex-1">
         <div className="text-sm font-bold text-slate-500 mb-0.5 uppercase tracking-wider">{label}</div>
         <div className="text-3xl font-black text-slate-800 tabular-nums">
           {isLoading ? (
             <div className="h-9 w-20 bg-slate-100 animate-pulse rounded-lg"></div>
           ) : (
             value || 0
           )}
         </div>
       </div>
    </div>
  );
}

function buildActionText(log: AdminAuditLogApi): string {
  const action = String(log.action || "").toUpperCase();
  const target = String(log.target || "").toLowerCase();
  const details = (log.details || {}) as Record<string, unknown>;

  if (action === "CREATE" && target === "user") {
    const email = typeof details.email === "string" ? details.email : log.target_id;
    return `Created platform user (${email})`;
  }
  if (action === "UPDATE" && target === "user") {
    return `Updated platform user (${log.target_id || "unknown"})`;
  }
  if (action === "DELETE" && target === "user") {
    return `Deleted user account (${log.target_id || "unknown"})`;
  }
  if (action === "CREATE" && target === "test_case") {
    return `Created test case ${String(log.target_id || "")}`;
  }
  if (action === "UPDATE" && target === "test_case") {
    return `Updated test case ${String(log.target_id || "")}`;
  }
  if (action === "TOGGLE" && target === "test_case") {
    return `Toggled test case ${String(log.target_id || "")}`;
  }

  const pretty = action ? action.charAt(0) + action.slice(1).toLowerCase() : "Activity";
  return `${pretty} ${target || "record"} ${log.target_id ? `(${log.target_id})` : ""}`.trim();
}

function inferRole(log: AdminAuditLogApi): AdminRole {
  const detailsRole = typeof log.details?.role === "string" ? log.details.role.toUpperCase() : "";
  if (detailsRole === "SUPER_ADMIN" || detailsRole === "ADMIN" || detailsRole === "EMPLOYEE") {
    return detailsRole as AdminRole;
  }
  // Audit log model does not persist role; default for badge styling.
  return "ADMIN";
}

function getRoleBadgeColor(role: AdminRole) {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700 border border-purple-200';
    case 'ADMIN': return 'bg-blue-100 text-blue-700 border border-blue-200';
    default: return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}
