"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Dropzone from "@/components/upload/Dropzone";
import api from "@/lib/api";
import { Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

const COUNTRY_OPTIONS = ["US", "IN", "GB"];
const COMPANY_TYPE_OPTIONS = ["LISTED", "PRIVATE", "BANKING", "INSURANCE"];
const ACCOUNTING_STANDARD_OPTIONS = ["IFRS", "GAPSME"];
const REGULATOR_OPTIONS = ["SEC", "SEBI", "MCA"];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [countryCode, setCountryCode] = useState("US");
  const [companyType, setCompanyType] = useState("LISTED");
  const [accountingStandard, setAccountingStandard] = useState("IFRS");
  const [regulator, setRegulator] = useState("SEC");
  
  const router = useRouter();
  const { credits, deductCredit } = useAuth();

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

      const response = await api.post(`/api/v1/upload?${queryParams}`, formData);
      console.log("Upload API Raw Response:", response);
      return response.data;
    },
    onSuccess: (data) => {
      // Deduct credit removed
      // Backend returns { id: "..." } or similar
      console.log("Upload Response Data:", data);
      
      const uploadId = data.id || data.uploadId || data.upload_id || data._id || (data.data && data.data.id);

      if (!uploadId) {
        console.error("Upload ID missing in response:", data);
        // Fallback: Check if response itself is the ID string? Unlikely but possible
        if (typeof data === 'string' && data.length > 5) {
             router.push(`/processing/${data}`);
             return;
        }
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="audit-card rounded-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="max-w-xl mx-auto space-y-8">
              
              {/* Metadata Selection Grid */}
              <div className="mb-6">
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
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Document
                </label>
                <Dropzone
                  onFileSelect={setFile}
                  selectedFile={file}
                  onClear={() => setFile(null)}
                />
              </div>

              {credits <= 0 && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center gap-2 text-red-600 text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  You have used all your free credits.
                </div>
              )}

              {uploadMutation.isError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl bg-red-500/5 border border-red-200 p-4"
                >
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-700">
                        {uploadMutation.error && (uploadMutation.error as any).response?.status === 402 
                          ? "Insufficient credits. Please contact support or upgrade."
                          : "Upload failed. Please try again."}
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
                  disabled={!file || uploadMutation.isPending || credits <= 0}
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