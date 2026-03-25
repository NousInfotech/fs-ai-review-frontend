"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  User, 
  Calendar, 
  Activity,
  Loader2,
  Clock,
  Fingerprint,
  History,
  ShieldCheck
} from "lucide-react";
import { AuditLog } from "@/types/admin";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const fetchLogs = async (): Promise<AuditLog[]> => {
  const { data } = await api.get('/api/v1/admin/audit-logs');
  return data;
};

export default function AuditLogsPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: fetchLogs
  });

  return (
    <div className="w-full h-full flex flex-col pt-2 pb-8 scrollbar-hide">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <History className="w-8 h-8 text-blue-600" />
             System Audit Logs
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track high-level system activity and administrative security actions</p>
        </div>
      </div>

      <div className="audit-card overflow-hidden flex flex-col">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Event Timestamp</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">System Actor</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Access Role</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Action Executed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" strokeWidth={3} />
                    <p className="mt-4 text-slate-500 font-bold">Retrieving security logs...</p>
                  </td>
                </tr>
              ) : logs?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-500">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                       <Shield className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-bold">No system logs recorded yet</p>
                  </td>
                </tr>
              ) : (
                logs?.map((log, idx) => (
                  <motion.tr 
                    key={log._id} 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center text-sm font-bold text-slate-600">
                        <Clock className="w-4 h-4 mr-2.5 text-blue-500/50" />
                        {new Date(log.timestamp).toLocaleString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 mr-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                           <Fingerprint className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-black text-slate-800 tracking-tight">{log.actor_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border",
                        log.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        log.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      )}>
                        {log.role === 'SUPER_ADMIN' ? <ShieldCheck className="w-3 h-3 mr-1.5" /> : <Shield className="w-3 h-3 mr-1.5" />}
                        {log.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">
                      <div className="flex items-start">
                        <Activity className="w-4 h-4 mr-2.5 mt-0.5 text-emerald-500/60" />
                        <span className="group-hover:text-slate-900 transition-colors">{log.action}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
