import type { ReviewResult } from "@/types/review";
import type { DashboardReviewRow, DashboardRiskLevel } from "@/lib/types";

type UnknownRecord = Record<string, unknown>;

function toNonNegativeInt(v: unknown): number {
  if (v === undefined || v === null || v === "") return 0;
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

/** First matching key wins; 0 is a valid value (unlike chaining with `||`). */
function pickIntFromRecords(records: (UnknownRecord | undefined)[], keys: string[]): number {
  for (const obj of records) {
    if (!obj) continue;
    for (const k of keys) {
      if (k in obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
        return toNonNegativeInt(obj[k]);
      }
    }
  }
  return 0;
}

function pickIntIfPresent(obj: UnknownRecord | undefined, keys: string[]): number | undefined {
  if (!obj) return undefined;
  for (const k of keys) {
    if (k in obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
      return toNonNegativeInt(obj[k]);
    }
  }
  return undefined;
}

/** Pull 4-digit year from API date strings (e.g. "31 December 2014") or ISO dates. */
export function extractYearFromDocumentDate(raw: unknown): string {
  if (raw === undefined || raw === null) return "—";
  const s = String(raw).trim();
  if (!s) return "—";

  const fourDigit = s.match(/\b(19|20)\d{2}\b/);
  if (fourDigit) return fourDigit[0];

  const d = Date.parse(s);
  if (!Number.isNaN(d)) return String(new Date(d).getUTCFullYear());

  return s.length >= 4 ? s.slice(0, 4) : "—";
}

function countFromStandardizedResults(results: unknown[]): {
  passed: number;
  regulatoryBreaches: number;
  criticalErrors: number;
} {
  let passed = 0;
  let regulatoryBreaches = 0;
  let criticalErrors = 0;

  for (const entry of results) {
    if (!entry || typeof entry !== "object") continue;
    const r = entry as UnknownRecord;
    const status = String(r.status ?? "").toUpperCase();
    const ev = r.extractedValues as UnknownRecord | undefined;
    const section = ev?.section ?? r.section;

    if (status === "PASS" || section === "A") {
      passed++;
      continue;
    }
    if (status === "CRITICAL" || section === "B") {
      criticalErrors++;
      continue;
    }
    if (status === "WARNING" || section === "C") {
      regulatoryBreaches++;
      continue;
    }
    if (status === "FAIL") {
      if (section === "C") regulatoryBreaches++;
      else criticalErrors++;
    }
  }

  return { passed, regulatoryBreaches, criticalErrors };
}

function countFromReviewReport(report: Partial<ReviewResult>): {
  passed: number;
  regulatoryBreaches: number;
  criticalErrors: number;
} {
  return {
    passed: report.A?.items?.length ?? 0,
    regulatoryBreaches: report.C?.items?.length ?? 0,
    criticalErrors: report.B?.items?.length ?? 0,
  };
}

export function extractCountsFromReviewListItem(item: UnknownRecord): {
  passed: number;
  regulatoryBreaches: number;
  criticalErrors: number;
} {
  const report = (item.report ?? item.reviewReport) as Partial<ReviewResult> | undefined;

  if (report && typeof report === "object" && (report.A || report.B || report.C)) {
    const { passed, regulatoryBreaches, criticalErrors } = countFromReviewReport(report);
    if (passed + regulatoryBreaches + criticalErrors > 0) {
      return { passed, regulatoryBreaches, criticalErrors };
    }
  }

  const results = (item.results ?? item.review_result) as unknown[] | undefined;
  if (Array.isArray(results) && results.length > 0) {
    return countFromStandardizedResults(results);
  }

  const summary = (item.summary ?? item.stats ?? item.metrics) as UnknownRecord | undefined;

  const passed = pickIntFromRecords(
    [item, summary],
    [
      "passes",
      "passCount",
      "pass_count",
      "passedCount",
      "passed",
      "checks_passed",
      "pass_checks",
    ]
  );

  const regulatoryBreaches = pickIntFromRecords(
    [item, summary],
    [
      "regulatoryBreaches",
      "regulationBreaches",
      "regulation_breaches",
      "warningCount",
      "warning_count",
      "warnings",
      "disclosureBreaches",
      "sectionCCount",
      "breachCount",
      "regulatory_breaches",
    ]
  );

  const criticalErrors = pickIntFromRecords(
    [item, summary],
    [
      "criticalErrors",
      "criticalErrorCount",
      "critical_error_count",
      "critical_count",
      "sectionBCount",
      "critical_errors",
    ]
  );

  return { passed, regulatoryBreaches, criticalErrors };
}

/**
 * Risk rules:
 * - Fully passed: passes only, no breaches or critical errors.
 * - Low: (regulatory + critical) < passed.
 * - Otherwise: if regulatory > critical → Medium; if critical > regulatory → Critical; tie → Medium.
 */
export function computeDashboardRisk(
  passed: number,
  regulatoryBreaches: number,
  criticalErrors: number
): DashboardRiskLevel {
  const failSum = regulatoryBreaches + criticalErrors;

  if (passed > 0 && failSum === 0) return "Fully passed";
  if (failSum < passed) return "Low";
  if (failSum === 0 && passed === 0) return "Low";

  if (regulatoryBreaches > criticalErrors) return "Medium";
  if (criticalErrors > regulatoryBreaches) return "Critical";
  return "Medium";
}

export function mapApiReviewToDashboardRow(
  item: UnknownRecord,
  id: string,
  displayId: string
): DashboardReviewRow {
  const companyName =
    (item.companyName as string) ||
    (item.company_name as string) ||
    ((item.metadata as UnknownRecord)?.companyName as string) ||
    ((item.metadata as UnknownRecord)?.company_name as string) ||
    "Unknown Company";

  const documentDateRaw =
    (item.documentDate as string) ||
    (item.document_date as string) ||
    ((item.metadata as UnknownRecord)?.documentDate as string) ||
    ((item.metadata as UnknownRecord)?.document_date as string) ||
    "";

  const documentYear = extractYearFromDocumentDate(documentDateRaw);

  const counts = extractCountsFromReviewListItem(item);

  const summaryBlock = (item.summary ?? item.stats) as UnknownRecord | undefined;
  let issues: number;
  if (item.issues !== undefined && item.issues !== null && item.issues !== "") {
    issues = toNonNegativeInt(item.issues);
  } else {
    const fromNested =
      pickIntIfPresent(item as UnknownRecord, ["issueCount", "issuesFound", "totalIssues"]) ??
      pickIntIfPresent(summaryBlock, ["issues", "issueCount", "issuesFound", "totalIssues"]);
    issues = fromNested ?? counts.regulatoryBreaches + counts.criticalErrors;
  }

  const riskLevel = computeDashboardRisk(
    counts.passed,
    counts.regulatoryBreaches,
    counts.criticalErrors
  );

  const status = (item.status as DashboardReviewRow["status"]) || "PENDING";

  return {
    id,
    displayId,
    companyName,
    documentDate: documentDateRaw || documentYear,
    documentYear,
    uploadDate: (item.createdAt as string) || new Date().toISOString(),
    fileUrl: (item.fileUrl as string) || "",
    status,
    totalPages: toNonNegativeInt(item.totalPages),
    passes: counts.passed,
    regulatoryBreaches: counts.regulatoryBreaches,
    criticalErrors: counts.criticalErrors,
    issues,
    riskLevel,
  };
}

/** Same sections as Results stats cards: A = passes, B = critical, C = regulatory breaches. */
export function mergeReviewReportIntoRow(
  row: DashboardReviewRow,
  report: Partial<ReviewResult> | null | undefined
): DashboardReviewRow {
  if (!report || typeof report !== "object") return row;
  if (!report.A && !report.B && !report.C) return row;

  const passed = report.A?.items?.length ?? 0;
  const criticalErrors = report.B?.items?.length ?? 0;
  const regulatoryBreaches = report.C?.items?.length ?? 0;

  return {
    ...row,
    passes: passed,
    regulatoryBreaches,
    criticalErrors,
    issues: regulatoryBreaches + criticalErrors,
    riskLevel: computeDashboardRisk(passed, regulatoryBreaches, criticalErrors),
  };
}
