"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, ChevronRight, Search, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";
import api from "@/lib/api";
import { format } from "date-fns";

interface ReviewHistoryItem {
  id: string;
  _id?: string;
  userId: string;
  fileHash: string;
  fileUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalPages: number;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();

  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/reviews/');
        // Handle potential _id/id mismatch from backend
        return (response.data as any[]).map(item => ({
          ...item,
          id: item.id || item._id
        })) as ReviewHistoryItem[];
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        throw error;
      }
    }
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return dateString;
    }
  };

  const getFilename = (url: string) => {
    if (!url) return null;
    try {
      const decoded = decodeURIComponent(url);
      return decoded.split('/').pop() || null;
    } catch {
      return url.split('/').pop() || null;
    }
  };

  return (
    <PortalLayout 
      title="History" 
      description="View all your past financial statement reviews"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search files..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-[var(--color-accent)]" />
          <p>Loading your history...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertCircle className="h-10 w-10 mb-4" />
          <p>Failed to load history. Please try again later.</p>
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <FileText className="h-12 w-12 mb-4 opacity-20" />
          <p>No reviews found.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={item}
              whileHover={{ y: -5 }}
              onClick={() => router.push(`/results/${review.id}`)}
              className="audit-card p-6 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
              </div>
              
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  review.status === 'COMPLETED' ? 'bg-indigo-50 text-indigo-600' :
                  review.status === 'PROCESSING' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  <FileText className="h-6 w-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  review.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                  review.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                  'bg-red-100 text-red-700 border-red-200'
                }`}>
                  {review.status.charAt(0).toUpperCase() + review.status.slice(1).toLowerCase()}
                </span>
              </div>

              <h3 className="text-lg font-medium text-[var(--color-text-primary)] truncate mb-2" title={getFilename(review.fileUrl) || review.id}>
                {getFilename(review.fileUrl) || `Review #${review.id.substring(0, 8)}`}
              </h3>
              
              <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatDate(review.createdAt)}</span>
              </div>

              {review.status === 'PROCESSING' && (
                <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-yellow-500 h-1.5 rounded-full w-2/3 animate-pulse"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </PortalLayout>
  );
}
