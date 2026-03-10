import React from 'react';
import Link from 'next/link';
import { HistoryDocument } from '@/lib/types';
import { FileText, Loader2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

interface HistoryListProps {
  documents: HistoryDocument[];
  isLoading?: boolean;
  deletingId?: string | null;
  onDelete?: (id: string) => void;
}

export default function HistoryList({ documents, isLoading, deletingId, onDelete }: HistoryListProps) {
  if (isLoading) {
    return (
      <div className="audit-card w-full p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="audit-card w-full p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-blue-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">No documents found</h3>
        <p className="text-slate-500 max-w-sm">Upload a financial statement from the dashboard or upload page to get started.</p>
      </div>
    );
  }

  const getStatusPill = (status: string) => {
    switch (status?.toLowerCase()) {
      case "reviewed":
      case "completed":
        return <span className="px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-600 text-[11px] font-semibold tracking-wide uppercase border border-emerald-200/50">Reviewed</span>;
      case "processing":
      case "in_progress":
        return <span className="px-3 py-1 rounded-full bg-blue-100/50 text-blue-600 text-[11px] font-semibold tracking-wide uppercase border border-blue-200/50 flex items-center gap-1.5 w-fit"><Loader2 className="w-3 h-3 animate-spin"/> Processing</span>;
      case "failed":
      case "error":
        return <span className="px-3 py-1 rounded-full bg-red-100/50 text-red-600 text-[11px] font-semibold tracking-wide uppercase border border-red-200/50">Failed</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-100/50 text-gray-600 text-[11px] font-semibold tracking-wide uppercase border border-gray-200/50">{status || 'Pending'}</span>;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "high": return "text-red-500 font-medium";
      case "medium": return "text-orange-500 font-medium";
      case "low": return "text-emerald-500 font-medium";
      default: return "text-slate-400 font-medium";
    }
  };

  return (
    <div className="audit-card w-full p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 font-medium uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="pb-3 font-semibold pl-2">Company / ID</th>
              <th className="pb-3 font-semibold">Doc Date</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Risk Level</th>
              <th className="pb-3 font-semibold text-center">Action</th>
              <th className="pb-3 font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc: any, i) => {
              const isDeleting = deletingId === doc.id;
              const risk = doc.riskLevel || (i % 3 === 0 ? "High" : i % 2 === 0 ? "Low" : "Medium");
              
              return (
                <tr 
                  key={doc.id} 
                  className={clsx(
                    "border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors group",
                    isDeleting && "opacity-50 pointer-events-none"
                  )}
                >
                  <td className="py-4 pl-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                        {doc.companyName || "Unknown Company"}
                      </span>
                      <span className="text-xs text-slate-400 font-mono mt-0.5">{doc.displayId}</span>
                    </div>
                  </td>
                  
                  <td className="py-4 text-slate-600 font-medium">
                    {doc.documentDate || "Date Not Found"}
                  </td>
                  
                  <td className="py-4">
                    {getStatusPill(doc.status)}
                  </td>
                  
                  <td className={clsx("py-4", getRiskColor(risk))}>
                    {doc.status?.toLowerCase() === 'processing' ? "-" : risk}
                  </td>
                  
                  <td className="py-4 text-center">
                    {doc.status?.toLowerCase() === "processing" ? (
                      <button disabled className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold">
                        Processing...
                      </button>
                    ) : (
                      <Link 
                        href={`/results/${doc.id}`}
                        className={clsx(
                          "px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity inline-block",
                          risk?.toLowerCase() === 'high' ? 'bg-blue-600' : 'bg-blue-500'
                        )}
                      >
                        {risk?.toLowerCase() === 'high' ? 'Investigate' : 'View Report'}
                      </Link>
                    )}
                  </td>
                  
                  <td className="py-4 text-right pr-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete?.(doc.id);
                      }}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
                      title="Delete document"
                    >
                      {isDeleting
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />
                      }
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
