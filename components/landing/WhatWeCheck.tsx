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
import Link from "next/link";
import Image from "next/image";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";
import LandingCard from "./LandingCard";



const CategoryVisual = ({ category, index }: { category: any, index: number }) => {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full h-full min-h-[250px] md:min-h-full rounded-[10px] overflow-hidden md:shadow-2xl border border-slate-100 group/visual"
    >
      <Image 
        src={category.image}
        alt={category.title}
        fill
        className="object-cover"
      />
      {/* Subtle Shine/Reflect effect */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
    </motion.div>
  );
};

export default function WhatWeCheck() {
  const categories = [
    {
      title: "Totals & arithmetic",
      description: "We verify every calculation across your financial statements to ensure absolute precision.",
      icon: <Calculator className="w-7 h-7" />,
      image: "/images/landing/financial-precision-and-verification-tools.png",
      items: [
        "Column totals and subtotals",
        "Cross-casts and roll-forwards",
        "Comparative year consistency"
      ]
    },
    {
      title: "Notes & statements",
      description: "Automatic cross-referencing between primary statements and detailed disclosure notes.",
      icon: <FileText className="w-7 h-7" />,
      image: "/images/landing/notes-and-statements.png",
      items: [
        "Statement line items vs related notes",
        "Closing balances vs disclosures",
        "Missing or inconsistent references"
      ]
    },
    {
      title: "Formatting & presentation",
      description: "Catching visual and formatting errors that undermine professional credibility.",
      icon: <Layout className="w-7 h-7" />,
      image: "/images/landing/formatting-errors-in-financial-documents.png",
      items: [
        "Misaligned columns and margins",
        "Broken numbers and digit spillovers",
        "Incorrect number formats"
      ]
    }
  ];

  return (
    <section className="py-10 relative overflow-hidden bg-white">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="container mx-auto px-5 lg:px-20 relative z-10">
        <div className="mx-auto text-center mb-5 md:mb-10 space-y-3">
          <FadeIn>
            <h2 className="text-xs md:text-sm font-semibold text-(--landing-primary-blue) uppercase tracking-[0.2em]">Digital Audit Scope</h2>
          </FadeIn>
          <TextReveal
            text="What we check"
            as="h2"
            className="text-2xl md:text-6xl font-medium tracking-tight text-(--landing-text-heading) leading-[1.1]"
          />
          <FadeIn delay={0.2}>
            <p className="md:text-xl text-(--landing-text-gray) mx-auto">
               Our engine performs 1,000+ deterministic checks designed specifically for complex financial disclosures.
            </p>
          </FadeIn>
        </div>

        <div className="md:space-y-25">
          {categories.map((cat, idx) => (
            <div key={idx} className={`flex flex-col gap-5 md:gap-24 md:items-stretch ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
              
              {/* Content Side */}
              <div className="w-full md:w-1/2 space-y-8 flex flex-col justify-center py-4">
                <FadeIn direction={idx % 2 === 1 ? "right" : "left"}>
                  <div className="space-y-4 md:space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-1 rounded-2xl bg-blue-50 text-(--landing-primary-blue) border border-blue-100/50">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs font-medium uppercase tracking-widest">{cat.title}</span>
                    </div>
                    
                    <h3 className="text-xl md:text-4xl font-medium text-(--landing-text-heading) tracking-tight">
                      {cat.title}
                    </h3>
                    
                    <p className="text-sm md:text-lg text-(--landing-text-gray) leading-relaxed">
                      {cat.description}
                    </p>
                    
                    <ul className="space-y-4">
                      {cat.items.map((item, id) => (
                        <li key={id} className="flex items-center gap-4 group">
                          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 ">
                             <CheckCircle2 className="w-3.5 h-3.5 text-(--landing-primary-blue)" />
                          </div>
                          <span className="text-sm md:text-lg text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              </div>

              {/* Visual Side */}
              <div className="w-full md:w-1/2 flex flex-col">
                <CategoryVisual category={cat} index={idx} />
              </div>

            </div>
          ))}
        </div>

        {/* Evidence Footer - Simplified Tag */}
        <FadeIn delay={0.4} className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-3">
            <Camera className="w-3.5 h-3.5 text-(--landing-primary-blue)" />
            <p className="text-[11px] md:text-xs text-slate-500 font-medium">
              Every identified issue includes <span className="text-slate-900 font-bold">screenshot evidence</span> for rapid resolution.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
