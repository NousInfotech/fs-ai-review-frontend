"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Calculator, RefreshCw, BarChart3, ArrowRight } from "lucide-react";

const FeatureItem = ({ text }: { text: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-3 group"
  >
    <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
      <CheckCircle2 className="w-3.5 h-3.5 text-(--landing-primary-blue)" />
    </div>
    <span className="text-sm md:text-base text-(--landing-text-gray) font-medium">{text}</span>
  </motion.div>
);

const TotalsLoopAnimation = () => {
  const [isRunning, setIsRunning] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);

  const auditSteps = [
    "Scanning Balance Sheet items...",
    "Verifying internal consistency...",
    "Recalculating group totals...",
    "Cross-referencing notes to accounts...",
    "Final validation check complete."
  ];

  const startAudit = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsComplete(false);
    setCurrentStep(0);
    
    // Simulate steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => prev + 1);
    }, 800);

    // Simulate audit completion
    setTimeout(() => {
      clearInterval(stepInterval);
      setIsRunning(false);
      setIsComplete(true);
      setCurrentStep(auditSteps.length - 1);
    }, 4000);
  };

  return (
    <div className="relative w-full mx-auto aspect-4/3 bg-linear-to-br from-slate-50 to-blue-50/20 rounded-[2.5rem] border border-slate-200/50 overflow-hidden shadow-2xl group">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
      <motion.div 
        animate={{ 
          scale: isRunning ? [1, 1.2, 1] : 1,
          opacity: isRunning ? [0.1, 0.2, 0.1] : 0.05
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-(--landing-primary-blue) rounded-full blur-[120px] -z-10" 
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8">
        {!isRunning && !isComplete && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAudit}
            className="absolute z-30 bg-(--landing-primary-blue) text-white px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-blue-500/40 flex items-center gap-3 group/btn"
          >
            <RefreshCw className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500" />
            Run Digital Audit
          </motion.button>
        )}

        {/* Main Card Container */}
        <div className="w-full flex gap-4 h-full pt-4">
          <motion.div 
            animate={isRunning || isComplete ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0.4, scale: 0.95, x: 20, filter: "blur(2px)" }}
            transition={{ duration: 0.5 }}
            className="w-2/3 bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white p-4 md:p-6 space-y-3 relative overflow-hidden"
          >
            {/* Scanning Effect */}
            {isRunning && (
              <motion.div 
                animate={{ top: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-20 bg-linear-to-b from-transparent via-blue-500/10 to-transparent z-10"
              />
            )}

            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-(--landing-primary-blue)">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest block">Recalculation</span>
                </div>
              </div>
              {isRunning ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-(--landing-primary-blue) rounded-full animate-pulse transition-all">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
                  <span className="text-[8px] font-bold tracking-tighter">RUNNING</span>
                </div>
              ) : isComplete && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span className="text-[8px] font-bold tracking-tighter">SUCCESS</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 overflow-hidden">
              {[
                { label: "Cash @ Bank", val: 125000 },
                { label: "Accounts Receivable", val: 85000 },
                { label: "Inventory", val: 45000 },
                { label: "Fixed Assets", val: 235000 },
                { label: "Prepayments", val: 15000 },
                { label: "Current Liabilities", val: -120000 },
                { label: "Equity Part I", val: -385000 }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center px-2 py-1.5 rounded-lg border border-transparent">
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${item.val > 0 ? 'bg-blue-400' : 'bg-slate-300'}`} />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={isRunning && currentStep >= Math.floor(i/1.5) ? { 
                        opacity: [1, 0.3, 1],
                        y: [0, -1, 0]
                      } : {}}
                      className="text-[10px] font-mono font-bold text-slate-800"
                    >
                      {item.val < 0 ? '-' : ''}€{Math.abs(item.val).toLocaleString()}.00
                    </motion.div>
                    {isComplete || (isRunning && currentStep >= Math.floor(i/1.5)) ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      </motion.div>
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-100" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <motion.div className="pt-2">
              <div className={`flex justify-between items-center p-3 rounded-xl transition-all duration-700 ${isComplete ? 'bg-(--landing-primary-blue) shadow-blue-500/40' : 'bg-slate-100 shadow-none'} shadow-lg relative overflow-hidden`}>
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isComplete ? 'text-white' : 'text-slate-400'}`}>
                  Consolidated
                </span>
                <span className={`text-sm font-mono font-bold transition-colors ${isComplete ? 'text-white' : 'text-slate-500'}`}>
                  €0.00
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Audit Verification Log - Right Side Panel */}
          <motion.div 
            animate={isRunning || isComplete ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.95, x: -20 }}
            className="w-1/3 bg-slate-900 rounded-2xl md:rounded-3xl p-4 shadow-2xl border border-slate-800 space-y-4 overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Log</span>
            </div>
            
            <div className="space-y-4">
              {auditSteps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 5 }}
                  animate={currentStep >= i ? { opacity: 1, x: 0 } : { opacity: 0.1 }}
                  className="flex gap-2"
                >
                  <div className="shrink-0 mt-1">
                    {(isComplete || currentStep > i) ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : currentStep === i ? (
                      <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-700" />
                    )}
                  </div>
                  <p className={`text-[9px] font-medium leading-tight transition-colors ${currentStep >= i ? 'text-slate-200' : 'text-slate-600'}`}>
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>

            {isComplete && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2 mt-auto"
              >
                <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-[8px] font-bold text-green-400 uppercase tracking-tighter text-center">
                    Audit Certified
                  </p>
                </div>
                <button
                  onClick={startAudit}
                  className="w-full text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-3 hover:text-blue-300 transition-colors"
                >
                  Reset Check
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Floating caption */}
        {/* <motion.div
          animate={isComplete ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          style={{ bottom: "20px" }}
          className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-auto bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-white flex items-center justify-center gap-4 transition-all z-20 pointer-events-none"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-tight">
             {isComplete ? "“Audit results verified for digital sign-off.”" : "“Deterministic review results recalculated.”"}
          </p>
        </motion.div> */}
      </div>
    </div>
  );
};

export default function AuditGradeChecks() {
  return (
    <section className="py-10 px-5 md:px-20 relative overflow-hidden bg-(--landing-background)">
      {/* Section Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute -left-20 top-20 w-64 h-64 bg-blue-50 rounded-full blur-[100px] opacity-50" />
      
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 xl:gap-24">
          
          {/* Left Content */}
          <div className="space-y-5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-(--landing-primary-blue) text-xs font-medium uppercase tracking-widest border border-blue-100">
                <BarChart3 className="w-3.5 h-3.5 mr-2" />
                Audit-Grade Analysis
              </div>
              <h2 className="text-5xl font-medium tracking-tight text-(--landing-text-heading) leading-[1.1]">
                What FS AI Review does
              </h2>
              <p className="text-lg md:text-xl text-(--landing-text-gray) leading-relaxed">
                FS AI Review runs deterministic, audit-grade checks on Financial Statements to catch issues 
                that slip through manual reviews.
              </p>
            </motion.div>

            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--landing-primary-blue)">
                It helps firms:
              </p>
              <div className="grid gap-5">
                {[
                  "catch errors before partner sign-off",
                  "reduce last-minute review notes",
                  "create defensible review evidence"
                ].map((text, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (idx * 0.15) }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-(--landing-primary-blue) group-hover:text-white transition-all duration-300">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-base md:text-lg text-(--landing-text-gray) font-medium group-hover:text-(--landing-text-heading) transition-colors">{text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-6 pl-4 border-l-2 border-(--landing-primary-blue) text-sm text-slate-600 font-medium italic leading-relaxed"
            >
              "This is not black-box AI. Figures are recalculated. Issues are shown visually."
            </motion.p>
          </div>

          {/* Right Animation */}
          <div className="w-full order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <TotalsLoopAnimation />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
