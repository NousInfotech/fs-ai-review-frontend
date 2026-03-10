"use client";

import PortalLayout from "@/components/PortalLayout";
import { CheckSquare, FileText } from "lucide-react";
import Link from "next/link";

export default function ResultsIndexPage() {
  return (
    <PortalLayout title="Analysis Results" description="Review generated intelligence reports">
      <div className="max-w-2xl mx-auto py-12">
        <div className="audit-card w-full p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <CheckSquare className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Select a Finished Report</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
              A specific review identifier is required to display an AI Analysis Audit Result. Please select a completed review from the history table.
            </p>
            <div className="flex gap-4">
                <Link href="/reports" className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
                    View Report List
                </Link>
                <Link href="/history" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                    View Data Grid
                </Link>
            </div>
        </div>
      </div>
    </PortalLayout>
  );
}
