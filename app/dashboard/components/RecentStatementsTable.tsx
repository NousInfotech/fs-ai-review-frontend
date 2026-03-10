"use client";

import Link from "next/link";
import { HistoryDocument } from "@/lib/types";

export default function RecentStatementsTable({ documents, isLoading }: { documents: HistoryDocument[], isLoading: boolean }) {
  // Use mock data if not provided
  const dummyData = [
    { companyName: "ABC Ltd", documentDate: "2024", status: "Reviewed", riskLevel: "Medium", issues: 5, action: "View Report", id: "1" },
    { companyName: "Delta Group", documentDate: "2023", status: "Investigate", riskLevel: "High", issues: 10, action: "Investigate", id: "2" },
    { companyName: "Nova Ltd", documentDate: "2024", status: "Processing", riskLevel: "-", issues: "-", action: "Loading", id: "3" },
    { companyName: "Omega Inc", documentDate: "2023", status: "Cleared", riskLevel: "Low", issues: 0, action: "View Report", id: "4" }
  ];

  const dataToRender = documents?.length > 0 ? documents : dummyData;

  const getStatusPill = (status: string) => {
    switch (status.toLowerCase()) {
      case "cleared":
        return <span className="px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-600 text-[11px] font-semibold tracking-wide uppercase border border-emerald-200/50">Cleared</span>;
      case "reviewed":
      case "completed":
        return <span className="px-3 py-1 rounded-full bg-blue-100/50 text-blue-600 text-[11px] font-semibold tracking-wide uppercase border border-blue-200/50">Reviewed</span>;
      case "processing":
      case "in_progress":
        return <span className="px-3 py-1 rounded-full bg-slate-100/50 text-slate-600 text-[11px] font-semibold tracking-wide uppercase border border-slate-200/50">Processing</span>;
      case "investigate":
      case "error":
        return <span className="px-3 py-1 rounded-full bg-red-100/50 text-red-600 text-[11px] font-semibold tracking-wide uppercase border border-red-200/50">Investigate</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-100/50 text-gray-600 text-[11px] font-semibold tracking-wide uppercase border border-gray-200/50">{status}</span>;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "high": return "text-red-500 font-medium";
      case "medium": return "text-orange-500 font-medium";
      case "low": return "text-emerald-500 font-medium";
      default: return "text-slate-400 font-medium";
    }
  };

  return (
    <div className="audit-card w-full h-full p-6">
      <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-4">Recent Financial Statements</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 font-medium uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="pb-3 font-semibold">Company</th>
              <th className="pb-3 font-semibold">Year</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Risk Level</th>
              <th className="pb-3 font-semibold">Issues</th>
              <th className="pb-3 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr>
                 <td colSpan={6} className="text-center py-8 text-slate-400">Loading statements...</td>
               </tr>
            ) : dataToRender.map((doc: any, i) => (
              <tr key={doc.id || i} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 font-semibold text-blue-600">{doc.companyName || doc.metadata?.companyName || "Unknown"}</td>
                <td className="py-3.5 text-slate-600">{doc.documentDate || "2024"}</td>
                <td className="py-3.5">{getStatusPill(doc.status)}</td>
                <td className={`py-3.5 ${getRiskColor(doc.riskLevel || (i % 2 === 0 ? "Medium" : "High"))}`}>
                  {doc.riskLevel || (i === 1 ? "High" : i === 2 ? "-" : i === 3 ? "Low" : "Medium")}
                </td>
                <td className="py-3.5 font-semibold text-slate-700">{doc.issues !== undefined ? doc.issues : (i === 1 ? 10 : i === 2 ? "-" : i === 3 ? 0 : 5)}</td>
                <td className="py-3.5 text-center">
                   {doc.status?.toLowerCase() === "processing" ? (
                      <button disabled className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold">
                        Processing...
                      </button>
                   ) : (
                      <Link 
                        href={`/results/${doc.id}`}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity ${doc.riskLevel?.toLowerCase() === 'high' || i === 1 ? 'bg-blue-600' : 'bg-blue-500'}`}
                      >
                         {doc.riskLevel?.toLowerCase() === 'high' || i === 1 ? 'Investigate' : 'View Report'}
                      </Link>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
