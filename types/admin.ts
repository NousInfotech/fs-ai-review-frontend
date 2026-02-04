export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';

export interface PlatformUser {
  _id: string;
  name?: string;
  email: string;
  role?: AdminRole;
  active?: boolean;
  created_at: string;
  uploadsUsed?: number;
  firebaseUid?: string;
  last_login?: string;
}

export interface TestCase {
  _id: string;
  test_id: string;
  description: string;
  severity: string;
  category: string;
  enabled: boolean;
  version: number;
  countryCode?: "US" | "IN" | "GB";
  companyType?: "LISTED" | "PRIVATE" | "BANKING" | "INSURANCE";
  accountingStandard?: "IFRS" | "US_GAAP" | "IND_AS";
  regulator?: "SEC" | "SEBI" | "MCA";
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  _id: string;
  actor_id: string;
  actor_name?: string; // Hydrated on frontend if needed
  role: AdminRole;
  action: string;
  metadata?: any;
  timestamp: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTestCases: number;
  activeTestCases: number;
  recentActions: AuditLog[];
}
