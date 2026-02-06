"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ReviewResult } from "@/types/review";
import VerdictSection from "./VerdictSection";
import CriticalErrors from "./CriticalErrors";
import DisclosureBreaches from "./DisclosureBreaches";
import ReconciliationTables from "./ReconciliationTables";
import CorrectItems from "./CorrectItems";
import { Loader2 } from "lucide-react";

interface TestListProps {
  uploadId: string;
}

const fetchReport = async (uploadId: string): Promise<ReviewResult> => {
  const response = await api.get(`/api/v1/reviews/${uploadId}/report`);
  return response.data;
};

export default function TestList({ uploadId }: TestListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reviewReport', uploadId],
    queryFn: () => fetchReport(uploadId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load detailed report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <VerdictSection data={data.E} criticalErrors={data.B} />
      <CriticalErrors data={data.B} />
      <DisclosureBreaches data={data.C} />
      <ReconciliationTables data={data.D} />
      <CorrectItems data={data.A} />
    </div>
  );
}
