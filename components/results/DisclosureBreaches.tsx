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
                  {item.test_id}
                </span>
                {item.category && (
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                )}
              </div>
            </div>

            <h4 className="text-base font-bold text-gray-900 mb-2">{item.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>

            {item.result && (
              <p className="text-sm text-yellow-800 bg-yellow-50 px-3 py-2 rounded border border-yellow-100 mb-3 font-medium">
                {item.result}
              </p>
            )}

            <div className="flex flex-col gap-2 mt-3">
              {item.location && item.location.length > 0 && item.location.map((loc, lIdx) => (
                <div key={lIdx} className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 px-2 py-1.5 rounded">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1.5 text-gray-400" />
                    <span>Page {loc.page_no}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
