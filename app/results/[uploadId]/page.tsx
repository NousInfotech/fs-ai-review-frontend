"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader2, CheckCircle, XCircle, AlertTriangle, ImageIcon, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";
import api from "@/lib/api";
import { TestResult } from "@/types/review";
import { clsx } from "clsx";

const fetchResults = async (uploadId: string): Promise<TestResult[]> => {
  try {
    const response = await api.get(`/api/v1/reviews/${uploadId}/result`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch results", error);
    throw error;
  }
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const uploadId = params.uploadId as string;

  // Prevent API calls for the deprecated mock ID
  const isMockId = uploadId === 'mock-upload-id-123';

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['reviewResults', uploadId],
    queryFn: () => fetchResults(uploadId),
    enabled: !isMockId, // Disable query for mock ID
  });

  if (isMockId) {
    return (
      <PortalLayout>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-6">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Demo Session Expired</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            The demo ID <code>{uploadId}</code> is no longer supported. Please start a new review to use the live system.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start New Review
          </button>
        </div>
      </PortalLayout>
    );
  }

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Loading Results...</h3>
            <p className="text-gray-500">Retrieving detailed analysis report</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (error || !results) {
    return (
      <PortalLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-red-600">Error Loading Results</h3>
          <p className="text-gray-500 mb-4">Could not retrieve the analysis data.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout 
      title="Review Results" 
      description={`Analysis Report ID: ${uploadId}`}
    >
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          Download PDF Report
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Compliance Test Results</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Test ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                  Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  View Image
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.testCaseId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      result.status === 'PASS' ? "bg-green-100 text-green-800" :
                      result.status === 'FAIL' ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    )}>
                      {result.status === 'PASS' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {result.status === 'FAIL' && <XCircle className="w-3 h-3 mr-1" />}
                      {result.status === 'WARNING' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {result.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {result.message}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {result.extractedValues ? (
                       <div className="space-y-1">
                         {Object.entries(result.extractedValues).map(([key, value]) => (
                           <div key={key} className="flex justify-between text-xs">
                             <span className="font-medium text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                             <span className="text-gray-800">{String(value)}</span>
                           </div>
                         ))}
                       </div>
                    ) : (
                      <span className="text-gray-400 italic">No details</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.annotated_image_url ? (
                      <a 
                        href={result.annotated_image_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <ImageIcon className="w-4 h-4 mr-1" />
                        View
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PortalLayout>
  );
}
