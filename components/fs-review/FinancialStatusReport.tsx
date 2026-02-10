"use client";

import { useState } from "react";
import SectionA from "./SectionA";
import SectionB from "./SectionB";
import SectionC from "./SectionC";
import SectionD from "./SectionD";

import { Download, Upload } from "lucide-react";
import { ReviewResult } from "@/types/review";
import { Button } from "../ui/Button";
import { generateFinancialStatusPDF } from "@/lib/pdfGenerator";
import { toast } from "react-hot-toast";

const CATEGORY_LABELS: Record<string, string> = {
  ALL: "All",
  AUDIT_REPORT: "Audit Report",
  BALANCE_SHEET: "Balance Sheet",
  INCOME_STATEMENT: "Income Statement",
  GENERAL: "General",
  NOTES_AND_POLICY: "Notes & Policy",
  CROSS_STATEMENT: "Cross Statement",
  PRESENTATION: "Presentation",
};

export default function FinancialStatusReport({ data, onUploadAgain }: { data: ReviewResult; onUploadAgain?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Extract all unique categories from the data
  const getAllCategories = (): string[] => {
    const categories = new Set<string>();
    
    if (data?.A?.items) {
      data.A.items.forEach(item => {
        if (item.category) categories.add(item.category);
      });
    }
    
    if (data?.B?.items) {
      data.B.items.forEach(item => {
        if (item.category) categories.add(item.category);
      });
    }
    
    if (data?.C?.items) {
      data.C.items.forEach(item => {
        if (item.category) categories.add(item.category);
      });
    }
    
    // Always include PRESENTATION as it's a mandatory category for the filter to show something besides 'All' if data is empty in some sections but has categories in others.
    // However, if we want to be exact, we should only show what's there.
    // categories.add("PRESENTATION"); 
    
    return ["ALL", ...Array.from(categories).sort()];
  };

  const availableCategories = getAllCategories();

  // Filter items by selected category
  const filterItemsByCategory = <T extends { category?: string }>(items: T[]): T[] => {
    if (selectedCategory === "ALL") return items;
    return items.filter(item => item.category === selectedCategory);
  };

  const filteredAItems = filterItemsByCategory(data?.A?.items || []);
  const filteredBItems = filterItemsByCategory(data?.B?.items || []);
  const filteredCItems = filterItemsByCategory(data?.C?.items || []);

  if (!data) {
    return (
      <div className="p-4 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
        Error: Unable to load financial status data.
      </div>
    );
  }

  return (
    <div className="mx-auto">

      {/* ------------------- TOGGLE BUTTONS & ACTIONS ------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Category Filter Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 md:mr-2 whitespace-nowrap">Filter by Category:</span>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-lg border transition-all
                  text-sm font-medium whitespace-nowrap
                  ${
                    selectedCategory === category
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }
                `}
              >
                {CATEGORY_LABELS[category] || category}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto uppercase">
          {onUploadAgain && (
            <Button variant="default" onClick={onUploadAgain} className="h-9 px-4 text-xs font-bold">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          )}
          
          <Button
            variant="default"
            className="h-9 px-4 text-xs font-bold"
            onClick={async () => {
                const toastId = toast.loading("Generating highlighted PDF report...");
                try {
                  await generateFinancialStatusPDF(data);
                  toast.success("PDF Report Exported", { id: toastId });
                } catch (error) {
                  console.error("PDF Generation Error:", error);
                  toast.error("Failed to generate PDF report", { id: toastId });
                }
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF Report
          </Button>
        </div>
      </div>
      {/* ------------------- SECTIONS ------------------- */}
      <SectionA items={filteredAItems} content={data.A?.content} />
      <SectionB items={filteredBItems} content={data.B?.content} />
      <SectionC items={filteredCItems} content={data.C?.content} />
      {data.D && data.D.tables && (
        <SectionD tables={data.D.tables} content={data.D?.content} />
      )}
    </div>
  );
}
