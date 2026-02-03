"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function Dropzone({ onFileSelect, selectedFile, onClear }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-4 rounded-full bg-[var(--color-accent)]/10">
                <FileText className="h-8 w-8 text-[var(--color-accent)]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 truncate max-w-xs">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              {...getRootProps()}
              className={clsx(
                "relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300",
                isDragActive 
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5" 
                  : "border-gray-300 hover:border-[var(--color-accent)] hover:bg-gray-50"
              )}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center space-y-4 relative z-10">
                <div className={clsx(
                  "p-4 rounded-full transition-colors",
                  isDragActive ? "bg-[var(--color-accent)]/10" : "bg-gray-100"
                )}>
                  <UploadCloud className={clsx(
                    "h-8 w-8 transition-colors",
                    isDragActive ? "text-[var(--color-accent)]" : "text-gray-400"
                  )} />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isDragActive ? "Drop file here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF documents only (max 10MB)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
