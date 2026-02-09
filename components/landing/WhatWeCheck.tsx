"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  FileText, 
  Layout, 
  CheckCircle2, 
  Camera,
  ArrowRight
} from "lucide-react";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";
import LandingCard from "./LandingCard";


export default function WhatWeCheck() {
  const categories = [
    {
      title: "Totals & arithmetic",
      icon: <Calculator className="w-7 h-7" />,
      items: [
        "Column totals and subtotals",
        "Cross-casts and roll-forwards",
        "Comparative year consistency"
      ]
    },
    {
      title: "Notes & statements",
      icon: <FileText className="w-7 h-7" />,
      items: [
        "Statement line items vs related notes",
        "Closing balances vs disclosures",
        "Missing or inconsistent references"
      ]
    },
    {
      title: "Formatting & presentation",
      icon: <Layout className="w-7 h-7" />,
      items: [
        "Misaligned columns and margins",
        "Broken numbers and digit spillovers",
        "Incorrect number formats"
      ]
    }
  ];

  return (
    <section className="py-10 relative overflow-hidden bg-slate-50/50">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="container mx-auto px-5 md:px-20 relative z-10">
        <div className="text-center mx-auto mb-10 space-y-3">
          <FadeIn>
            <h2 className="text-xs md:text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest">Digital Audit Scope</h2>
          </FadeIn>
          <TextReveal
            text="What we check"
            as="h2"
            className="text-2xl md:text-6xl font-medium tracking-tight text-(--landing-text-heading)"
          />
          <FadeIn delay={0.2}>
            <p className=" md:text-xl text-(--landing-text-gray) leading-relaxed">
              Our engine performs 1,000+ deterministic checks designed specifically for 
              complex financial disclosures.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <LandingCard
              key={idx}
              icon={cat.icon}
              title={cat.title}
              delay={0.1 * (idx + 1)}
            >
              <div className="space-y-4">
                {cat.items.map((item, id) => (
                  <div key={id} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mt-1 group-hover:bg-blue-50 transition-colors">
                      <CheckCircle2 className="w-3 h-3 text-slate-300 group-hover:text-(--landing-primary-blue) transition-colors" />
                    </div>
                    <span className="text-base text-slate-600 font-medium leading-tight group-hover:text-slate-900 transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </LandingCard>
          ))}
        </div>

        {/* Evidence Footer */}
        <FadeIn delay={0.4} className="flex items-center justify-center gap-3 mt-10">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4 text-(--landing-primary-blue)" />
          </div>
          <p className="md:text-base text-xs text-slate-500 font-medium">
            Every issue includes <span className="text-slate-900 font-semibold italic">screenshot evidence.</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
