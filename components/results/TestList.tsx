"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ReviewResult } from "@/types/review";
import VerdictSection from "./VerdictSection";
import { Loader2, CheckCircle, AlertCircle, AlertTriangle, ClipboardList } from "lucide-react";
import FinancialStatusReport from "../fs-review/FinancialStatusReport";
import mockReport from "@/data/fs/mockReportFullyFailed.json";

interface TestListProps {
  uploadId: string;
}

const fetchReport = async (uploadId: string): Promise<ReviewResult> => {
  const response = await api.get(`/api/v1/reviews/${uploadId}/report`);
  return response.data;
};

const SHOW_MOCK_DATA = true;

export default function TestList({ uploadId }: TestListProps) {
  const { data: realData, isLoading, error } = useQuery({
    queryKey: ['reviewReport', uploadId],
    queryFn: () => fetchReport(uploadId),
    enabled: !SHOW_MOCK_DATA,
  });

  if (isLoading && !SHOW_MOCK_DATA) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const activeData = SHOW_MOCK_DATA ? (mockReport as unknown as ReviewResult) : realData;

  if (!activeData && !error) {
     return <div className="text-center py-12 text-gray-500">No data available.</div>;
  }

  return (
    <div className="space-y-8">
      {activeData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Tests</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {(activeData.A.items.length || 0) + (activeData.B.items.length || 0) + (activeData.C.items.length || 0)}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Correct Items</p>
              <h3 className="text-2xl font-bold text-gray-900">{activeData.A.items.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Critical Errors</p>
              <h3 className="text-2xl font-bold text-gray-900">{activeData.B.items.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Regulatory Breaches</p>
              <h3 className="text-2xl font-bold text-gray-900">{activeData.C.items.length}</h3>
            </div>
          </div>
        </div>
      )}

      {activeData && (
        <VerdictSection data={activeData.E} criticalErrors={activeData.B} />
      )}

      {activeData ? (
        <FinancialStatusReport data={activeData} />
      ) : (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load detailed report.</p>
        </div>
      )}
    </div>
  );
}
