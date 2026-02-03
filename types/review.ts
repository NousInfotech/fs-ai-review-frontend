export interface Location {
  page: number;
  section: string;
  note?: string | null;
  line_hint?: string;
}

export interface CorrectItem {
  test_id: string;
  category: string;
  area: string;
  details: string;
}

export interface CriticalError {
  id: string;
  test_id: string;
  category: string;
  type?: string;
  severity?: string;
  description: string;
  location: Location;
  reported_value?: number | null;
  expected_value?: number | null;
  difference?: number | null;
  reason?: string;
  financial_impact?: string;
  suggested_fix?: string;
}

export interface DisclosureBreach {
  id?: string; // Prompt implies ID like C1, but example doesn't show it explicitly in items array, assuming it might be there or generated.
  test_id?: string;
  category?: string;
  description: string;
  location?: Location;
  impact?: string;
  suggested_fix?: string;
}

export interface ReconciliationRow {
  description: string;
  values: (number | string)[];
}

export interface ReconciliationTable {
  columns: string[];
  rows: ReconciliationRow[];
}

export interface ReconciliationSection {
  title: string;
  tables: Record<string, ReconciliationTable>;
}

export interface SectionA {
  title: string;
  items: CorrectItem[];
}

export interface SectionB {
  title: string;
  items: CriticalError[];
}

export interface SectionC {
  title: string;
  items: DisclosureBreach[];
}

export interface SectionD {
  title: string;
  tables: Record<string, ReconciliationTable>;
}

export interface SectionE {
  title: string;
  verdict: string;
}

export interface ReviewResult {
  A: SectionA;
  B: SectionB;
  C: SectionC;
  D: SectionD;
  E: SectionE;
}

export interface ReviewResponse {
  id: string;
  status: string;
  review_result: ReviewResult;
  created_at: string;
}
