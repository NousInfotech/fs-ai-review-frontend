"use client";

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { DisclosureBreach, Location } from "@/types/review";
import { Info } from "lucide-react";
import ReviewSection from "./ReviewSection";
import ImageAnnotation from "./ImageAnnotation";

export default function SectionC({ 
  items, 
  content, 
  onItemClick 
}: { 
  items: DisclosureBreach[]; 
  content?: string;
  onItemClick?: (testId: string, location?: any) => void;
}) {
  return (
    <ReviewSection
      title="Disclosure & Regulatory Breaches"
      titleColorClass="text-yellow-600"
      badgeColorClass="bg-yellow-600"
      count={items?.length || 0}
      content={content}
      items={items || []}
      emptyMessage="No disclosure or regulatory breaches found."
      emptyBgClass="bg-yellow-50/50"
      emptyBorderClass="border-yellow-100"
      renderItem={(issue, idx) => (
        <AccordionItem 
          key={idx} 
          value={`Disclosure & Regulatory Breaches-${idx}`}
          onClick={() => onItemClick?.(issue.id || issue.test_id || "", issue.location?.[0])}
        >
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              <Info className="text-yellow-500" size={18} />
              <div className="flex flex-col items-start text-left">
                <span className="group-hover:underline underline-offset-4">{issue.name || issue.result || issue.id}</span>
              </div>
              {issue.category && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded h-fit uppercase">
                  {issue.category.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent className="text-sm space-y-4">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Description:</p>
              <p className="text-gray-600 leading-relaxed">{issue.description}</p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-gray-800">Result:</p>
              
              {issue.result && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-700">{issue.result}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="font-bold text-red-800 text-xs uppercase tracking-wider mb-1">Current</p>
                  <p className="text-red-700">{issue.current || "No specific current value found."}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="font-bold text-blue-800 text-xs uppercase tracking-wider mb-1">Expected</p>
                  <p className="text-blue-700">{issue.expected || "Standard requirement not met."}</p>
                </div>
              </div>
            </div>

            {issue.location && issue.location.length > 0 && (
              <div className="mt-2 text-xs text-gray-500 italic">
                Related images are displayed on the right.
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
    />
  );
}
