"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download
} from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import api from "@/lib/api";
import { StandardizedResultResponse, HistoryDocument } from "@/lib/types";
import { clsx } from "clsx";
import TestList from "@/components/results/TestList";
import { generateDisplayId } from "@/lib/utils";
// import { downloadAuditReport } from "@/lib/pdfGenerator";

const fetchResults = async (uploadId: string): Promise<StandardizedResultResponse> => {
  try {
    const response = await api.get(`/api/v1/reviews/${uploadId}/result`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch results", error);
    throw error;
  }
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
  // const [isDownloading, setIsDownloading] = useState(false);
  
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

  // const handleDownload = async () => {
  //   try {
  //     if (!metadata) {
  //       throw new Error("Metadata not available");
  //     }

  //     setIsDownloading(true);
      
  //     const safeCompanyName = (metadata.companyName || 'Company').replace(/\s+/g, '_');
  //     const safeDate = (metadata.documentDate || 'Date').replace(/\//g, '-');
  //     const filename = `Audit_Report_${safeCompanyName}_${safeDate}.pdf`;

  //     // Download PDF
  //     await downloadAuditReport(uploadId, filename);
      
  //   } catch (error) {
  //     console.error("Failed to download PDF", error);
  //     alert("Failed to download the report. Please try again.");
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Loading Results...</h3>
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

  // Use metadata if available, otherwise fallback to basic info
  const displayTitle = metadata?.companyName && metadata.companyName !== "Unknown Company" 
    ? `${metadata.companyName} - Audit Results` 
    : "Audit Results";
    
  const displayId = metadata?.displayId || generateDisplayId(uploadId);

  return (
    <PortalLayout 
      title={displayTitle}
      description={`Analysis Report ID: ${displayId}`}
    >
      {/* Header Actions */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-5">
          <div className="flex items-center gap-3">
            <div className={clsx(
              "px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2",
              results.status === 'COMPLETED' ? "bg-green-100 text-green-700" : 
              results.status === 'FAILED' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
            )}>
              {results.status === 'COMPLETED' && <CheckCircle className="h-4 w-4" />}
              {results.status === 'FAILED' && <XCircle className="h-4 w-4" />}
              {results.status === 'PROCESSING' && <Loader2 className="h-4 w-4 animate-spin" />}
              {results.status}
            </div>

            {/* <button
              onClick={handleDownload}
              disabled={true} // Temporarily disabled as requested
              title="Download is currently unavailable"
              className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-sm font-medium transition-colors cursor-not-allowed border border-gray-200"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download Report
            </button> */}
          </div>
          
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            Processed in <span className="font-bold ml-1">{results.processingTimeSeconds}s</span>
          </div>
         </div>

      {/* Results Groups */}
      <TestList uploadId={uploadId} />
    </PortalLayout>
  );
}
