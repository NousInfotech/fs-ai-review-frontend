"use client";

import { UploadCloud, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export default function TopIssuesPanel() {
  const issues = [
    { text: "Cash flow mismatch", count: 14, icon: <AlertTriangle className="w-4 h-4 text-orange-400" /> },
    { text: "Inconsistent PPE notes", count: 9, icon: <AlertTriangle className="w-4 h-4 text-orange-400" /> },
    { text: "Missing IFRS disclosure", count: 6, icon: <AlertTriangle className="w-4 h-4 text-orange-400" /> },
  ];

  return (
    <div className="audit-card w-full p-6">
      <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-4">Top Issues Found</h2>
      
      <div className="space-y-4">
        {issues.map((issue, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              {issue.icon}
              <span className="text-sm font-medium text-slate-700">{issue.text}</span>
            </div>
            <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">({issue.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
