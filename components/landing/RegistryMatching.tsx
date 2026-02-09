"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Search, 
  ArrowRightLeft, 
  ShieldCheck, 
  Users, 
  Fingerprint,
  Clock
} from "lucide-react";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";

export default function RegistryMatching() {
  const points = [
    {
      title: "Statutory Details",
      items: ["Company name", "Registration number", "Registered address"],
      icon: <Building2 className="w-5 h-5" />
    },
    {
      title: "Directorships",
      items: ["Current Directors", "Legal representatives", "Statutory details"],
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Registry Sync",
      items: ["Malta Business Registry (MBR)", "Live data comparison", "Financial Statement cross-check"],
      icon: <Fingerprint className="w-5 h-5" />
    }
  ];

  return (
    <section className="relative py-10  md:px-20 overflow-hidden bg-slate-50/50" id="registry">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-50/20 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-5 md:px-10 relative z-10">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Right Column: Copy & Details */}
            <FadeIn className="space-y-6">
              <div className="space-y-3">
                <FadeIn>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-(--landing-primary-blue) text-xs font-medium uppercase tracking-widest">
                     Automatic Matching
                  </div>
                </FadeIn>

                <TextReveal
                  text="Malta Business Registry Matching Engine."
                  as="h2"
                  className="text-2xl md:text-5xl font-medium tracking-tight text-(--landing-text-heading) leading-[1.1]"
                />
                
                <FadeIn delay={0.2}>
                  <p className="md:text-xl text-slate-600 leading-relaxed">
                     FS AI Review is building a direct integration with the MBR to perform 
                     real-time validations of statutory data against your Financial Statements.
                  </p>
                </FadeIn>

                <ul className="grid gap-4 pt-4">
                  {[
                    "Automatic matching with the Malta Business Registry",
                    "Company name, registration number, address validation",
                    "Directors and statutory details cross-check",
                    "Direct comparison against Financial Statements"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                       <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-(--landing-primary-blue) transition-colors duration-300">
                         <div className="w-1.5 h-1.5 rounded-full bg-(--landing-primary-blue) group-hover:bg-white" />
                       </div>
                       <span className="text-base md:text-lg text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Left Column: Visual Comparison Engine */}
            <FadeIn delay={0.2} direction="right" className="relative">
              {/* Main Card */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] p-8 md:p-10 relative overflow-hidden">
                <div className="flex md:absolute top-0 right-0 p-6 md:p-10 justify-end">
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-(--landing-primary-blue) text-[10px] font-bold uppercase tracking-widest animate-pulse">
                     <Clock className="w-3 h-3" /> Coming Soon
                   </div>
                </div>

                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                    <Search className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">MBR Registry Matching</h3>
                    <p className="text-slate-500 text-sm font-medium">Auto-validation engine</p>
                  </div>
                </div>

                {/* Visual Comparison Logic */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 relative group">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MBR Registry Data</p>
                      <p className="text-sm font-bold text-slate-700">Directors & Reps</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Financial Statements</p>
                      <p className="text-sm font-bold text-slate-700">Director Disclosures</p>
                    </div>
                  </div>

                  <div className="h-px bg-linear-to-r from-transparent via-slate-200 to-transparent my-2" />

                  <div className="space-y-4">
                    {points.map((p, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-blue-50/50 flex items-center justify-center text-(--landing-primary-blue) group-hover:bg-blue-50 transition-colors">
                          {p.icon}
                        </div>
                        <div className="flex-1">
                           <h4 className="text-sm font-bold text-slate-900 mb-1">{p.title}</h4>
                           <div className="flex flex-wrap gap-x-3 gap-y-1">
                             {p.items.map((item, j) => (
                               <span key={j} className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                 <div className="w-1 h-1 rounded-full bg-slate-300" />
                                 {item}
                               </span>
                             ))}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shield Badge */}
                <div className="mt-10 flex items-center gap-3 py-3 px-5 rounded-2xl bg-(--landing-primary-blue) text-white w-fit mx-auto">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-bold tracking-tight">100% Deterministic Matching</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100/40 rounded-full blur-3xl -z-10" />
            </FadeIn>

          </div>
        </div>
      </div>
    </section>
  );
}
