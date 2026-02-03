import { SectionB } from "@/types/review";
import { AlertOctagon, ArrowRight, Calculator, MapPin, Wrench } from "lucide-react";

interface CriticalErrorsProps {
  data: SectionB;
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

      <div className="space-y-6">
        {data.items.map((item, index) => (
          <div 
            key={index} 
            className="bg-white border-l-4 border-red-500 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded">
                      {item.id || `B${index + 1}`}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {item.test_id} • {item.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">{item.description}</h4>
                </div>
              </div>

              {/* Math/Logic Details Grid */}
              {(item.reported_value !== null && item.reported_value !== undefined && item.expected_value !== null && item.expected_value !== undefined) && (
                <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center mb-2 text-gray-500 text-sm font-medium">
                    <Calculator className="h-4 w-4 mr-1.5" />
                    Calculation Discrepancy
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <div className="text-xs text-gray-500 uppercase">Reported</div>
                      <div className="font-mono font-bold text-red-600">
                        {item.reported_value.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <div className="text-xs text-gray-500 uppercase">Expected</div>
                      <div className="font-mono font-bold text-green-600">
                        {item.expected_value.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-red-50 p-2 rounded border border-red-100">
                      <div className="text-xs text-red-500 uppercase">Difference</div>
                      <div className="font-mono font-bold text-red-700">
                        {item.difference?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-0.5">Location</div>
                    <div className="text-sm text-gray-800">
                      Page {item.location.page}
                      {item.location.section && ` • Section: ${item.location.section}`}
                      {item.location.line_hint && (
                        <div className="text-gray-500 text-xs mt-0.5">Line: "{item.location.line_hint}"</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fix */}
                <div className="flex items-start p-3 bg-indigo-50 rounded-lg">
                  <Wrench className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-indigo-500 uppercase mb-0.5">Suggested Fix</div>
                    <div className="text-sm text-indigo-900">
                      {item.suggested_fix}
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact */}
              {item.financial_impact && (
                <div className="mt-4 flex items-start p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex-shrink-0">
                    <AlertOctagon className="h-5 w-5 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-bold text-red-800">Financial Impact</h3>
                    <div className="mt-1 text-sm text-red-700">
                      {item.financial_impact}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
