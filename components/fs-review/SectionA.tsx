"use client";

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { CorrectItem } from "@/types/review";
import { CheckCircle } from "lucide-react";
import ReviewSection from "./ReviewSection";

export default function SectionA({ items, content }: { items: CorrectItem[]; content?: string }) {
  return (
    <ReviewSection
      title="Confirmed Correct Items"
      titleColorClass="text-green-600"
      badgeColorClass="bg-green-600"
      count={items?.length || 0}
      content={content}
      items={items || []}
      emptyMessage="No confirmed items to display."
      emptyBgClass="bg-gray-50"
      emptyBorderClass="border-gray-200"
      renderItem={(item, idx) => (
        <AccordionItem key={idx} value={`Confirmed Correct Items-${idx}`}>
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" size={18} />
              <span className="group-hover:underline underline-offset-4 text-left">
                {item.test_id
                  ? `${item.test_id} — ${item.name || ""}`
                  : item.name || `Unknown — ${(item.id || "").slice(0, 8)}`}
              </span>
              {item.category && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded uppercase">
                  {item.category.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </AccordionTrigger>

          <AccordionContent className="text-sm text-gray-700">
            {item.description}
          </AccordionContent>
        </AccordionItem>
      )}
    />
  );
}
