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
  status: 'queued' | 'ocr' | 'analyzing' | 'completed' | 'failed';
  progress: number;
  stage: string;
}

// Mock API function (in reality this would be in api.ts or inline)
const fetchStatus = async (uploadId: string): Promise<ProcessingStatus> => {
  const response = await api.get(`/processing/${uploadId}`);
  return response.data;
};

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const uploadId = params.uploadId as string;

  // Simulate progress for demo purposes if backend is not ready
  const [mockStatus, setMockStatus] = useState<ProcessingStatus>({
    status: 'queued',
    progress: 0,
    stage: 'Initializing...'
  });

  // Real polling query
  const { data: statusData } = useQuery({
    queryKey: ['processingStatus', uploadId],
    queryFn: () => fetchStatus(uploadId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return 5000;
    },
    enabled: false, 
  });

  // Simulation effect for demo
  useEffect(() => {
    const stages: ProcessingStatus[] = [
      { status: 'ocr', progress: 25, stage: 'Extracting text from PDF (OCR)...' },
      { status: 'analyzing', progress: 50, stage: 'Analyzing financial statements...' },
      { status: 'analyzing', progress: 75, stage: 'Running compliance tests...' },
      { status: 'completed', progress: 100, stage: 'Analysis complete!' },
    ];

    let currentStage = 0;
    
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setMockStatus(stages[currentStage]);
        if (stages[currentStage].status === 'completed') {
           setTimeout(() => {
             router.push(`/results/${uploadId}`);
           }, 1000);
           clearInterval(interval);
        }
        currentStage++;
      }
    }, 3000); 

    return () => clearInterval(interval);
  }, [router, uploadId]);

  const currentStatus = statusData || mockStatus;

  const steps = [
    { name: 'Upload Received', status: 'complete' },
    { name: 'OCR Processing', status: currentStatus.progress >= 25 ? (currentStatus.progress > 25 ? 'complete' : 'current') : 'upcoming' },
    { name: 'AI Analysis', status: currentStatus.progress >= 50 ? (currentStatus.progress > 75 ? 'complete' : 'current') : 'upcoming' },
    { name: 'Generating Report', status: currentStatus.progress === 100 ? 'complete' : 'upcoming' },
  ];

  return (
    <PortalLayout title="Processing" description="Analyzing your document">
      <div className="flex flex-col justify-center items-center py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg audit-card p-8 relative overflow-hidden"
        >
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
              {currentStatus.stage}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentStatus.progress}%` }}
              transition={{ duration: 0.5 }}
              className="absolute top-0 left-0 h-full bg-indigo-600"
            />
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.name} className="flex items-center">
                <div className="flex-shrink-0 relative">
                  {step.status === 'complete' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </motion.div>
                  ) : step.status === 'current' ? (
                    <div className="h-8 w-8 rounded-full border-2 border-indigo-500 flex items-center justify-center relative">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-2.5 w-2.5 rounded-full bg-indigo-500"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <Circle className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                  
                  {index !== steps.length - 1 && (
                    <div className={clsx(
                      "absolute top-8 left-1/2 -translate-x-1/2 h-6 w-0.5",
                      step.status === 'complete' ? "bg-green-200" : "bg-gray-100"
                    )} />
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <p className={clsx(
                    "text-sm font-medium",
                    step.status === 'complete' ? "text-[var(--color-text-primary)]" : 
                    step.status === 'current' ? "text-indigo-600" : "text-gray-400"
                  )}>
                    {step.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </PortalLayout>
  );
}
