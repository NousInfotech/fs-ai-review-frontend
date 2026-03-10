"use client";

import PortalLayout from "@/components/PortalLayout";
import { Loader2, FileText } from "lucide-react";
import Link from "next/link";

export default function ProcessingIndexPage() {
  return (
    <PortalLayout title="Processing Queue" description="View active or pending statement reviews">
      <div className="max-w-2xl mx-auto py-12">
        <div className="audit-card w-full p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No Active Pipeline Selected</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
              To view the live progress matrix of an AI review, you must select an individual statement that is currently parsing.
            </p>
            <div className="flex gap-4">
                <Link href="/history" className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
                    View History
                </Link>
                <Link href="/upload" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                    Upload New
                </Link>
            </div>
        </div>
      </div>
    </PortalLayout>
  );
}
