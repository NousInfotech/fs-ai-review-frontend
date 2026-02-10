import { SectionB, CriticalError } from "@/types/review";
import { AlertOctagon, ArrowRight, Calculator, MapPin, Wrench, Eye, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CriticalErrorsProps {
  data: SectionB;
}

function CriticalErrorItem({ item }: { item: CriticalError; index: number }) {
  return (
    <div className="p-6 hover:bg-gray-50/50 transition-colors">
      <div className="flex justify-between items-start gap-4 mb-2">
        <h4 className="text-lg font-bold text-gray-900 leading-snug">
          {item.name}
        </h4>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 uppercase tracking-wide">
          {item.category}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase tracking-wide">
          Critical
        </span>
        <span className="text-xs text-gray-400 font-mono">
          {item.test_id}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="bg-red-50/30 p-3 rounded-lg border border-red-50">
          <p className="text-gray-700 leading-relaxed">{item.description}</p>
        </div>

        {item.result && (
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1">
            <span className="font-bold text-gray-700">Result:</span>
            <span className="text-red-700 font-medium">{item.result}</span>
          </div>
        )}

        {item.location && item.location.length > 0 && item.location.map((loc, lIdx) => (
          <div key={lIdx} className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 py-1 border-t border-gray-50 first:border-0">
            <span className="font-bold text-gray-700">Location {item.location!.length > 1 ? lIdx + 1 : ""}:</span>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-gray-600">
              {loc.page_no && <span>Page {loc.page_no}</span>}
              {loc.line_no && loc.line_no.length > 0 && (
                <span>Line No: {loc.line_no.join(", ")}</span>
              )}
              {loc.bounding_box && loc.bounding_box.length > 0 && (
                <span className="text-[10px] text-gray-400 font-mono">Box: [{loc.bounding_box.join(", ")}]</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CriticalErrors({ data }: CriticalErrorsProps) {
  if (data.items.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <AlertOctagon className="h-6 w-6 text-red-600 mr-2" />
        {data.title}
        <span className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold uppercase">
          {data.items.length} Issues
        </span>
      </h3>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {data.items.map((item, index) => (
            <CriticalErrorItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
