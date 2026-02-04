"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { CheckCircle, Loader2, Circle, FileText } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";

interface ProcessingStatus {
  id: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  // Add other fields if returned by API, e.g., fileHash, filename
}

const fetchStatus = async (uploadId: string): Promise<ProcessingStatus> => {
  const response = await api.get(`/api/v1/reviews/${uploadId}`);
  return response.data;
};

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const uploadId = params.uploadId as string;

  // Prevent API calls for the deprecated mock ID
  const isMockId = uploadId === 'mock-upload-id-123';

  // Real polling query
  const { data: statusData, error } = useQuery({
    queryKey: ['processingStatus', uploadId],
    queryFn: () => fetchStatus(uploadId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
        return false;
      }
      return 2000;
    },
    enabled: !!uploadId && !isMockId, 
  });

  useEffect(() => {
    if (isMockId) {
        // Redirect deprecated mock ID to dashboard or show error
        // We'll let the UI handle it below for clarity
        return;
    }
    if (statusData?.status === 'COMPLETED') {
      router.push(`/results/${uploadId}`);
    }
  }, [statusData, router, uploadId, isMockId]);

  if (isMockId) {
     return (
        <PortalLayout title="Processing" description="Invalid Session">
          <div className="flex flex-col justify-center items-center py-12">
             <div className="text-yellow-600 text-lg font-medium mb-2">Demo Session Expired</div>
             <p className="text-gray-500 mb-4">The ID {uploadId} is no longer valid.</p>
             <button onClick={() => router.push('/dashboard')} className="text-indigo-600 underline">Start New Review</button>
          </div>
        </PortalLayout>
     )
  }

  if (error) {
     return (
        <PortalLayout title="Processing" description="Error">
          <div className="flex flex-col justify-center items-center py-12">
             <div className="text-red-500 mb-4">Failed to check processing status.</div>
             <button onClick={() => window.location.reload()} className="text-indigo-600 underline">Retry</button>
          </div>
        </PortalLayout>
     )
  }

  const isFailed = statusData?.status === 'FAILED';

  return (
    <PortalLayout title="Processing" description="Analyzing your document">
      <div className="flex flex-col justify-center items-center py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg audit-card p-8 relative overflow-hidden"
        >
          {isFailed ? (
            <div className="text-center">
                <div className="text-red-600 text-xl font-bold mb-2">Processing Failed</div>
                <p className="text-gray-500">There was an error processing your document. Please try again.</p>
            </div>
          ) : (
          <>
          <div className="text-center mb-8">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-6 border border-indigo-100"
            >
              <FileText className="w-10 h-10 text-indigo-600" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              Processing Document
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              AI Analysis in progress...
            </p>
          </div>

          {/* Simple Progress Indication */}
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 h-full bg-indigo-600"
            />
          </div>
          </>
          )}
        </motion.div>
      </div>
    </PortalLayout>
  );
}
