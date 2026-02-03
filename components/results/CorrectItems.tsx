import { SectionA } from "@/types/review";
import { CheckCircle2, ShieldCheck } from "lucide-react";

interface CorrectItemsProps {
  data: SectionA;
}

export default function CorrectItems({ data }: CorrectItemsProps) {
  if (data.items.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <ShieldCheck className="h-6 w-6 text-green-600 mr-2" />
        {data.title}
        <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold uppercase">
          {data.items.length} Verified
        </span>
      </h3>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {data.items.map((item, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-start">
              <div className="flex-shrink-0 mr-4 mt-1">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-bold text-gray-900 mr-2">
                    {item.area}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {item.test_id}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {item.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
