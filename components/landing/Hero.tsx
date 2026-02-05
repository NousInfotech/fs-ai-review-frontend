import Link from "next/link";
import { ArrowRight, CheckCircle, FileText, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 mb-6 border border-indigo-100">
              <Zap className="w-3 h-3 mr-1.5 fill-current" />
              New: AI-Powered Financial Reconciliation
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
              Automate Your Financial <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Audit & Compliance Reviews
              </span>
            </h1>
            <p className="mt-4 text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Instantly analyze financial statements for compliance errors, arithmetic inconsistencies, and disclosure breaches with enterprise-grade AI.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all hover:-translate-y-1"
              >
                Start Free Analysis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="#demo"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-gray-200 rounded-xl shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all"
              >
                View Sample Report
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>SOC2 Compliant</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>99.9% Accuracy</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span>Bank-Grade Security</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-16 relative"
          >
            <div className="relative rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-3xl lg:p-4">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Abstract UI Representation */}
                <div className="aspect-[16/9] bg-gray-50 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                  </div>
                  <div className="p-8 mt-8 grid grid-cols-12 gap-6">
                    <div className="col-span-3 space-y-3">
                      <div className="h-20 bg-white rounded-lg border border-gray-100 shadow-sm" />
                      <div className="h-8 bg-indigo-50 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                    <div className="col-span-9 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1 h-32 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                          <div className="w-8 h-8 rounded-lg bg-green-100 mb-3" />
                          <div className="h-6 w-12 bg-gray-100 rounded mb-2" />
                          <div className="h-4 w-24 bg-gray-100 rounded" />
                        </div>
                        <div className="flex-1 h-32 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                          <div className="w-8 h-8 rounded-lg bg-red-100 mb-3" />
                          <div className="h-6 w-12 bg-gray-100 rounded mb-2" />
                          <div className="h-4 w-24 bg-gray-100 rounded" />
                        </div>
                        <div className="flex-1 h-32 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 mb-3" />
                          <div className="h-6 w-12 bg-gray-100 rounded mb-2" />
                          <div className="h-4 w-24 bg-gray-100 rounded" />
                        </div>
                      </div>
                      <div className="h-64 bg-white rounded-xl border border-gray-200 shadow-sm" />
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-8 right-8 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">Audit Complete</div>
                      <div className="text-xs text-gray-500">0.4s processing time</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
