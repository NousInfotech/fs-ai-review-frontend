"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, FileText, Activity, CheckCircle, Clock } from "lucide-react";
import { AdminStats } from "@/types/admin";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

const fetchStats = async (): Promise<AdminStats> => {
  const { data } = await api.get('/api/v1/admin/stats');
  return data;
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchStats
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of platform activity and resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Platform Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="bg-blue-500"
        />
        <StatsCard 
          title="Total Test Cases" 
          value={stats.totalTestCases} 
          icon={FileText} 
          color="bg-indigo-500"
        />
        <StatsCard 
          title="Active Test Cases" 
          value={stats.activeTestCases} 
          icon={CheckCircle} 
          color="bg-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            Recent Admin Actions
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {(!stats.recentActions || stats.recentActions.length === 0) ? (
            <div className="p-6 text-center text-gray-500 text-sm">No recent actions found</div>
          ) : (
            stats.recentActions.map((action) => (
              <div key={action._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatActionText(action)}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span className={`px-1.5 py-0.5 rounded font-medium mr-2 ${getRoleBadgeColor(action.role)}`}>
                      {action.role}
                    </span>
                    <span>by {action.actor_id}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(action.timestamp).toLocaleDateString()} {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function formatActionText(action: any) {
  switch (action.action) {
    case 'created_user': return `Created new platform user (${action.metadata?.email})`;
    case 'updated_test_case': return `Updated test case ${action.metadata?.test_id}`;
    case 'deleted_user': return `Deleted user account`;
    default: return action.action.replace(/_/g, ' ');
  }
}

function getRoleBadgeColor(role: string) {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700';
    case 'ADMIN': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
