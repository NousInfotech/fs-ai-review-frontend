"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, UploadCloud, FileText, CheckCircle, AlertTriangle, Bell, Loader2, Target, CreditCard, Clock } from "lucide-react";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import Dropzone from "@/components/upload/Dropzone";
import api from "@/lib/api";
import { DashboardStats, HistoryDocument } from "@/lib/types";
import { clsx } from "clsx";
import { toast } from "react-hot-toast";
import HistoryList from "@/components/history/HistoryList";
import { generateDisplayId } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { credits, setCredits, deductCredit } = useAuth();

  // Fetch real dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/dashboard/stats');
        return response.data;
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        throw error;
      }
    },
    // Refresh stats every minute
    refetchInterval: 60000,
  });

  // Fetch recent reviews
  const { data: recentReviews, isLoading: reviewsLoading } = useQuery<HistoryDocument[]>({
    queryKey: ['recentReviews'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/reviews/');
        // Transform and slice top 5
        const allReviews = (response.data as any[]).map(item => {
          const id = item.id || item._id;
          
          // Robust extraction of company name and date from various possible fields
          const companyName = 
            item.companyName || 
            item.company_name || 
            item.metadata?.companyName || 
            item.metadata?.company_name || 
            "Unknown Company";

          const documentDate = 
            item.documentDate || 
            item.document_date || 
            item.metadata?.documentDate || 
            item.metadata?.document_date || 
            "Date Not Found";

          return {
            id: id,
            displayId: item.displayId || generateDisplayId(id),
            companyName: companyName,
            documentDate: documentDate,
            uploadDate: item.createdAt || new Date().toISOString(),
            fileUrl: item.fileUrl,
            status: item.status,
            totalPages: item.totalPages || 0
          } as HistoryDocument;
        });
        return allReviews.slice(0, 5);
      } catch (error) {
        console.error("Failed to fetch recent reviews", error);
        return [];
      }
    },
  });

  // Sync credits with stats
  useEffect(() => {
    if (stats?.credits) {
      setCredits(stats.credits.remaining);
    }
  }, [stats, setCredits]);

  const uploadMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      
      const response = await api.post("/api/v1/upload", formData);
      console.log("Upload response full data:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      // Deduct credit on successful upload
      deductCredit();
      
      console.log("Upload onSuccess data:", data);

      // Ensure we capture the ID correctly from backend response
      // Backend returns { id: "..." }
      const uploadId = data.id || data._id || data.upload_id;
      
      if (!uploadId) {
        console.error("Upload ID missing in response:", data);
        // Alert user if in dev, or show UI error
        return;
      }
      
      router.push(`/processing/${uploadId}`);
    },
    onError: (error: any) => {
      console.error("Upload failed", error);
      if (error.response?.status === 402) {
        toast.error("Insufficient credits. Please contact support or upgrade.");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    },
  });

  const handleUpload = () => {
    if (credits <= 0) {
      toast.error("You have used all your free credits.");
      return;
    }
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <PortalLayout 
      title="Analytics" 
      description="Overview of your financial review activities"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="audit-card p-6 flex items-center justify-between">
           <div>
             <div className="text-[var(--color-text-secondary)] text-sm font-medium uppercase tracking-wide">Total Documents</div>
             <div className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">
               {statsLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : (stats?.totalDocuments || 0)}
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
               {statsLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : (stats?.completedReviews || 0)}
             </div>
           </div>
           <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-green-600">
             <CheckCircle className="h-6 w-6" />
           </div>
         </div>

         <div className="audit-card p-6 flex items-center justify-between">
           <div>
             <div className="text-[var(--color-text-secondary)] text-sm font-medium uppercase tracking-wide">Issues Found</div>
             <div className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">
               {statsLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : (stats?.issuesFound || 0)}
             </div>
           </div>
           <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-sm text-yellow-600">
             <AlertTriangle className="h-6 w-6" />
           </div>
         </div>

         <div className="audit-card p-6 flex items-center justify-between">
           <div>
             <div className="text-[var(--color-text-secondary)] text-sm font-medium uppercase tracking-wide">Credits Left</div>
             <div className="flex items-baseline gap-2 mt-1">
               <div className={clsx(
                 "text-3xl font-bold",
                 (stats?.credits?.remaining || 0) < 1 ? "text-red-600" : "text-[var(--color-text-primary)]"
               )}>
                 {statsLoading ? <Loader2 className="h-8 w-8 animate-spin text-gray-300" /> : (stats?.credits?.remaining ?? credits)}
               </div>
               {!statsLoading && stats?.credits && (
                 <div className="text-sm text-gray-500 font-medium">
                   / {stats.credits.total}
                 </div>
               )}
             </div>
             {!statsLoading && stats?.credits && (
               <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                 <div 
                   className={clsx(
                     "h-1.5 rounded-full transition-all duration-500",
                     stats.credits.remaining < 1 ? "bg-red-500" : "bg-blue-500"
                   )}
                   style={{ width: `${(stats.credits.remaining / stats.credits.total) * 100}%` }}
                 />
               </div>
             )}
           </div>
           <div className={clsx(
             "p-3 rounded-xl bg-white border border-gray-100 shadow-sm",
             (stats?.credits?.remaining || 0) < 1 ? "text-red-600" : "text-blue-600"
           )}>
             <CreditCard className="h-6 w-6" />
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
                  disabled={uploadMutation.isPending || credits <= 0}
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

      {/* Recent Activity Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Recent Activity</h2>
          <Link 
            href="/history" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            View all history
            <Target className="h-4 w-4" />
          </Link>
        </div>
        
        <HistoryList documents={recentReviews || []} isLoading={reviewsLoading} />
      </div>
    </PortalLayout>
  );
}