"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { UploadCloud, File, Loader2 } from "lucide-react";
import Dropzone from "@/components/upload/Dropzone";
import api from "@/lib/api";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function UploadCard() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const { credits, deductCredit } = useAuth();

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
    <div className="audit-card w-full h-full border-dashed border-2 flex items-center justify-center bg-sky-50/30 p-8 transition-colors hover:bg-sky-50/50 hover:border-blue-200 group">
      <div className="w-full text-center">
        {!file ? (
          <div className="max-w-md mx-auto relative z-10">
             <div className="mb-3 flex justify-center">
                 <div className="relative">
                   <UploadCloud className="w-14 h-14 text-blue-300" strokeWidth={1.5} />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 font-bold bg-white rounded-md px-1 mt-1">
                     ↑
                   </div>
                 </div>
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Financial Statements</h3>
             
             {/* Hide default dropzone visually but overlay it, or just use it simply */}
             <div className="bg-transparent opacity-0 absolute inset-0 cursor-pointer">
                <Dropzone onFileSelect={setFile} selectedFile={null} onClear={() => {}} />
             </div>
             
             <p className="text-sm font-medium text-slate-500 mb-1">
               Drag & Drop files here or <span className="text-blue-600 font-bold">Browse Files</span>
             </p>
             <p className="text-xs text-slate-400">Supported formats: PDF, Word, Excel</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
             <div className="mb-4 flex flex-col items-center gap-2">
                 <File className="w-10 h-10 text-blue-500" />
                 <span className="text-sm font-medium text-slate-700 max-w-full truncate px-4">{file.name}</span>
             </div>
             
             <div className="flex justify-center gap-3">
                 <button 
                   onClick={() => setFile(null)}
                   className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                   disabled={uploadMutation.isPending}
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleUpload}
                   disabled={uploadMutation.isPending || credits <= 0}
                   className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                 >
                   {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload File"}
                 </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
