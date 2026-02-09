"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ArrowRight, Sparkles } from "lucide-react";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";
import LandingButton from "./LandingButton";

export default function StandardsSupported() {
  const standards = [
    {
      title: "GAPSME",
      status: "Available now",
      description: "FS AI Review currently supports Malta GAPSME Financial Statements with full automated validation.",
      icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
      badge: "bg-green-50 text-green-700 border-green-100",
      available: true
    },
    {
      title: "IFRS",
      status: "Coming soon",
      description: "IFRS checks are in active development and will be released shortly to support international reporting.",
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      badge: "bg-blue-50 text-blue-700 border-blue-100",
      available: false
    }
  ];

  return (
    <section className="py-10 relative overflow-hidden bg-(--landing-background)">
      {/* Decorative Background Elements - matching Features section style */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-(--landing-primary-blue)/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--landing-purple-logo)/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        <div className="text-center mx-auto mb-8 space-y-3">
          <FadeIn>
            <h2 className="text-xs md:text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest">Digital Compliance</h2>
          </FadeIn>
          <TextReveal
            text="Standards supported"
            as="h2"
            className="text-2xl md:text-5xl font-medium tracking-tight text-(--landing-text-heading)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {standards.map((standard, idx) => (
            <FadeIn
              key={idx}
              delay={0.1 * (idx + 1)}
              className="h-full"
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative rounded-[2.5rem] p-10 border transition-all duration-500 flex flex-col h-full overflow-hidden cursor-pointer ${
                  standard.available 
                  ? "bg-white border-slate-100 hover:border-blue-200 hover:shadow-[0_32px_64px_-16px_rgba(59,130,246,0.1)]" 
                  : "bg-slate-50/50 border-slate-100/50 hover:border-slate-200"
                }`}
              >
                {/* Decorative Background Blob for active card */}
                {standard.available && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                )}

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 ${
                    standard.available 
                    ? "bg-white group-hover:scale-110 group-hover:rotate-3" 
                    : "bg-slate-100/50 grayscale group-hover:grayscale-0"
                  }`}>
                    {standard.icon}
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${standard.badge}`}>
                    {standard.status}
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 relative z-10">{standard.title}</h3>
                <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-8 grow relative z-10">
                  {standard.description}
                </p>

                {!standard.available ? (
                  <div className="space-y-6 relative z-10">
                    <div className="pt-6 border-t border-slate-200/60">
                      <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 mb-4">
                        <motion.span
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                          <Sparkles className="w-4 h-4 text-blue-400" />
                        </motion.span>
                        Early access for partners
                      </p>
                      <LandingButton 
                        href="/auth/register"
                        variant="primary" 
                      >
                        Register interest in IFRS
                      </LandingButton>
                    </div>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-slate-200/60 relative z-10">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                        standard.available ? "text-(--landing-primary-blue)" : "text-slate-400"
                      }`}>
                        Learn more 
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1`} />
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
