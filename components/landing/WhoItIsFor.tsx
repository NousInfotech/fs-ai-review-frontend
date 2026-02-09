"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Building2, 
  Briefcase, 
  ShieldCheck, 
  AlertCircle,
  Users2,
  ArrowRight
} from "lucide-react";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";

export default function WhoItIsFor() {
  const audiences = [
    {
      title: "Audit & accounting firms",
      icon: <Building2 className="w-6 h-6" />,
      description: "Used as a final review safety net before issuing Financial Statements to ensure zero-error reporting.",
      highlight: true
    },
    {
      title: "Finance teams & businesses",
      icon: <Briefcase className="w-6 h-6" />,
      description: "Used as a sanity check before board approval, bank submission, or sending Financial Statements to auditors.",
      highlight: false
    }
  ];

  return (
    <section className="py-10 relative overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-(--landing-primary-blue)/5 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-5 md:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-16 items-stretch">
          
          {/* Left Column: Content & Checklist */}
          <div className="order-1 lg:order-1 space-y-10 flex flex-col justify-center">
            <div className="space-y-3">
              <FadeIn>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-(--landing-primary-blue) text-xs font-semibold uppercase tracking-widest border border-blue-100">
                  <Users2 className="w-3.5 h-3.5 mr-2" />
                  Audience & Use Case
                </div>
              </FadeIn>
              
              <TextReveal
                text="Who it’s for"
                as="h2"
                className="text-2xl md:text-5xl font-medium tracking-tight text-(--landing-text-heading) leading-[1.1]"
              />
              
              <FadeIn delay={0.2}>
                <p className="md:text-xl text-(--landing-text-gray) leading-relaxed">
                  Providing a deterministic verification layer for those who need 
                  audit-grade certainty in their financial reporting.
                </p>
              </FadeIn>
            </div>

            <div className="space-y-6">
              {audiences.map((audience, idx) => (
                <FadeIn key={idx} delay={0.3 + (idx * 0.1)}>
                  <div className="flex md:flex-row flex-col items-start gap-6 p-6 rounded-3xl transition-all duration-500 bg-slate-50 border border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-white text-(--landing-primary-blue) flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      {audience.icon}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{audience.title}</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {audience.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Right Column: Dual Image/Visual Stack */}
          <div className="order-2 lg:order-2 flex flex-row lg:flex-col gap-4 md:gap-6 h-[180px] md:h-full">
            <FadeIn direction="right" className="w-1/2 lg:w-full h-full lg:h-1/2">
              <div className="relative h-full rounded-2xl md:rounded-4xl overflow-hidden bg-slate-100 shadow-2xl group border border-slate-100">
                <Image 
                  src="/images/landing/whoitsfor-1-new.png"
                  alt="Audit & accounting firms visual"
                  fill
                  className="object-cover"
                />
                {/* Overlay Shine */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2} className="w-1/2 lg:w-full h-full lg:h-1/2">
              <div className="relative h-full rounded-2xl md:rounded-4xl overflow-hidden bg-slate-100 shadow-2xl group border border-slate-100">
                <Image 
                  src="/images/landing/whoitsfor-2.png"
                  alt="Finance teams & businesses visual"
                  fill
                  className="object-cover"
                />
                {/* Overlay Shine */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
              </div>
            </FadeIn>
          </div>

        </div>

        {/* Professional Disclaimer - Centered at the bottom */}
        <FadeIn delay={0.5} className="mt-10 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Disclaimer</span>
          </div>
          <p className="text-xs text-slate-500 font-medium italic leading-relaxed text-center">
            "FS AI Review operates as a verification tool and does not replace professional judgement or traditional audit work."
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
