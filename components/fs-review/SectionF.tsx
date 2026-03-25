"use client";

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import type { SectionF as SectionFType, SectionFFinding } from "@/types/review";
import { Calculator } from "lucide-react";
import ReviewSection from "./ReviewSection";

function formatValue(value: number | string | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function severityStyles(severity: SectionFFinding["severity"]) {
  switch (severity) {
    case "critical":
      return { pill: "bg-red-50 text-red-700 border-red-200", icon: "text-red-500" };
    case "high":
      return { pill: "bg-orange-50 text-orange-700 border-orange-200", icon: "text-orange-500" };
    case "warning":
      return { pill: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: "text-yellow-600" };
    default:
      return { pill: "bg-slate-50 text-slate-700 border-slate-200", icon: "text-slate-500" };
  }
}

export default function SectionF({ data }: { data?: SectionFType }) {
  const calculation = data?.stages?.calculation;
  const findings = calculation?.findings || [];
  const stats = calculation?.stats;

  const summaryParts: string[] = [];
  if (calculation?.overall_status) summaryParts.push(`Overall: ${calculation.overall_status}`);
  if (stats) summaryParts.push(`Checks: ${stats.checks_run} run / ${stats.checks_passed} passed / ${stats.checks_failed} failed`);
  if (calculation?.current_year) summaryParts.push(`Year: ${calculation.current_year}`);

  return (
    <ReviewSection
      title="Calculations"
      titleColorClass="text-indigo-700"
      badgeColorClass="bg-indigo-700"
      count={findings.length}
      content={summaryParts.length ? summaryParts.join(" • ") : undefined}
      items={findings}
      emptyMessage="No calculation findings found."
      emptyBgClass="bg-indigo-50/40"
      emptyBorderClass="border-indigo-100"
      renderItem={(finding, idx) => {
        const styles = severityStyles(finding.severity);
        const headlineId = finding.rule_id || finding.test_id || `Finding ${idx + 1}`;

        return (
          <AccordionItem key={idx} value={`Section F — Calculations-${idx}`}>
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Calculator className={styles.icon} size={18} />
                <div className="flex flex-col items-start text-left gap-0.5">
                  <span className="group-hover:underline underline-offset-4">
                    {headlineId} — {finding.description || finding.result || "Calculation finding"}
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded border uppercase tracking-wider h-fit ${styles.pill}`}>
                  {finding.severity}
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-sm space-y-4">
              {(finding.description || finding.result) && (
                <div className="space-y-2">
                  {finding.description && (
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Description:</p>
                      <p className="text-gray-600 leading-relaxed">{finding.description}</p>
                    </div>
                  )}

                  {finding.result && (
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Result:</p>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-gray-700">{finding.result}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="font-bold text-red-800 text-xs uppercase tracking-wider mb-1">Current</p>
                  <p className="text-red-700">{formatValue(finding.current)}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="font-bold text-blue-800 text-xs uppercase tracking-wider mb-1">Expected</p>
                  <p className="text-blue-700">{formatValue(finding.expected)}</p>
                </div>
              </div>

              {(finding.page_no !== undefined || finding.location) && (
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-700">Location:</span>{" "}
                  {[finding.page_no !== undefined ? `Page ${finding.page_no}` : null, finding.location || null]
                    .filter(Boolean)
                    .join(" — ")}
                </div>
              )}

              {(finding.reported_value !== undefined ||
                finding.expected_value !== undefined ||
                finding.difference !== undefined) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Reported</p>
                    <p className="text-slate-700">{formatValue(finding.reported_value)}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Expected</p>
                    <p className="text-slate-700">{formatValue(finding.expected_value)}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Difference</p>
                    <p className="text-slate-700">{formatValue(finding.difference)}</p>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      }}
    />
  );
}
