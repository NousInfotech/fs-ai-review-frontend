"use client";

import Link from "next/link";
import { HistoryDocument } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { MoreHorizontal, FileText, AlertCircle, Eye } from "lucide-react";

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
        return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-wider uppercase border border-emerald-100">Cleared</span>;
      case "reviewed":
      case "completed":
        return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider uppercase border border-blue-100">Reviewed</span>;
      case "processing":
      case "in_progress":
        return <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold tracking-wider uppercase border border-slate-100 animate-pulse">Processing</span>;
      case "investigate":
      case "error":
        return <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold tracking-wider uppercase border border-red-100">Investigate</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold tracking-wider uppercase border border-gray-100">{status}</span>;
    }
  };

  const getRiskDetails = (risk: string) => {
    const riskVal = risk?.toLowerCase();
    if (riskVal === "high") return { color: "#ef4444", bg: "bg-red-500", text: "text-red-500", value: 85 };
    if (riskVal === "medium") return { color: "#f97316", bg: "bg-orange-500", text: "text-orange-500", value: 50 };
    if (riskVal === "low") return { color: "#10b981", bg: "bg-emerald-500", text: "text-emerald-500", value: 15 };
    return { color: "#94a3b8", bg: "bg-slate-400", text: "text-slate-400", value: 0 };
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 w-full h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Statements</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and review your recent uploads</p>
        </div>
        <button className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-x-auto flex-1 scrollbar-hide">
        <table className="w-full text-sm text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em]">
              <th className="px-4 pb-4">Company</th>
              <th className="px-4 pb-4">Analysis</th>
              <th className="px-4 pb-4">Year</th>
              <th className="px-4 pb-4">Status</th>
              <th className="px-4 pb-4">Risk Level</th>
              <th className="px-4 pb-4">Issues</th>
              <th className="px-4 pb-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr>
                 <td colSpan={7} className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                      <span className="text-slate-400 font-medium tracking-wide">Synthesizing data...</span>
                    </div>
                 </td>
               </tr>
            ) : dataToRender.map((doc: any, i) => {
              const risk = getRiskDetails(doc.riskLevel || (i % 2 === 0 ? "Medium" : "High"));
              const chartData = [
                { name: "Risk", value: risk.value },
                { name: "Safety", value: 100 - risk.value }
              ];

              return (
                <tr key={doc.id || i} className="group hover:translate-y-[-2px] transition-all duration-300">
                  <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 rounded-l-2xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="font-bold text-slate-900">{doc.companyName || doc.metadata?.companyName || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors">
                    <div className="w-12 h-12 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={15}
                            outerRadius={22}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell fill={risk.color} />
                            <Cell fill="#e2e8f0" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 text-slate-600 font-semibold transition-colors">
                    {doc.documentDate || "2024"}
                  </td>
                  <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors">
                    {getStatusPill(doc.status)}
                  </td>
                  <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", risk.bg)} />
                      <span className={cn("font-bold", risk.text)}>
                        {doc.riskLevel || (i === 1 ? "High" : i === 2 ? "-" : i === 3 ? "Low" : "Medium")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">
                        {doc.issues !== undefined ? doc.issues : (i === 1 ? 10 : i === 2 ? "-" : i === 3 ? 0 : 5)}
                      </span>
                      {doc.issues > 0 && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                    </div>
                  </td>
                  <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 rounded-r-2xl text-right transition-colors">
                    {doc.status?.toLowerCase() === "processing" ? (
                      <button disabled className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold transition-all cursor-not-allowed">
                        Analyzing...
                      </button>
                    ) : (
                      <Link 
                        href={`/results/${doc.id}`}
                        className={cn(
                          "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all",
                          doc.riskLevel?.toLowerCase() === 'high' || i === 1 ? 'bg-slate-900 hover:bg-slate-800' : 'bg-blue-600 hover:bg-blue-700'
                        )}
                      >
                         <Eye className="w-4 h-4" />
                         <span className="hidden md:inline">
                           {doc.riskLevel?.toLowerCase() === 'high' || i === 1 ? 'Investigate' : 'View Insights'}
                         </span>
                         <span className="md:hidden">View</span>
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

