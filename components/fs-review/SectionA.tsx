"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { CorrectItem } from "@/types/review";
import { CheckCircle } from "lucide-react";

export default function SectionA({ items, content }: { items: CorrectItem[]; content?: string }) {
  return (
    <div className="mb-10 space-y-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl text-green-600 font-bold">Confirmed Correct Items</h2>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white text-sm font-medium">{items?.length || 0}</div>
        </div>
        {content && <p className="text-xs text-gray-500">{content}</p>}
      </div>

      {(!items || items.length === 0) ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
          No confirmed items to display.
        </div>
      ) : (
      <Accordion type="multiple">
        {items.map((item, idx) => (
          <AccordionItem key={idx} value={`A-${idx}`}>
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={18} />
                <span className="group-hover:underline underline-offset-4">{item.test_id} — {item.name}</span>
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
        ))}
      </Accordion>
      )}
    </div>
  );
}
