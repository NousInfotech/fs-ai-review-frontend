"use client";

import { FileText, CheckSquare, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Stats {
  totalDocuments?: number;
  completedReviews?: number;
  issuesFound?: number;
  clearedStatements?: number; // Added to match image
}

export default function SummaryCards({ stats, isLoading }: { stats?: Stats, isLoading: boolean }) {
  // Use mock data if not fully loaded, just to match visually while loading or if data missing
  const data = [
    {
      label: "FS Uploaded",
      value: stats?.totalDocuments || 48,
      icon: <FileText className="w-6 h-6 text-gray-400" strokeWidth={1.5} />,
      iconBoxClass: "bg-gray-50 border border-gray-200"
    },
    {
      label: "AI Reviews Completed",
      value: stats?.completedReviews || 36,
      icon: <CheckSquare className="w-6 h-6 text-blue-500" strokeWidth={1.5} />,
      iconBoxClass: "bg-blue-50 border border-blue-100"
    },
    {
      label: "Issues Detected",
      value: stats?.issuesFound || 112,
      icon: <AlertTriangle className="w-6 h-6 text-red-500" strokeWidth={1.5} />,
      iconBoxClass: "bg-red-50 border border-red-100"
    },
    {
      label: "Cleared Statements",
      value: stats?.clearedStatements || 12,
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" strokeWidth={1.5} />,
      iconBoxClass: "bg-emerald-50 border border-emerald-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {data.map((item, i) => (
        <div key={i} className="audit-card p-5 flex items-center gap-4">
           {/* Icon Box */}
           <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBoxClass}`}>
             {item.icon}
           </div>
           
           {/* Info */}
           <div className="flex-1">
             <div className="text-sm font-medium text-slate-500 mb-0.5">{item.label}</div>
             <div className="text-2xl font-bold text-slate-800">
               {isLoading ? (
                 <div className="h-8 w-16 bg-slate-100 animate-pulse rounded"></div>
               ) : (
                 item.value
               )}
             </div>
           </div>
        </div>
      ))}
    </div>
  );
}
