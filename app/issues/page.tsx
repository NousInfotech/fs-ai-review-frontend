"use client";

import PortalLayout from "@/components/PortalLayout";
import TopIssuesPanel from "@/app/dashboard/components/TopIssuesPanel";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export default function IssuesPage() {
  return (
    <PortalLayout title="All Detected Issues" description="Review and manage identified report discrepancies">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
             <div className="audit-card w-full h-full p-6">
                <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-4">Detailed Issue Feed</h2>
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <AlertTriangle className="w-12 h-12 text-orange-200 mb-3" />
                    <h3 className="text-slate-800 font-medium">No unresolved issues</h3>
                    <p className="text-slate-500 text-sm mt-1">All processed financial statements currently look clean.</p>
                </div>
             </div>
          </div>
          
          <div>
            <TopIssuesPanel />
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
