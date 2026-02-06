export interface ExtractedValues {
  section: "A" | "B" | "C" | "D" | "E"; // A=Pass, B=Critical, C=Warning
  category?: string; // e.g., "BALANCE_SHEET", "GENERAL"
  reported_value?: number | string;
  expected_value?: number | string;
  difference?: number | string;
  financial_impact?: string;
  suggested_fix?: string;
  error_id?: string; // e.g., "B1"
}

export interface TestResult {
  _id: string; // Unique ID for the result
  testCaseId: string; // e.g., "T1", "T4"
  status: "PASS" | "FAIL" | "WARNING" | "CRITICAL";
  message: string; // The main finding description
  annotated_image_url?: string; // URL to the evidence image (red box)
  extractedValues: ExtractedValues;
}

export interface HistoryDocument {
  id: string; // Internal ID (could be _id mapped to id)
  displayId?: string; // User-friendly ID e.g. DOC-2026-00125
  companyName: string; // Extracted company name
  documentDate: string; // Extracted document date
  uploadDate: string; // Upload timestamp
  fileUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalPages: number;
}

export interface CreditStats {
  total: number;
  used: number;
  remaining: number;
}

export interface DashboardStats {
  totalDocuments: number;
  completedReviews: number;
  processingReviews: number;
  issuesFound: number;
  accuracy: string;
  credits: CreditStats;
}

export interface StandardizedResultResponse {
  uploadId: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  processingTimeSeconds: number; // e.g., 12.5
  results: TestResult[];
}
