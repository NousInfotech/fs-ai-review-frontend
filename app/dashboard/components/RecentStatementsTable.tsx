"use client";

import Link from "next/link";
import { DashboardReviewRow } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { MoreHorizontal, FileText, AlertCircle, Eye } from "lucide-react";
import { computeDashboardRisk } from "@/lib/reviewDashboardMetrics";

const PIE_COLORS = {
  passes: "#3b82f6",
  regulatory: "#f97316",
  critical: "#ef4444",
  neutral: "#e2e8f0",
} as const;

function getRiskStyles(risk: string) {
  const key = risk?.toLowerCase().replace(/\s+/g, "");
  if (key === "critical" || key === "high") {
    return { dot: "bg-red-500", text: "text-red-600" };
  }
  if (key === "medium") {
    return { dot: "bg-orange-500", text: "text-orange-600" };
  }
  if (key === "low" || key === "fullypassed") {
    return { dot: "bg-emerald-500", text: "text-emerald-600" };
  }
  return { dot: "bg-slate-400", text: "text-slate-500" };
}

function analysisPieData(doc: DashboardReviewRow, isProcessing: boolean) {
  if (isProcessing) {
    return [{ name: "Pending", value: 1, color: PIE_COLORS.neutral }];
  }
  const segments = [
    { name: "Passes", value: doc.passes, color: PIE_COLORS.passes },
    { name: "Regulatory breaches", value: doc.regulatoryBreaches, color: PIE_COLORS.regulatory },
    { name: "Critical errors", value: doc.criticalErrors, color: PIE_COLORS.critical },
  ].filter((s) => s.value > 0);

  if (segments.length === 0) {
    return [{ name: "No data", value: 1, color: PIE_COLORS.neutral }];
  }
  return segments;
}

export default function RecentStatementsTable({
  documents,
  isLoading,
  hasMore = false,
}: {
  documents: DashboardReviewRow[];
  isLoading: boolean;
  hasMore?: boolean;
}) {
  const dummyData: DashboardReviewRow[] = [
    {
      id: "1",
      companyName: "ABC Ltd",
      documentDate: "2024-12-31",
      documentYear: "2024",
      uploadDate: new Date().toISOString(),
      fileUrl: "",
      status: "COMPLETED",
      totalPages: 12,
      passes: 12,
      regulatoryBreaches: 3,
      criticalErrors: 1,
      issues: 4,
      riskLevel: computeDashboardRisk(12, 3, 1),
    },
    {
      id: "2",
      companyName: "Delta Group",
      documentDate: "2023-06-30",
      documentYear: "2023",
      uploadDate: new Date().toISOString(),
      fileUrl: "",
      status: "COMPLETED",
      totalPages: 20,
      passes: 5,
      regulatoryBreaches: 4,
      criticalErrors: 2,
      issues: 6,
      riskLevel: computeDashboardRisk(5, 4, 2),
    },
    {
      id: "3",
      companyName: "Nova Ltd",
      documentDate: "2024",
      documentYear: "2024",
      uploadDate: new Date().toISOString(),
      fileUrl: "",
      status: "PROCESSING",
      totalPages: 0,
      passes: 0,
      regulatoryBreaches: 0,
      criticalErrors: 0,
      issues: 0,
      riskLevel: "Low",
    },
    {
      id: "4",
      companyName: "Omega Inc",
      documentDate: "2021-12-31",
      documentYear: "2021",
      uploadDate: new Date().toISOString(),
      fileUrl: "",
      status: "COMPLETED",
      totalPages: 8,
      passes: 50,
      regulatoryBreaches: 0,
      criticalErrors: 0,
      issues: 0,
      riskLevel: computeDashboardRisk(50, 0, 0),
    },
  ];

  const dataToRender = documents?.length > 0 ? documents : dummyData;

  const getStatusPill = (status: string) => {
    switch (status.toLowerCase()) {
      case "cleared":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-wider uppercase border border-emerald-100">
            Cleared
          </span>
        );
      case "reviewed":
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider uppercase border border-blue-100">
            Reviewed
          </span>
        );
      case "processing":
      case "in_progress":
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold tracking-wider uppercase border border-slate-100 animate-pulse">
            Processing
          </span>
        );
      case "investigate":
      case "error":
      case "failed":
        return (
          <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold tracking-wider uppercase border border-red-100">
            Investigate
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold tracking-wider uppercase border border-gray-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 w-full h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Statements</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and review your recent uploads</p>
        </div>
        <button
          type="button"
          className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
        >
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
            ) : (
              dataToRender.map((doc, i) => {
                const isProcessing =
                  doc.status?.toLowerCase() === "processing" || doc.status?.toLowerCase() === "pending";
                const chartData = analysisPieData(doc, isProcessing);
                const riskStyles = getRiskStyles(
                  isProcessing ? "" : doc.riskLevel || "Medium"
                );
                const riskLabel = isProcessing ? "—" : doc.riskLevel || "—";
                const isCriticalRisk = !isProcessing && doc.riskLevel === "Critical";

                return (
                  <tr key={doc.id || i} className="group hover:translate-y-[-2px] transition-all duration-300">
                    <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 rounded-l-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="font-bold text-slate-900">{doc.companyName || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors">
                      <div className="w-[3.25rem] h-[3.25rem] relative shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={16}
                              outerRadius={28}
                              paddingAngle={chartData.length > 1 ? 1.5 : 0}
                              dataKey="value"
                              stroke="none"
                            >
                              {chartData.map((entry, idx) => (
                                <Cell key={`cell-${doc.id}-${idx}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              wrapperStyle={{ zIndex: 50 }}
                              content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;
                                const total =
                                  doc.passes + doc.regulatoryBreaches + doc.criticalErrors;
                                const row = payload[0];
                                const v = Number(row.value) || 0;
                                const pct =
                                  total > 0 ? ((v / total) * 100).toFixed(1) : "0.0";
                                const label = String(row.name ?? "");
                                return (
                                  <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-[11px] shadow-lg">
                                    <div className="font-semibold text-slate-800">{label}</div>
                                    <div className="tabular-nums text-slate-600 mt-0.5">
                                      <span className="font-bold text-slate-900">{v}</span>
                                      <span className="text-slate-400">
                                        {" "}
                                        of {total} ({pct}%)
                                      </span>
                                    </div>
                                  </div>
                                );
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 text-slate-600 font-semibold transition-colors">
                      {doc.documentYear || "—"}
                    </td>
                    <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors">
                      {getStatusPill(doc.status)}
                    </td>
                    <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors">
                      <div className="flex items-center gap-2">
                        {!isProcessing && <div className={cn("w-2 h-2 rounded-full shrink-0", riskStyles.dot)} />}
                        <span className={cn("font-bold", isProcessing ? "text-slate-400" : riskStyles.text)}>
                          {riskLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">
                          {isProcessing ? "—" : doc.issues}
                        </span>
                        {!isProcessing && doc.issues > 0 && (
                          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 bg-slate-50/50 group-hover:bg-blue-50/30 rounded-r-2xl text-right transition-colors">
                      {isProcessing ? (
                        <button
                          type="button"
                          disabled
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold transition-all cursor-not-allowed"
                        >
                          Analyzing...
                        </button>
                      ) : (
                        <Link
                          href={`/results/${doc.id}`}
                          className={cn(
                            "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all",
                            isCriticalRisk ? "bg-slate-900 hover:bg-slate-800" : "bg-blue-600 hover:bg-blue-700"
                          )}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden md:inline">
                            {isCriticalRisk ? "Investigate" : "View Insights"}
                          </span>
                          <span className="md:hidden">View</span>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && hasMore && (
        <div className="mt-5 flex justify-end">
          <Link
            href="/reports"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors"
          >
            View more
          </Link>
        </div>
      )}
    </div>
  );
}
