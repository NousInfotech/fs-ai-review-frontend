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
  name: string;
  description: string;
  promptTemplate: string;
  ruleType: 'COMPLIANCE' | 'ARITHMETIC';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'AUDIT_REPORT' | 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'GENERAL' | 'NOTES_AND_POLICY' | 'CROSS_STATEMENT' | 'PRESENTATION';
  enabled: boolean;
  version: number;
  applicableCountries: string[];
  applicableCompanyTypes: string[];
  applicableAccountingStandards: string[];
  regulator?: string;
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
