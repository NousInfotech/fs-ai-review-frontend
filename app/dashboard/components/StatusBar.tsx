"use client";

import { Clock, CheckCircle2, LayoutDashboard } from "lucide-react";

export default function StatusBar({ stats }: { stats?: any }) {
  return (
    <div className="flex flex-wrap items-center gap-6 text-sm py-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        <span className="text-slate-500 font-medium">Pending Reviews: <strong className="text-slate-800 ml-1">{stats?.pendingReviews || 8}</strong></span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        <span className="text-slate-500 font-medium">In Review: <strong className="text-slate-800 ml-1">{stats?.inReview || 6}</strong></span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        <span className="text-slate-500 font-medium">Completed: <strong className="text-slate-800 ml-1">{stats?.completedReviews || 30}</strong></span>
      </div>
    </div>
  );
}
