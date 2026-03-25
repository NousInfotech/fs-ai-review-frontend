"use client";

import { useQuery } from "@tanstack/react-query";
import PortalLayout from "@/components/PortalLayout";
import api from "@/lib/api";
import { DashboardStats, DashboardReviewRow } from "@/lib/types";
import {
  mapApiReviewToDashboardRow,
  mergeReviewReportIntoRow,
} from "@/lib/reviewDashboardMetrics";
import type { ReviewResult } from "@/types/review";
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
  const { data: recentReviews, isLoading: reviewsLoading } = useQuery<DashboardReviewRow[]>({
    queryKey: ['recentReviews'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/reviews/');
        const items = response.data as Record<string, unknown>[];

        const rows = await Promise.all(
          items.map(async (item) => {
            const id = String(item.id ?? item._id ?? "");
            const displayId = (item.displayId as string) || generateDisplayId(id);
            const base = mapApiReviewToDashboardRow(item, id, displayId);
            const st = String(item.status ?? "").toUpperCase();
            if (st !== "COMPLETED" && st !== "FAILED") return base;

            try {
              const reportRes = await api.get<ReviewResult>(`/api/v1/reviews/${id}/report`);
              return mergeReviewReportIntoRow(base, reportRes.data);
            } catch {
              return base;
            }
          })
        );
        return rows;
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
            <RecentStatementsTable
              documents={(recentReviews || []).slice(0, 4)}
              isLoading={reviewsLoading}
              hasMore={(recentReviews?.length || 0) > 4}
            />
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