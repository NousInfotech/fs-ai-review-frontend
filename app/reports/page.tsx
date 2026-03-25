"use client";

import PortalLayout from "@/components/PortalLayout";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DashboardReviewRow } from "@/lib/types";
import { mapApiReviewToDashboardRow, mergeReviewReportIntoRow } from "@/lib/reviewDashboardMetrics";
import type { ReviewResult } from "@/types/review";
import { FileText, Eye, AlertCircle, ClipboardList } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { generateDisplayId } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PIE_COLORS = {
  passes: "#3b82f6",
  regulatory: "#f97316",
  critical: "#ef4444",
  neutral: "#e2e8f0",
} as const;

function getRiskStyles(risk: string) {
  const key = risk?.toLowerCase().replace(/\s+/g, "");
  if (key === "critical") return { dot: "bg-red-500", text: "text-red-600" };
  if (key === "medium") return { dot: "bg-orange-500", text: "text-orange-600" };
  if (key === "low" || key === "fullypassed") return { dot: "bg-emerald-500", text: "text-emerald-600" };
  return { dot: "bg-slate-400", text: "text-slate-500" };
}

function chartData(doc: DashboardReviewRow) {
  const seg = [
    { name: "Passes", value: doc.passes, color: PIE_COLORS.passes },
    { name: "Regulatory", value: doc.regulatoryBreaches, color: PIE_COLORS.regulatory },
    { name: "Critical", value: doc.criticalErrors, color: PIE_COLORS.critical },
  ].filter((s) => s.value > 0);
  return seg.length ? seg : [{ name: "No data", value: 1, color: PIE_COLORS.neutral }];
}

export default function ReportsPage() {
  const { data: reports = [], isLoading } = useQuery<DashboardReviewRow[]>({
    queryKey: ['generatedReports'],
    queryFn: async () => {
      const response = await api.get('/api/v1/reviews/');
      const rows = (response.data as Record<string, unknown>[])
        .map((item) => {
          const id = String(item.id ?? item._id ?? "");
          const displayId = (item.displayId as string) || generateDisplayId(id);
          return mapApiReviewToDashboardRow(item, id, displayId);
        })
        .filter((row) => row.status === "COMPLETED" || row.status === "FAILED");

      return Promise.all(
        rows.map(async (row) => {
          try {
            const rep = await api.get<ReviewResult>(`/api/v1/reviews/${row.id}/report`);
            return mergeReviewReportIntoRow(row, rep.data);
          } catch {
            return row;
          }
        })
      );
    }
  });

  const totals = reports.reduce(
    (acc, row) => {
      acc.total += 1;
      acc.passes += row.passes;
      acc.regulatory += row.regulatoryBreaches;
      acc.critical += row.criticalErrors;
      acc.issues += row.issues;
      return acc;
    },
    { total: 0, passes: 0, regulatory: 0, critical: 0, issues: 0 }
  );

  return (
    <PortalLayout title="Reports" description="Financial statement report table and overview">
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 auto-rows-fr">
          <div className="audit-card p-5 min-h-[112px] flex flex-col justify-between">
            <p className="text-[11px] leading-4 uppercase tracking-[0.14em] text-slate-500 font-semibold min-h-[2.25rem]">Reports</p>
            <p className="text-3xl leading-none font-bold text-slate-900 mt-3">{totals.total}</p>
          </div>
          <div className="audit-card p-5 min-h-[112px] flex flex-col justify-between">
            <p className="text-[11px] leading-4 uppercase tracking-[0.14em] text-slate-500 font-semibold min-h-[2.25rem]">Passes</p>
            <p className="text-3xl leading-none font-bold text-blue-600 mt-3">{totals.passes}</p>
          </div>
          <div className="audit-card p-5 min-h-[112px] flex flex-col justify-between">
            <p className="text-[11px] leading-4 uppercase tracking-[0.14em] text-slate-500 font-semibold min-h-[2.25rem]">Regulatory Breaches</p>
            <p className="text-3xl leading-none font-bold text-orange-600 mt-3">{totals.regulatory}</p>
          </div>
          <div className="audit-card p-5 min-h-[112px] flex flex-col justify-between">
            <p className="text-[11px] leading-4 uppercase tracking-[0.14em] text-slate-500 font-semibold min-h-[2.25rem]">Critical Errors</p>
            <p className="text-3xl leading-none font-bold text-red-600 mt-3">{totals.critical}</p>
          </div>
          <div className="audit-card p-5 min-h-[112px] flex flex-col justify-between">
            <p className="text-[11px] leading-4 uppercase tracking-[0.14em] text-slate-500 font-semibold min-h-[2.25rem]">Issues</p>
            <p className="text-3xl leading-none font-bold text-slate-900 mt-3">{totals.issues}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 w-full overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Statements</h2>
              <p className="text-slate-500 text-sm mt-1">Reports table with analysis distribution</p>
            </div>
            <ClipboardList className="w-5 h-5 text-slate-400" />
          </div>

          {isLoading ? (
            <div className="flex justify-center p-10 text-slate-400">Loading reports...</div>
          ) : reports.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
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
                  {reports.map((doc) => {
                    const risk = getRiskStyles(doc.riskLevel);
                    return (
                      <tr key={doc.id} className="group hover:translate-y-[-2px] transition-all duration-300">
                        <td className="px-4 py-4 bg-slate-50/50 rounded-l-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                              <FileText className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="font-bold text-slate-900">{doc.companyName || "Unknown Company"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 bg-slate-50/50">
                          <div className="w-[3.25rem] h-[3.25rem] relative shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={chartData(doc)}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={16}
                                  outerRadius={28}
                                  paddingAngle={1.5}
                                  dataKey="value"
                                  stroke="none"
                                >
                                  {chartData(doc).map((entry, idx) => (
                                    <Cell key={`${doc.id}-${idx}`} fill={entry.color} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                        <td className="px-4 py-4 bg-slate-50/50 text-slate-600 font-semibold">{doc.documentYear}</td>
                        <td className="px-4 py-4 bg-slate-50/50">
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider uppercase border border-blue-100">
                            Reviewed
                          </span>
                        </td>
                        <td className="px-4 py-4 bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", risk.dot)} />
                            <span className={cn("font-bold", risk.text)}>{doc.riskLevel}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 bg-slate-50/50">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{doc.issues}</span>
                            {doc.issues > 0 && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                          </div>
                        </td>
                        <td className="px-4 py-4 bg-slate-50/50 rounded-r-2xl text-right">
                          <Link
                            href={`/results/${doc.id}`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            View Insights
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-100 rounded-xl">
              <FileText className="w-12 h-12 text-slate-200 mb-3" />
              <h3 className="text-slate-800 font-medium">No completed reports</h3>
              <p className="text-slate-500 text-sm mt-1">Upload and process a document to generate a report.</p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
