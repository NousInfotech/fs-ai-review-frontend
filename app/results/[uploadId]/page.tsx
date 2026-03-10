"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock 
} from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import api from "@/lib/api";
import { StandardizedResultResponse, HistoryDocument } from "@/lib/types";
import { clsx } from "clsx";
import TestList from "@/components/results/TestList";
import { generateDisplayId } from "@/lib/utils";

const fetchResults = async (uploadId: string): Promise<StandardizedResultResponse> => {
  const response = await api.get(`/api/v1/reviews/${uploadId}/result`);
  return response.data;
};

const fetchReviewMetadata = async (uploadId: string): Promise<HistoryDocument> => {
  const response = await api.get(`/api/v1/reviews/${uploadId}`);
  const item = response.data;
  const id = item.id || item._id || uploadId;
  return {
    id: id,
    displayId: item.displayId || generateDisplayId(id),
    companyName: item.companyName || "Unknown Company",
    documentDate: item.documentDate || "Date Not Found",
    uploadDate: item.createdAt || new Date().toISOString(),
    fileUrl: item.fileUrl,
    status: item.status,
    totalPages: item.totalPages || 0
  };
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const uploadId = params.uploadId as string;
  
  const { data: results, isLoading: isLoadingResults, error: resultsError } = useQuery({
    queryKey: ['reviewResults', uploadId],
    queryFn: () => fetchResults(uploadId),
  });

  const { data: metadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ['reviewMetadata', uploadId],
    queryFn: () => fetchReviewMetadata(uploadId),
  });

  const isLoading = isLoadingResults || isLoadingMetadata;
  const error = resultsError;

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center h-[60vh] w-full">
          <div className="audit-card w-full max-w-md p-12 text-center flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Loading Results...</h3>
            <p className="text-sm text-slate-500 mt-2">Compiling the analysis and generating reports.</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (error || !results) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center h-[60vh] w-full">
          <div className="audit-card w-full max-w-md p-12 text-center flex flex-col items-center">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">Error Loading Results</h3>
            <p className="text-sm text-slate-500 mt-2 mb-6">Could not retrieve the analysis data.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const displayTitle = metadata?.companyName && metadata.companyName !== "Unknown Company" 
    ? `${metadata.companyName} - Audit Results` 
    : "Audit Results";
  const displayId = metadata?.displayId || generateDisplayId(uploadId);

  return (
    <PortalLayout title={displayTitle} description={`Analysis Report ID: ${displayId}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 audit-card p-4 mb-6 relative">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "px-4 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-2 border shadow-sm",
              results.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
              results.status === 'FAILED' ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"
            )}>
              {results.status === 'COMPLETED' && <CheckCircle className="h-4 w-4" />}
              {results.status === 'FAILED' && <XCircle className="h-4 w-4" />}
              {results.status === 'PROCESSING' && <Loader2 className="h-4 w-4 animate-spin" />}
              {results.status}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
            <Clock className="w-4 h-4 mr-2.5 text-slate-400" />
            Processed in <span className="font-bold text-slate-700 ml-1.5">{results.processingTimeSeconds}s</span>
          </div>
        </div>

      <TestList uploadId={uploadId} />
    </PortalLayout>
  );
}
