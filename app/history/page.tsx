"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, AlertCircle } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import api from "@/lib/api";
import HistoryList from "@/components/history/HistoryList";
import { HistoryDocument } from "@/lib/types";
import { generateDisplayId } from "@/lib/utils";

export default function HistoryPage() {
  const queryClient = useQueryClient();

  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/reviews/');
        // Transform backend response to HistoryDocument
        return (response.data as any[]).map(item => {
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
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        throw error;
      }
    }
  });

  const { mutate: deleteReview, variables: deletingId } = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

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

      {isError ? (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertCircle className="h-10 w-10 mb-4" />
          <p className="font-medium">Failed to load history</p>
          <p className="text-sm mt-2 text-gray-500">
            Check your internet connection or ensure the backend API is reachable.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <HistoryList
          documents={reviews || []}
          isLoading={isLoading}
          deletingId={deletingId}
          onDelete={deleteReview}
        />
      )}
    </PortalLayout>
  );
}
