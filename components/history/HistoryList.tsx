import React from 'react';
import Link from 'next/link';
import { HistoryDocument } from '@/lib/types';
import { FileText, Calendar, Clock, ChevronRight, AlertCircle, CheckCircle, Loader2, Trash2 } from 'lucide-react';
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No documents found</p>
        <p className="text-gray-400 text-sm mt-1">Upload a financial statement to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Row (Desktop) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <div className="col-span-5">Company / Document</div>
        <div className="col-span-2">Doc Date</div>
        <div className="col-span-2">Uploaded</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1"></div>
      </div>

      {documents.map((doc) => {
        const isDeleting = deletingId === doc.id;
        return (
          <div
            key={doc.id}
            className={clsx(
              "group relative bg-white border border-gray-100 rounded-xl transition-all duration-200",
              isDeleting ? "opacity-50 pointer-events-none" : "hover:shadow-md hover:border-indigo-100"
            )}
          >
            <Link
              href={`/results/${doc.id}`}
              className="block"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">

                {/* Company & ID */}
                <div className="col-span-1 md:col-span-5">
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      "p-2 rounded-lg shrink-0",
                      doc.status === 'COMPLETED' ? "bg-indigo-50 text-indigo-600" :
                      doc.status === 'FAILED' ? "bg-red-50 text-red-600" :
                      "bg-amber-50 text-amber-600"
                    )}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[var(--color-accent)] transition-colors">
                        {doc.companyName || "Unknown Company"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                          {doc.displayId || "Processing ID..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Date */}
                <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-300 md:hidden" />
                  <span>{doc.documentDate || "Date Not Found"}</span>
                </div>

                {/* Upload Date */}
                <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 text-gray-300 md:hidden" />
                  <span>
                    {new Date(doc.uploadDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-1 md:col-span-2">
                  <StatusBadge status={doc.status} />
                </div>

                {/* Action */}
                <div className="col-span-1 hidden md:flex justify-end pr-8">
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete?.(doc.id);
              }}
              disabled={isDeleting}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
              title="Delete document"
            >
              {isDeleting
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Trash2 className="h-4 w-4" />
              }
            </button>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    COMPLETED: "bg-green-50 text-green-700 border-green-100",
    PROCESSING: "bg-amber-50 text-amber-700 border-amber-100",
    PENDING: "bg-gray-50 text-gray-700 border-gray-100",
    FAILED: "bg-red-50 text-red-700 border-red-100",
  };

  const icons = {
    COMPLETED: CheckCircle,
    PROCESSING: Loader2,
    PENDING: Clock,
    FAILED: AlertCircle,
  };

  const Icon = icons[status as keyof typeof icons] || Clock;
  const style = styles[status as keyof typeof styles] || styles.PENDING;

  return (
    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", style)}>
      <Icon className={clsx("h-3.5 w-3.5", status === 'PROCESSING' && "animate-spin")} />
      {status}
    </span>
  );
}
