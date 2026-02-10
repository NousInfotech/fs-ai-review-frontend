export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnnotationData {
  note: string;
  bbox: BBox;
}

export interface Location {
  page_no: number;
  annotation_data: AnnotationData[];
  url?: string;
}

export interface CorrectItem {
  test_id: string;
  category: string;
  name: string;
  description: string;
}

export interface CriticalError {
  test_id: string;
  category: string;
  name: string;
  description: string;
  result?: string;
  location?: Location[];
}

export interface DisclosureBreach {
  test_id: string;
  category: string;
  name: string;
  description: string;
  result?: string;
  location?: Location[];
}

export interface ReconciliationTable {
  title?: string;
  columns: string[];
  rows: (string | number)[][];
}

export interface SectionA {
  title: string;
  content?: string;
  items: CorrectItem[];
}

export interface SectionB {
  title: string;
  content?: string;
  items: CriticalError[];
}

export interface SectionC {
  title: string;
  content?: string;
  items: DisclosureBreach[];
}

export interface SectionD {
  title: string;
  content?: string;
  tables: Record<string, ReconciliationTable>;
}

export interface SectionE {
  verdict: string;
  executive_summary?: string;
  document_url?: string;
}

export interface ReviewResult {
  A: SectionA;
  B: SectionB;
  C: SectionC;
  D: SectionD;
  E: SectionE;
}

export interface TestResult {
  id: string;
  testCaseId: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  annotated_image_url?: string;
  extractedValues?: Record<string, any>;
}

export interface ReviewResponse {
  id: string;
  status: string;
  review_result: TestResult[];
  created_at: string;
}
