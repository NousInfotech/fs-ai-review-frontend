"use client";

import PortalLayout from "@/components/PortalLayout";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { HistoryDocument } from "@/lib/types";
import { FileText, Download } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['generatedReports'],
    queryFn: async () => {
      const response = await api.get('/api/v1/reviews/');
      return (response.data as any[]).map(item => {
        const id = item.id || item._id;
        return {
          id: id,
          companyName: item.companyName || item.company_name || item.metadata?.companyName || "Unknown Company",
          documentDate: item.documentDate || item.document_date || item.metadata?.documentDate || "Date Not Found",
          uploadDate: item.createdAt || new Date().toISOString(),
          fileUrl: item.fileUrl,
          status: item.status,
          totalPages: item.totalPages || 0
        } as HistoryDocument;
      });
    }
  });

  const reports = documents?.filter((doc: HistoryDocument) => doc.status === 'COMPLETED') || [];

  return (
    <PortalLayout title="Generated Reports" description="Access compiled AI audit results">
      <div className="max-w-6xl mx-auto">
        <div className="audit-card w-full p-6">
           <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-6">Available Reports</h2>
           
           {isLoading ? (
             <div className="flex justify-center p-10 text-slate-400">Loading reports...</div>
           ) : reports.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {reports.map((report: HistoryDocument) => (
                 <div key={report.id} className="border border-slate-100 p-4 rounded-xl hover:shadow-md transition-shadow group flex flex-col">
                   <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                     <FileText className="w-6 h-6 text-blue-600" />
                   </div>
                   <h3 className="font-semibold text-slate-800 truncate">{report.companyName || "Unknown Company"}</h3>
                   <p className="text-sm text-slate-500 mb-4">{report.documentDate || "Recently Uploaded"}</p>
                   
                   <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                     <Link href={`/results/${report.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">View Details</Link>
                     <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" title="Download placeholder">
                       <Download className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-100 rounded-xl">
               <FileText className="w-12 h-12 text-slate-200 mb-3" />
               <h3 className="text-slate-800 font-medium">No completed reports</h3>
               <p className="text-slate-500 text-sm mt-1">Upload and process a document to generate a report.</p>
             </div>
           )}
        </div>
      </div>
    </PortalLayout>
  );
}
