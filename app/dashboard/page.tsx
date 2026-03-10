"use client";

import { useQuery } from "@tanstack/react-query";
import PortalLayout from "@/components/PortalLayout";
import api from "@/lib/api";
import { DashboardStats, HistoryDocument } from "@/lib/types";
import SummaryCards from "./components/SummaryCards";
import RecentStatementsTable from "./components/RecentStatementsTable";
import TopIssuesPanel from "./components/TopIssuesPanel";
import AiInsightsPanel from "./components/AiInsightsPanel";
import UploadCard from "./components/UploadCard";
import StatusBar from "./components/StatusBar";
import { generateDisplayId } from "@/lib/utils";

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
            status: item.status,
            riskLevel: item.riskLevel || 'Medium',
            issues: item.issues || 0
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
      <div className="w-full h-full flex flex-col pt-2">
        {/* Top Summary Cards */}
        <SummaryCards stats={stats} isLoading={statsLoading} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Left Column (Table + Upload) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1 min-h-[350px]">
              <RecentStatementsTable documents={recentReviews || []} isLoading={reviewsLoading} />
            </div>
            
            <div className="h-64 mt-auto">
              {/* Note: In image this section has a blue dashed border and a different style */}
              <UploadCard />
            </div>
          </div>

          {/* Right Column (Insights Panels) */}
          <div className="flex flex-col gap-6 h-full">
            <div className="min-h-[250px]">
              <TopIssuesPanel />
            </div>
            
            <div className="flex-1 min-h-[150px]">
              <AiInsightsPanel />
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-6 border-t border-gray-200 pt-2">
          <StatusBar stats={stats} />
        </div>
      </div>
    </PortalLayout>
  );
}