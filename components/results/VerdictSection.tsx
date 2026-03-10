import { SectionE, SectionB } from "@/types/review";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

interface VerdictSectionProps {
  data: SectionE;
  criticalErrors: SectionB;
}

export default function VerdictSection({ data, criticalErrors }: VerdictSectionProps) {
  const hasErrors = criticalErrors.items.length > 0;
  const isNotFit = data.verdict.toUpperCase().includes("NOT FIT FOR APPROVAL");
  const isDanger = isNotFit || hasErrors;

  return (
    <div className={`mb-8 audit-card p-6 border-l-[6px] ${
      isDanger 
        ? "border-l-red-500 bg-red-50/10" 
        : "border-l-emerald-500 bg-emerald-50/10"
    }`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          {isDanger ? (
            <ShieldAlert className="h-8 w-8 text-red-600" />
          ) : (
            <CheckCircle className="h-8 w-8 text-green-600" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide opacity-80 mb-1">
            VERDICT
          </h2>
          <p className="text-2xl font-bold leading-tight">
            {data.verdict}
          </p>
          {data.executive_summary && (
            <p className="mt-3 text-sm opacity-90 leading-relaxed italic">
              {data.executive_summary}
            </p>
          )}
          {hasErrors && (
            <p className="mt-2 text-red-700 font-medium">
              Action Required: Please resolve the {criticalErrors.items.length} critical error(s) below before approval.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
