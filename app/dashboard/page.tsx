"use client";

import { useQuery } from "@tanstack/react-query";
import PortalLayout from "@/components/PortalLayout";
import api from "@/lib/api";
import { DashboardStats, HistoryDocument } from "@/lib/types";
import SummaryCards from "./components/SummaryCards";
import RecentStatementsTable from "./components/RecentStatementsTable";
import UploadCard from "./components/UploadCard";
import StatusBar from "./components/StatusBar";
import BannerCarousel from "./components/BannerCarousel";
import { generateDisplayId } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardPage() {
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/dashboard/stats');
        return response.data;
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        return {} as DashboardStats;
      }
    },
    refetchInterval: 60000,
  });

  // Fetch recent reviews
  const { data: recentReviews, isLoading: reviewsLoading } = useQuery<HistoryDocument[]>({
    queryKey: ['recentReviews'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/reviews/');
        const allReviews = (response.data as any[]).map(item => {
          const id = item.id || item._id;
          return {
            id: id,
            displayId: item.displayId || generateDisplayId(id),
            companyName: item.companyName || item.metadata?.companyName || "Unknown Company",
            documentDate: item.documentDate || item.metadata?.documentDate || "2024",
            uploadDate: item.createdAt || new Date().toISOString(),
            fileUrl: item.fileUrl || "",
            status: item.status,
            riskLevel: item.riskLevel || 'Medium',
            issues: item.issues || 0,
            totalPages: item.totalPages || 0
          } as HistoryDocument;
        });
        return allReviews.slice(0, 4);
      } catch (error) {
        console.error("Failed to fetch recent reviews", error);
        return [];
      }
    },
  });

  return (
    <PortalLayout>
      <div className="w-full h-full flex flex-col pt-2 pb-8 scrollbar-hide overflow-y-auto">
        {/* Top Banner Carousel */}
        <BannerCarousel />

        {/* Top Summary Cards */}
        <SummaryCards stats={stats} isLoading={statsLoading} />

        {/* Main Content (Stacked Full Width) */}
        <div className="flex flex-col gap-10 mt-6">
          {/* Recent Statements Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <RecentStatementsTable documents={recentReviews || []} isLoading={reviewsLoading} />
          </motion.div>
          
          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <UploadCard />
          </motion.div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-12 border-t border-slate-100 pt-6">
          <StatusBar stats={stats} />
        </div>
      </div>
    </PortalLayout>
  );
}