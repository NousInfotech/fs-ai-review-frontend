"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SectionA from "./SectionA";
import SectionB from "./SectionB";
import SectionC from "./SectionC";
import SectionD from "./SectionD";
import ImageAnnotation from "./ImageAnnotation";

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
  const [leftWidth, setLeftWidth] = useState(40); // Initial split 40/60
  const [isResizing, setIsResizing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constraints: 20% to 80%
    if (newLeftWidth > 20 && newLeftWidth < 80) {
      setLeftWidth(newLeftWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

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

  // Collect all unique images from B and C
  const getAllUniqueImages = () => {
    const images: { url: string; page_no: number; test_id: string; location: any }[] = [];
    const seenUrls = new Set<string>();

    [...filteredBItems, ...filteredCItems].forEach(item => {
      if (item.location) {
        item.location.forEach((loc: any) => {
          // Only show images with real URLs (skip placeholders like "<public image>")
          if (!loc.url || loc.url.startsWith("<") || loc.url.includes("example.com")) return;
          const imageId = `${loc.url}-${loc.page_no}`;
          if (!seenUrls.has(imageId)) {
            seenUrls.add(imageId);
            images.push({
              url: loc.url || "",
              page_no: loc.page_no,
              test_id: item.id || item.test_id || "",  // id is canonical; test_id is stripped by backend sanitize_items
              location: loc
            });
          }
        });
      }
    });

    return images;
  };

  const uniqueImages = getAllUniqueImages();

  const handleItemClick = (testId: string, location?: any) => {
    if (location) {
      const imageId = `${location.url}-${location.page_no}`;
      const element = imageRefs.current[imageId];
      if (element) {
        // Scroll to the start (top) of the element with an offset
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  if (!data) {
    return (
      <div className="p-4 text-center text-red-500 border border-red-200 rounded-lg bg-red-50">
        Error: Unable to load financial status data.
      </div>
    );
  }

  return (
    <div className="mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* ------------------- TOP BAR (Action Buttons & Filters) ------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        {/* Category Filter Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 md:mr-2 whitespace-nowrap">Filter:</span>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 py-1.5 rounded-lg border transition-all
                  text-xs font-medium whitespace-nowrap
                  ${
                    selectedCategory === category
                      ? "bg-primary text-white border-primary shadow-sm"
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
            <Button variant="default" onClick={onUploadAgain} className="h-8 px-3 text-[10px] font-bold">
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload
            </Button>
          )}
          
          <Button
            variant="default"
            className="h-8 px-3 text-[10px] font-bold"
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
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export PDF
          </Button>
        </div>
      </div>

      <div 
        className={`flex flex-1 gap-0 min-h-0 relative ${isResizing ? 'select-none cursor-col-resize' : ''}`} 
        ref={containerRef}
      >
        {/* ------------------- LEFT SIDEBAR (Test Cases) ------------------- */}
        <div 
          className="overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200"
          style={{ width: `${leftWidth}%` }}
        >
          <SectionA items={filteredAItems} content={data.A?.content} />
          <SectionB items={filteredBItems} content={data.B?.content} onItemClick={handleItemClick} />
          <SectionC items={filteredCItems} content={data.C?.content} onItemClick={handleItemClick} />
          {data.D && data.D.tables && (
            <SectionD tables={data.D.tables} content={data.D?.content} />
          )}
        </div>

        {/* ------------------- RESIZABLE GUTTER ------------------- */}
        <div
          onMouseDown={handleMouseDown}
          className={`
            relative w-[1px] hover:w-1.5 bg-gray-200 hover:bg-gray-200/40
            cursor-col-resize flex-shrink-0 transition-all duration-200
            z-20 group/gutter
            ${isResizing ? 'bg-gray-400 w-1.5' : ''}
          `}
        >
          {/* Broad hot-zone for easier grabbing */}
          <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize" />
          
          {/* Animated Gray line indicator */}
          <div className={`
            absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gray-300
            transition-all duration-200 opacity-0 group-hover/gutter:opacity-100
            ${isResizing ? 'opacity-100' : ''}
          `} />
        </div>

        {/* ------------------- RIGHT CONTENT (Images) ------------------- */}
        <div 
          className="overflow-y-auto pl-4 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 overflow-x-hidden" 
          ref={scrollContainerRef}
          style={{ width: `${100 - leftWidth}%` }}
        >
          {uniqueImages.length > 0 ? (
            uniqueImages.map((img, idx) => (
              <div 
                key={`${img.url}-${img.page_no}`} 
                ref={el => { imageRefs.current[`${img.url}-${img.page_no}`] = el; }}
                className="scroll-mt-10"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-800">Page {img.page_no}</h3>
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Linked to {img.test_id}</span>
                </div>
                <ImageAnnotation location={img.location} testId={img.test_id} />
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 p-10">
              <p className="text-sm">No images associated with filtered results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
