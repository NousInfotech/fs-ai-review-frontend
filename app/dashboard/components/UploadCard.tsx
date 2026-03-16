"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { UploadCloud, File, Loader2, X, CheckCircle2, ShieldCheck, ArrowRight, FileText } from "lucide-react";
import Dropzone from "@/components/upload/Dropzone";
import api from "@/lib/api";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UploadCard() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { credits, deductCredit } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (fileToUpload: File) => {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      // Hardcode required standard types for dashboard fast upload
      const queryParams = new URLSearchParams({
        countryCode: "US",
        companyType: "LISTED",
        accountingStandard: "GAPSME",
        regulator: "SEC"
      }).toString();

      const response = await api.post(`/api/v1/upload?${queryParams}`, formData);
      return response.data;
    },
    onSuccess: (data) => {
      deductCredit();
      const uploadId = data.id || data.uploadId || data.upload_id || data._id;
      if (uploadId) {
        router.push(`/processing/${uploadId}`);
      }
    },
    onError: (error: any) => {
      console.error("Upload failed", error);
      if (error.response?.status === 402) {
        toast.error("Insufficient credits. Please upgrade.");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    },
  });

  const handleUpload = () => {
    if (credits <= 0) {
      toast.error("You have used all your free credits.");
      return;
    }
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
      
      <div className={cn(
        "relative overflow-hidden rounded-[2.5rem] border-2 border-dashed transition-all duration-500",
        file ? "border-emerald-200 bg-emerald-50/20" : "border-slate-200 bg-white hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/5"
      )}>
        {/* Progress bar for upload */}
        {uploadMutation.isPending && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 10 }}
            className="absolute top-0 left-0 h-1.5 bg-blue-600 z-20"
          />
        )}

        <div className="px-8 py-12 md:px-16 md:py-16 min-h-[320px] flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl w-full flex flex-col items-center"
              >
                <div className="w-24 h-24 mb-6 rounded-3xl bg-blue-50 flex items-center justify-center relative shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-blue-400/10 rounded-3xl animate-ping opacity-20" />
                  <UploadCloud className="w-10 h-10 text-blue-600" />
                </div>
                
                <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Upload New Financial Statement</h3>
                <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                  Start your AI auditing process by dropping your files here or <button className="text-blue-600 font-bold hover:underline">browsing</button> from your device.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mx-auto">
                    {[
                      { icon: ShieldCheck, text: "Encrypted Transfer" },
                      { icon: CheckCircle2, text: "AI Validation" },
                      { icon: FileText, text: "Smart Reporting" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <item.icon className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{item.text}</span>
                      </div>
                    ))}
                </div>

                <div className="absolute inset-0 opacity-0 cursor-pointer">
                   <Dropzone onFileSelect={setFile} selectedFile={null} onClear={() => {}} />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="selected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl flex flex-col items-center"
              >
                <div className="w-20 h-20 mb-6 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm relative">
                   <File className="w-8 h-8" />
                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border border-emerald-100 flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                   </div>
                </div>

                <div className="mb-10 w-full overflow-hidden">
                   <h4 className="text-lg font-bold text-slate-900 mb-1 truncate px-4">{file.name}</h4>
                   <span className="text-slate-400 text-sm font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => setFile(null)}
                    className="flex-1 py-4 px-6 text-sm font-black text-slate-500 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100 flex items-center justify-center gap-2"
                    disabled={uploadMutation.isPending}
                  >
                    <X className="w-4 h-4" />
                    DISCARD
                  </button>
                  <button 
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending || credits <= 0}
                    className="flex-[2] py-4 px-8 text-sm font-black text-white bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        ANALYZING DATA...
                      </>
                    ) : (
                      <>
                        INITIATE AI AUDIT
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

