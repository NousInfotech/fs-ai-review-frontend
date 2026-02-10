"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { CriticalError } from "@/types/review";
import { AlertTriangle } from "lucide-react";

import ImageAnnotation from "./ImageAnnotation";

export default function SectionB({ items, content }: { items: CriticalError[]; content?: string }) {
  return (
    <div className="space-y-3">
       <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl text-red-600 font-bold">Critical Errors</h2>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white text-sm font-medium">{items?.length || 0}</div>
        </div>
        {content && <p className="text-xs text-gray-500">{content}</p>}
      </div>

      {(!items || items.length === 0) ? (
        <div className="bg-red-50/50 border border-red-100 rounded-lg p-6 text-center text-gray-500">
          No critical errors found.
        </div>
      ) : (
      <Accordion type="multiple">
        {items.map((err, idx) => (
          <AccordionItem key={idx} value={`B-${idx}`}>
            <AccordionTrigger>
              <div className="flex gap-3">
                <AlertTriangle className="text-red-500" size={18} />
                <div className="flex flex-col items-start text-left">
                  <span className="group-hover:underline underline-offset-4">{err.test_id} — {err.name}</span>
                </div>
                {err.category && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded h-fit uppercase">
                    {err.category.replace(/_/g, " ")}
                  </span>
                )}
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-sm space-y-4">
              <div>
                <p className="font-semibold text-gray-800 mb-1">Description:</p>
                <p className="text-gray-600 leading-relaxed">{err.description}</p>
              </div>

              {err.result && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-semibold text-gray-800 mb-1">Result:</p>
                  <p className="text-gray-700">{err.result}</p>
                </div>
              )}

              {err.location && err.location.length > 0 && (
                <div className="mt-4 space-y-8">
                  {err.location.map((loc, lIdx) => {
                    const isMulti = err.location!.length > 1;
                    return (
                      <div key={lIdx} className={isMulti ? "space-y-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100 shadow-sm" : "space-y-2"}>
                        <p className="font-semibold text-gray-800 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                           Location {isMulti ? lIdx + 1 : ""}: Page {loc.page_no}
                        </p>
                        <ImageAnnotation location={loc} testId={err.test_id} />
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
