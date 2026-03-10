"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import PortalLayout from "@/components/PortalLayout";
import { FileText, Loader2, XCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PROCESSING_STEPS = [
  { id: 1, label: "System Initialization" },
  { id: 2, label: "OCR & Text Extraction" },
  { id: 3, label: "Layout Analysis" },
  { id: 4, label: "Financial Data Extraction" },
  { id: 5, label: "Data Normalization" },
  { id: 6, label: "Arithmetic Verification" },
  { id: 7, label: "Compliance Checks" },
  { id: 8, label: "Report Compilation" },
];

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const uploadId = params.uploadId as string;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { data: statusData, isError, error } = useQuery({
    queryKey: ['processingStatus', uploadId],
    queryFn: async () => {
      const response = await api.get<{ status: string; error?: string }>(`/api/v1/reviews/${uploadId}`);
      return response.data;
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'COMPLETED' || data?.status === 'FAILED') return false;
      return 2000;
    },
    refetchIntervalInBackground: true
  });

  useEffect(() => {
    if (statusData?.status === 'COMPLETED') {
      const interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= PROCESSING_STEPS.length - 1) {
            clearInterval(interval);
            setTimeout(() => router.push(`/results/${uploadId}`), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    } else if (statusData?.status === 'FAILED' || isError) {
      // Handle failure
    } else {
      const interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= PROCESSING_STEPS.length - 2) return prev; 
          return prev + 1;
        });
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [statusData?.status, router, uploadId]);

  return (
    <PortalLayout title="Processing Document" description="AI analysis is in progress. This usually takes 30-60 seconds.">
      <div className="max-w-2xl mx-auto py-12">
        <div className="audit-card w-full overflow-hidden flex flex-col items-center">
          
          {statusData?.status === 'FAILED' || isError ? (
            <div className="p-12 flex flex-col items-center justify-center text-center w-full">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Processing Failed</h2>
              <p className="text-slate-500 mb-8 max-w-sm">
                We encountered an error while processing your document. This could be due to file corruption or an unsupported format.
              </p>
              <div className="flex gap-4 w-full">
                <button onClick={() => router.push('/dashboard')} className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Back to Dashboard
                </button>
                <button onClick={() => router.push('/upload')} className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="p-10 border-b border-slate-100 bg-slate-50/50 text-center flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-3xl bg-blue-100 flex items-center justify-center mb-6 shadow-inner border border-blue-200/50"
                >
                  <FileText className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                </motion.div>
                
                <h2 className="text-xl font-bold text-slate-800 mb-2">Analyzing Financial Document</h2>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Our AI is performing a comprehensive review of your uploaded file.
                </p>
              </div>

              <div className="p-10 flex flex-col items-center justify-center min-h-[250px]">
                 <AnimatePresence mode="wait">
                   <motion.div 
                     key={currentStepIndex}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.2 }}
                     className="flex flex-col items-center text-center space-y-4 w-full"
                   >
                     <div className="relative mb-2">
                       <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30"></div>
                       <div className="relative bg-white p-4 rounded-full border-2 border-blue-100 shadow-sm text-blue-600">
                         {currentStepIndex === PROCESSING_STEPS.length - 1 ? (
                            <CheckCircle2 className="w-8 h-8" />
                         ) : (
                            <Loader2 className="w-8 h-8 animate-spin" />
                         )}
                       </div>
                     </div>

                     <div className="space-y-1 w-full">
                       <div className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
                         Step {currentStepIndex + 1} of {PROCESSING_STEPS.length}
                       </div>
                       <h3 className="text-lg font-bold text-slate-800">
                         {PROCESSING_STEPS[currentStepIndex].label}
                       </h3>
                     </div>
                   </motion.div>
                 </AnimatePresence>
                 
                 {/* Static minimal progress bar over overall steps */}
                 <div className="mt-10 flex w-full max-w-xs gap-1">
                   {PROCESSING_STEPS.map((_, i) => (
                     <div 
                       key={i} 
                       className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= currentStepIndex ? 'bg-blue-600' : 'bg-slate-100'}`}
                     />
                   ))}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
