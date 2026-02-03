import { SectionC } from "@/types/review";
import { AlertTriangle, MapPin, Info } from "lucide-react";

interface DisclosureBreachesProps {
  data: SectionC;
}

export default function DisclosureBreaches({ data }: DisclosureBreachesProps) {
  if (data.items.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
        {data.title}
        <span className="ml-3 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-bold uppercase">
          {data.items.length} Warnings
        </span>
      </h3>

      <div className="space-y-4">
        {data.items.map((item, index) => (
          <div 
            key={index} 
            className="bg-white border border-yellow-200 border-l-4 border-l-yellow-400 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded">
                  {item.id || `C${index + 1}`}
                </span>
                {item.category && (
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                )}
              </div>
            </div>

            <h4 className="text-base font-bold text-gray-900 mb-2">{item.description}</h4>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
              {item.location && (
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                  <span>
                    Page {item.location.page}
                    {item.location.section && `, ${item.location.section}`}
                  </span>
                </div>
              )}
              
              {item.impact && (
                <div className="flex items-center bg-orange-50 px-2 py-1 rounded text-orange-800">
                  <Info className="h-3.5 w-3.5 mr-1.5" />
                  <span>Impact: {item.impact}</span>
                </div>
              )}
            </div>

            {item.suggested_fix && (
              <div className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
                <span className="font-semibold text-gray-700">Suggestion: </span>
                {item.suggested_fix}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
