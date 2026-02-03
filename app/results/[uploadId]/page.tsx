"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";
import api from "@/lib/api";
import { ReviewResult } from "@/types/review";
import VerdictSection from "@/components/results/VerdictSection";
import CriticalErrors from "@/components/results/CriticalErrors";
import DisclosureBreaches from "@/components/results/DisclosureBreaches";
import ReconciliationTables from "@/components/results/ReconciliationTables";
import CorrectItems from "@/components/results/CorrectItems";

// Mock Data for testing
const MOCK_DATA: ReviewResult = {
  "A": {
    "title": "CONFIRMED CORRECT ITEMS",
    "items": [
      {
        "test_id": "T1",
        "category": "GENERAL",
        "area": "Visual Layout Integrity",
        "details": "Document layout matches standard requirements."
      }
    ]
  },
  "B": {
    "title": "CRITICAL ERRORS",
    "items": [
      {
        "id": "B1",
        "test_id": "T4",
        "category": "BALANCE_SHEET",
        "type": "arithmetical",
        "severity": "critical",
        "description": "Balance sheet does not balance.",
        "location": {
          "page": 7,
          "section": "Equity",
          "note": null,
          "line_hint": "Total Equity"
        },
        "reported_value": 52000,
        "expected_value": 50000,
        "difference": 2000,
        "reason": "Summation error in retained earnings.",
        "financial_impact": "Overstatement of equity by 2000.",
        "suggested_fix": "Correct the retained earnings summation."
      }
    ]
  },
  "C": {
    "title": "DISCLOSURE & REGULATORY BREACHES",
    "items": []
  },
  "D": {
    "title": "RECONCILIATION TABLES",
    "tables": {
      "equity": {
        "columns": ["2024", "2023"],
        "rows": [
          { "description": "Share capital", "values": [1200, 1200] },
          { "description": "Retained earnings", "values": [49000, 45000] }
        ]
      }
    }
  },
  "E": {
    "title": "FINAL VERDICT",
    "verdict": "FINANCIAL STATEMENTS ARE NOT FIT FOR APPROVAL – ERRORS PRESENT"
  }
};

const fetchResults = async (uploadId: string): Promise<ReviewResult> => {
  // In a real scenario, uncomment the API call:
  // try {
  //   const response = await api.get(`/reviews/${uploadId}`);
  //   return response.data.review_result;
  // } catch (error) {
  //   console.error("Failed to fetch results, using mock data", error);
  //   return MOCK_DATA;
  // }
  
  // For now, return mock data to simulate API response
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DATA), 1000);
  });
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const uploadId = params.uploadId as string;

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['reviewResults', uploadId],
    queryFn: () => fetchResults(uploadId),
  });

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Loading Results...</h3>
            <p className="text-gray-500">Retrieving detailed analysis report</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (error || !results) {
    return (
      <PortalLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600">Error Loading Results</h3>
          <p className="text-gray-500 mb-4">Could not retrieve the analysis data.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout 
      title="Review Results" 
      description={`Analysis Report ID: ${uploadId}`}
    >
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          Download PDF Report
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 1. Header / Verdict (Section E) */}
        {results.E && <VerdictSection data={results.E} criticalErrors={results.B} />}

        {/* 2. Critical Errors (Section B) */}
        {results.B && <CriticalErrors data={results.B} />}

        {/* 3. Disclosure & Regulatory Breaches (Section C) */}
        {results.C && <DisclosureBreaches data={results.C} />}

        {/* 4. Reconciliation Tables (Section D) */}
        {results.D && <ReconciliationTables data={results.D} />}

        {/* 5. Confirmed Correct Items (Section A) */}
        {results.A && <CorrectItems data={results.A} />}
      </motion.div>
    </PortalLayout>
  );
}
