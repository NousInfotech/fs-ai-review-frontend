"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { DisclosureBreach } from "@/types/review";
import { Info } from "lucide-react";

import ImageAnnotation from "./ImageAnnotation";

export default function SectionC({ items, content }: { items: DisclosureBreach[]; content?: string }) {
  return (
    <div className="mb-10 mt-10">
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl text-yellow-600 font-bold">Disclosure & Regulatory Breaches</h2>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-600 text-white text-sm font-medium">{items?.length || 0}</div>
        </div>  
        {content && <p className="text-xs text-gray-500">{content}</p>}
      </div>
      
      {(!items || items.length === 0) ? (
        <div className="bg-yellow-50/50 border border-yellow-100 rounded-lg p-6 text-center text-gray-500">
          No disclosure or regulatory breaches found.
        </div>
      ) : (
      <Accordion type="multiple">
        {items.map((issue, idx) => (
          <AccordionItem key={idx} value={`C-${idx}`}>
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Info className="text-yellow-500" size={18} />
                <div className="flex flex-col items-start text-left">
                  <span className="group-hover:underline underline-offset-4">{issue.test_id} — {issue.name}</span>
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

              {issue.result && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-semibold text-gray-800 mb-1">Result:</p>
                  <p className="text-gray-700">{issue.result}</p>
                </div>
              )}

              {issue.location && issue.location.length > 0 && (
                <div className="mt-4 space-y-8">
                  {issue.location.map((loc, lIdx) => {
                    const isMulti = issue.location!.length > 1;
                    return (
                      <div key={lIdx} className={isMulti ? "space-y-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100 shadow-sm" : "space-y-2"}>
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                           Location {isMulti ? lIdx + 1 : ""}: Page {loc.page_no}
                        </p>
                        <ImageAnnotation location={loc} testId={issue.test_id} color="#eab308" />
                      </div>
                    );
                  })}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      )}
    </div>
  );
}
