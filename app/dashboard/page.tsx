"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, UploadCloud, FileText, CheckCircle, AlertTriangle, Bell, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import Dropzone from "@/components/upload/Dropzone";
import api from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { credits, deductCredit } = useAuth();

  // Fetch real dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const response = await api.get('/dashboard/stats');
        return response.data;
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        // Return zeroed stats on error to prevent UI crash
        return {
          totalReviews: 0,
          completed: 0,
          actionRequired: 0
        };
      }
    },
    // Refresh stats every minute
    refetchInterval: 60000,
  });

  const uploadMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      // Mock implementation for frontend demo without backend
      // In a real app, this would be:
      // const formData = new FormData();
      // formData.append("file", fileToUpload);
      // const response = await api.post("/upload", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      // return response.data;

      return new Promise<{ uploadId: string }>((resolve) => {
        setTimeout(() => {
          resolve({ uploadId: "mock-upload-id-123" });
        }, 1500);
      });
    },
    onSuccess: (data) => {
      // Deduct credit on successful upload
      deductCredit();
      // Assuming backend returns { uploadId: '...' }
      router.push(`/processing/${data.uploadId}`);
    },
    onError: (error) => {
      console.error("Upload failed", error);
    },
  });

  const handleUpload = () => {
    if (file && credits > 0) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <PortalLayout 
      title="Main Dashboard" 
      description="Overview of your financial review activities"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="audit-card p-6 flex items-center justify-between">
           <div>
             <div className="text-[var(--color-text-secondary)] text-sm font-medium uppercase tracking-wide">Total Reviews</div>
             <div className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">
               {statsLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : (stats?.totalReviews || 0)}
             </div>
           </div>
           <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-[var(--color-accent)]">
             <FileText className="h-6 w-6" />
           </div>
         </div>

         <div className="audit-card p-6 flex items-center justify-between">
           <div>
             <div className="text-[var(--color-text-secondary)] text-sm font-medium uppercase tracking-wide">Completed</div>
             <div className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">
               {statsLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : (stats?.completed || 0)}
             </div>
           </div>
           <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-green-600">
             <CheckCircle className="h-6 w-6" />
           </div>
         </div>

         <div className="audit-card p-6 flex items-center justify-between">
           <div>
             <div className="text-[var(--color-text-secondary)] text-sm font-medium uppercase tracking-wide">Action Required</div>
             <div className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">
               {statsLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : (stats?.actionRequired || 0)}
             </div>
           </div>
           <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-yellow-600">
             <AlertTriangle className="h-6 w-6" />
           </div>
         </div>
      </div>

      {/* Main CTA Section - Now with Direct Upload */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="audit-card p-8 text-center border-2 border-dashed border-gray-300 hover:border-[var(--color-accent)] transition-colors group"
      >
        <div className="max-w-2xl mx-auto">
          {!file ? (
            <>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                Start a New Financial Review
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Upload your financial statements (PDF) for instant AI analysis, risk detection, and compliance checking.
              </p>
              
              <div className="bg-gray-50/50 rounded-2xl">
                <Dropzone
                  onFileSelect={setFile}
                  selectedFile={file}
                  onClear={() => setFile(null)}
                />
              </div>
            </>
          ) : (
            <div className="bg-gray-50/50 rounded-2xl p-2">
              <Dropzone
                onFileSelect={setFile}
                selectedFile={file}
                onClear={() => setFile(null)}
              />
              
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="w-full max-w-sm flex justify-center items-center py-3 px-6 rounded-xl shadow-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Start Review Process
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          )}
          
          {uploadMutation.isError && (
             <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
               Upload failed. Please try again.
             </div>
          )}
        </div>
      </motion.div>
    </PortalLayout>
  );
}