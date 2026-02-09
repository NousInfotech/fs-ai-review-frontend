"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import PortalLayout from "@/components/PortalLayout";
import { FileText, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

// Detailed processing steps
const PROCESSING_STEPS = [
  { id: 1, label: "System Initialization" },
  { id: 2, label: "OCR & Text Extraction" },
  { id: 3, label: "Layout Analysis" },
  { id: 4, label: "Financial Data Extraction" },
  { id: 5, label: "Data Normalization" },
  { id: 6, label: "Arithmetic Verification" },
  { id: 7, label: "Compliance Checks" },
  { id: 8, label: "Evidence Generation" },
  { id: 9, label: "Report Compilation" },
];

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const uploadId = params.uploadId as string;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Poll for status
  const { data: statusData, isError, error } = useQuery({
    queryKey: ['processingStatus', uploadId],
    queryFn: async () => {
      // Use the main review endpoint which returns the document status
      const response = await api.get<{ status: string; error?: string }>(`/api/v1/reviews/${uploadId}`);
      return response.data;
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    refetchIntervalInBackground: true
  });

  // Handle completion and simulation
  useEffect(() => {
    if (statusData?.status === 'COMPLETED') {
      // Fast-forward steps to completion if backend finishes early
      const interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= PROCESSING_STEPS.length - 1) {
            clearInterval(interval);
            setTimeout(() => router.push(`/results/${uploadId}`), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 100); // Fast transition
      return () => clearInterval(interval);
    } else if (statusData?.status === 'FAILED' || isError) {
      // Failure handled in render
    } else {
      // Simulate steady progress if still processing
      const interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          // Don't advance past the last step until COMPLETED signal
          if (prev >= PROCESSING_STEPS.length - 2) return prev; 
          return prev + 1;
        });
      }, 2500); // Advance every 2.5 seconds
      return () => clearInterval(interval);
    }
  }, [statusData?.status, router, uploadId]);

  return (
    <PortalLayout 
      title="Processing Document" 
      description="AI analysis is in progress. This usually takes 30-60 seconds."
    >
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          {statusData?.status === 'FAILED' || isError ? (
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4"
              >
                <XCircle className="w-10 h-10 text-red-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900">Processing Failed</h2>
              <p className="text-gray-500 max-w-md">
                {statusData?.error || (isError ? "Unable to connect to the server." : "We encountered an error while processing your document. This could be due to file corruption or an unsupported format.")}
              </p>
              {isError && error && (
                 <p className="text-xs text-red-400 bg-red-50 p-2 rounded">
                    Technical details: {String(error)}
                 </p>
              )}
              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  Return to Analytics
                </Button>
                <Button onClick={() => router.push('/upload')}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="p-8 border-b border-gray-100 bg-gray-50/50 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-6 border border-indigo-100 shadow-inner"
                >
                  <FileText className="w-10 h-10 text-indigo-600" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Analyzing Financial Document
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Our AI is performing a comprehensive review of your uploaded file.
                </p>
              </div>

              {/* Steps List */}
              <div className="p-12 flex flex-col items-center justify-center min-h-[300px]">
                 <div className="w-full max-w-md">
                   <AnimatePresence mode="wait">
                     <motion.div 
                       key={currentStepIndex}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       transition={{ duration: 0.3 }}
                       className="flex flex-col items-center text-center space-y-6"
                     >
                       {/* Animated Icon */}
                       <div className="relative">
                         <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
                         <div className="relative bg-white p-4 rounded-full border-2 border-indigo-100 shadow-sm">
                           <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                         </div>
                       </div>

                       {/* Step Info */}
                       <div className="space-y-2">
                         <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                           Step {currentStepIndex + 1} of {PROCESSING_STEPS.length}
                         </div>
                         <h3 className="text-xl font-bold text-gray-900">
                           {PROCESSING_STEPS[currentStepIndex].label}
                         </h3>
                         <p className="text-sm text-gray-500">
                           Please wait while we process your document...
                         </p>
                       </div>
                     </motion.div>
                   </AnimatePresence>
                 </div>
              </div>
              
              {/* Footer Progress Bar */}
              <div className="relative h-1.5 bg-gray-100 w-full">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-indigo-600"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: `${((currentStepIndex + 1) / PROCESSING_STEPS.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
