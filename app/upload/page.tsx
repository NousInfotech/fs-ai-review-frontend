"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/upload/Dropzone";
import api from "@/lib/api";
import { Loader2, ArrowLeft, Upload as UploadIcon, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";

const COUNTRY_OPTIONS = ["US", "IN", "GB"];
const COMPANY_TYPE_OPTIONS = ["LISTED", "PRIVATE", "BANKING", "INSURANCE"];
const ACCOUNTING_STANDARD_OPTIONS = ["IFRS", "US_GAAP", "IND_AS"];
const REGULATOR_OPTIONS = ["SEC", "SEBI", "MCA"];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [countryCode, setCountryCode] = useState("US");
  const [companyType, setCompanyType] = useState("LISTED");
  const [accountingStandard, setAccountingStandard] = useState("US_GAAP");
  const [regulator, setRegulator] = useState("SEC");
  
  const router = useRouter();

  const uploadMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      
      const queryParams = new URLSearchParams({
        countryCode,
        companyType,
        accountingStandard,
        regulator
      }).toString();

      const response = await api.post(`/api/v1/upload?${queryParams}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Deduct credit removed
      // Backend returns { id: "..." }
      const uploadId = data.id;

      if (!uploadId) {
        console.error("Upload ID missing in response:", data);
        return;
      }

      router.push(`/processing/${uploadId}`);
    },
    onError: (error) => {
      console.error("Upload failed", error);
    },
  });

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <PortalLayout 
      title="Upload Financial Statement" 
      description="Upload a financial document for AI analysis"
    >
      <div className="max-w-3xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="audit-card rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-8 border-b border-[var(--color-border)]">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center">
              <UploadIcon className="mr-3 h-6 w-6 text-[var(--color-accent)]" />
              Upload Financial Statement
            </h3>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              Upload a PDF document for AI review and analysis. We'll extract key data and identify potential issues.
            </p>
          </div>
          
          <div className="p-8">
            <div className="max-w-xl mx-auto space-y-8">
              
              {/* Metadata Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Country</label>
                  <select 
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  >
                    {COUNTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Company Type</label>
                  <select 
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  >
                    {COMPANY_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Accounting Standard</label>
                  <select 
                    value={accountingStandard}
                    onChange={(e) => setAccountingStandard(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  >
                    {ACCOUNTING_STANDARD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Regulator</label>
                  <select 
                    value={regulator}
                    onChange={(e) => setRegulator(e.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  >
                    {REGULATOR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Document
                </label>
                <Dropzone
                  onFileSelect={setFile}
                  selectedFile={file}
                  onClear={() => setFile(null)}
                />
              </div>

              {uploadMutation.isError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl bg-red-500/5 border border-red-200 p-4"
                >
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-700">
                        Upload failed. Please try again.
                      </h3>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  disabled={!file || uploadMutation.isPending}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Uploading...
                    </>
                  ) : (
                    "Start Review Process"
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </PortalLayout>
  );
}