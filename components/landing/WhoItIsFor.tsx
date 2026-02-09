"use client";

import React from "react";
import { motion } from "framer-motion";
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

interface AudienceCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  highlight?: boolean;
}

const AudienceCard = ({ title, icon, description, highlight }: AudienceCardProps) => (
  <div
    className={`group relative p-8 md:p-12 rounded-[3rem] border transition-all duration-500 overflow-hidden h-full ${
      highlight 
      ? "bg-(--landing-primary-blue) border-white/10 text-white hover:shadow-[0_40px_80px_-20px_rgba(59,73,230,0.4)]" 
      : "bg-white border-slate-100 hover:border-blue-100 text-slate-900 hover:shadow-[0_32px_64px_-16px_rgba(59,130,246,0.1)]"
    }`}
  >
    {/* Animated Gradient Background */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ${
      highlight ? "bg-linear-to-br from-white to-blue-200" : "bg-linear-to-br from-blue-50 to-indigo-50"
    }`} />

    <div className="relative z-10 flex flex-col h-full">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
        highlight ? "bg-white/10 text-white border border-white/20" : "bg-blue-50 text-(--landing-primary-blue)"
      }`}>
        {icon}
      </div>
      
      <h3 className="text-xl md:text-3xl font-medium mb-4 tracking-tight leading-tight">
        {title}
      </h3>
      
      <p className={`md:text-xl leading-relaxed mb-8 grow ${
        highlight ? "text-white/80" : "text-slate-600"
      }`}>
        {description}
      </p>

      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          highlight ? "bg-white/10 text-white" : "bg-blue-50 text-(--landing-primary-blue)"
        }`}>
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className={`text-xs font-medium uppercase tracking-widest ${
          highlight ? "text-white/50" : "text-slate-400"
        }`}>
          Confidence Layer
        </span>
      </div>
    </div>
  </div>
);

export default function WhoItIsFor() {
  return (
    <section className="py-10 relative overflow-hidden bg-(--landing-background)">
      {/* Decorative Background Elements - matching Features section style */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-(--landing-primary-blue)/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--landing-purple-logo)/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-5 md:px-20 relative z-10">
        <div className="text-center mx-auto mb-10 space-y-3">
          <FadeIn>
            <h2 className="text-xs md:text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest">Audience & Use Case</h2>
          </FadeIn>
          <TextReveal
            text="Who it’s for"
            as="h2"
            className="text-2xl md:text-6xl font-medium tracking-tight text-(--landing-text-heading)"
          />
          <FadeIn delay={0.2}>
            <p className="md:text-xl text-(--landing-text-gray) leading-relaxed">
              Providing a deterministic verification layer for those who need 
              audit-grade certainty in their financial reporting.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-10 items-stretch">
          <FadeIn delay={0.1} className="h-full">
            <AudienceCard
              title="Audit & accounting firms"
              icon={<Building2 className="w-8 h-8" />}
              description="Used as a final review safety net before issuing Financial Statements to ensure zero-error reporting."
            />
          </FadeIn>
          <FadeIn delay={0.2} className="h-full">
            <AudienceCard
              title="Finance teams & businesses"
              icon={<Briefcase className="w-8 h-8" />}
              description="Used as a sanity check before board approval, bank submission, or sending Financial Statements to auditors."
              
            />
          </FadeIn>
        </div>

        {/* Professional Disclaimer */}
        <FadeIn delay={0.3} className="mx-auto text-center flex flex-col items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Disclaimer</span>
          </div>
          <p className="text-xs md:text-base text-slate-500 font-medium italic leading-relaxed">
            "FS AI Review operates as a verification tool and does not replace professional judgement or traditional audit work."
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
