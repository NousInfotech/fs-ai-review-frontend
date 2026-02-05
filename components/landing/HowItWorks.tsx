import { UploadCloud, ScanSearch, FileCheck2 } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="py-24 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Audit in three simple steps
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            From upload to final report in less than 2 minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white rounded-full border-4 border-indigo-50 flex items-center justify-center mb-6 shadow-sm">
                <UploadCloud className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Upload Documents</h3>
              <p className="text-gray-500">
                Drag and drop your financial statements (PDF, Excel). We support scanned documents too.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white rounded-full border-4 border-indigo-50 flex items-center justify-center mb-6 shadow-sm">
                <ScanSearch className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. AI Analysis</h3>
              <p className="text-gray-500">
                Our engine extracts data, verifies calculations, and checks compliance rules instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white rounded-full border-4 border-indigo-50 flex items-center justify-center mb-6 shadow-sm">
                <FileCheck2 className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Review & Export</h3>
              <p className="text-gray-500">
                Verify flagged issues with visual evidence and export your clean audit report.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
