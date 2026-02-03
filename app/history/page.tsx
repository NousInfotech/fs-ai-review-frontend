"use client";

import { useRouter } from "next/navigation";
import { FileText, Clock, ChevronRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";

export default function HistoryPage() {
  const router = useRouter();

  // Mock data for history
  const allReviews = [
    { id: "1", filename: "Q3_Financials.pdf", status: "completed", date: "2023-10-27" },
    { id: "2", filename: "Annual_Report_2022.pdf", status: "processing", date: "2023-10-26" },
    { id: "3", filename: "Invoice_Batch_001.pdf", status: "failed", date: "2023-10-25" },
    { id: "4", filename: "Q4_Projections.pdf", status: "completed", date: "2023-10-28" },
    { id: "5", filename: "Balance_Sheet_2021.pdf", status: "completed", date: "2023-10-20" },
    { id: "6", filename: "Tax_Returns_2022.pdf", status: "completed", date: "2023-10-15" },
  ];

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

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {allReviews.map((review) => (
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
                review.status === 'completed' ? 'bg-indigo-50 text-indigo-600' :
                review.status === 'processing' ? 'bg-yellow-50 text-yellow-600' :
                'bg-red-50 text-red-600'
              }`}>
                <FileText className="h-6 w-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                review.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                review.status === 'processing' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                'bg-red-100 text-red-700 border-red-200'
              }`}>
                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
              </span>
            </div>

            <h3 className="text-lg font-medium text-[var(--color-text-primary)] truncate mb-2" title={review.filename}>
              {review.filename}
            </h3>
            
            <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
              <Clock className="h-4 w-4 mr-1" />
              <span>{review.date}</span>
            </div>

            {review.status === 'processing' && (
              <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-yellow-500 h-1.5 rounded-full w-2/3 animate-pulse"></div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </PortalLayout>
  );
}
