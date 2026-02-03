"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <FileText className="h-6 w-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">Audit Portal</span>
        </div>
        <Link 
          href="/login"
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all"
        >
          Sign In
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Coming Soon
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            AI-Powered Financial <br /> Statement Review
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Streamline your audit workflow with intelligent document analysis. 
            Automated extraction, risk detection, and compliance verification for modern finance teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-900/20 transition-all flex items-center gap-2 group">
              Request Early Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all">
              View Demo
            </button>
          </div>
        </motion.div>

        {/* Feature Grid Teaser */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto w-full text-left"
        >
          {[
            {
              title: "Automated Extraction",
              desc: "Instantly parse PDFs and extract key financial data points with high accuracy.",
              icon: FileText
            },
            {
              title: "Risk Detection",
              desc: "Identify anomalies and potential compliance issues automatically.",
              icon: Shield
            },
            {
              title: "Audit Trail",
              desc: "Complete history of reviews and findings for full accountability.",
              icon: CheckCircle
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 Financial Review. All rights reserved.</p>
      </footer>
    </div>
  );
}
