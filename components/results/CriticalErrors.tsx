import { SectionB, CriticalError } from "@/types/review";
import { AlertOctagon, ArrowRight, Calculator, MapPin, Wrench, Eye, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CriticalErrorsProps {
  data: SectionB;
}

function CriticalErrorItem({ item, index }: { item: CriticalError, index: number }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const evidenceUrl = item.annotated_image_url || item.extractedValues?.annotated_image_url;

  return (
    <div className="p-6 hover:bg-gray-50/50 transition-colors">
      {/* 1. Issue Title */}
      <div className="flex justify-between items-start gap-4 mb-2">
        <h4 className="text-lg font-bold text-gray-900 leading-snug">
          {item.description}
        </h4>
      </div>

      {/* 2. Type & Severity */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 uppercase tracking-wide">
          {item.category}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase tracking-wide">
          Critical
        </span>
        <span className="text-xs text-gray-400 font-mono">
          {item.id || `B${index + 1}`}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        {/* 3. Reported / Expected / Difference */}
        {(item.reported_value !== null && item.reported_value !== undefined) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 py-2 border-t border-b border-gray-50">
            <div className="flex flex-col sm:block">
              <span className="font-bold text-gray-700 mr-2">Reported Value:</span>
              <span className="font-mono text-red-600 font-medium">
                {item.reported_value.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col sm:block">
              <span className="font-bold text-gray-700 mr-2">Expected Value:</span>
              <span className="font-mono text-green-600 font-medium">
                {item.expected_value?.toLocaleString() ?? "N/A"}
              </span>
            </div>
            <div className="flex flex-col sm:block">
              <span className="font-bold text-gray-700 mr-2">Difference:</span>
              <span className="font-mono text-red-700 font-bold">
                {item.difference?.toLocaleString() ?? "N/A"}
              </span>
            </div>
          </div>
        )}

        {/* 4. Location */}
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1">
          <span className="font-bold text-gray-700">Location:</span>
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-gray-600">
              {item.location ? (
                <>
                  Page {item.location.page}
                  {item.location.section && `, Section ${item.location.section}`}
                </>
              ) : "Not specified"}
            </span>
            {/* Button next to Location */}
            {evidenceUrl && (
              <button
                onClick={() => setShowEvidence(!showEvidence)}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-colors border ${
                  showEvidence 
                    ? "bg-indigo-100 text-indigo-800 border-indigo-200" 
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100"
                }`}
              >
                {showEvidence ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1.5" />
                    Hide Evidence
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1.5" />
                    Show Evidence
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Evidence Image Viewer */}
        <AnimatePresence>
          {showEvidence && evidenceUrl && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-2 border border-gray-200 rounded-lg bg-gray-50 p-2">
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-xs font-bold text-gray-500 uppercase">Evidence Screenshot</span>
                  <a 
                    href={evidenceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    Open Full Image <ArrowRight className="h-3 w-3 ml-1" />
                  </a>
                </div>
                <div className="relative rounded overflow-hidden border border-gray-200">
                  <img 
                    src={evidenceUrl} 
                    alt="Evidence of error" 
                    className="w-full h-auto object-contain max-h-[400px] bg-white"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 5. Affected Line Item */}
        {item.location?.line_hint && (
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1">
            <span className="font-bold text-gray-700">Affected Line Item:</span>
            <span className="text-gray-600 italic">"{item.location.line_hint}"</span>
          </div>
        )}

        {/* 6. Financial Impact */}
        {item.financial_impact && (
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1">
            <span className="font-bold text-gray-700">Financial Impact:</span>
            <span className="text-gray-600">{item.financial_impact}</span>
          </div>
        )}

        {/* 7. Suggested Fix */}
        {item.suggested_fix && (
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1">
            <span className="font-bold text-gray-700">Suggested Fix:</span>
            <span className="text-indigo-700 font-medium">{item.suggested_fix}</span>
          </div>
        )}
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
