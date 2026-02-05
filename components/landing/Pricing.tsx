"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";
import LandingButton from "./LandingButton";
import { MessageSquare, Check } from "lucide-react";

// Define categories for tabs
type Category = "Essentials" | "Strategic" | "Corporate";

const categories: Category[] = ["Essentials", "Strategic", "Corporate"];

const pricingData = {
  Essentials: [
    {
      title: "Accounting & Finance",
      intro: "Core financial management.",
      scope: "Monthly fee based on volume",
      features: [
        "Monthly bookkeeping",
        "VAT & Tax compliance",
        "Management reporting",
        "Xero / QuickBooks setup",
      ],
      highlight: true,
    },
    {
      title: "Tax & Compliance",
      intro: "Stay fully compliant.",
      scope: "Fixed annual or monthly",
      features: [
        "Corporate tax returns",
        "VAT return filing",
        "Payroll processing",
        "Regulatory liaison",
      ],
    },
  ],
  Strategic: [
    {
      title: "Audit & Assurance",
      intro: "Rigorous statutory audits.",
      scope: "Quoted per engagement",
      features: [
        "Statutory financial audit",
        "Internal control review",
        "Risk assessment",
        "Compliance assurance",
      ],
    },
    {
      title: "Advisory & Growth",
      intro: "Scale your business.",
      scope: "Project or retainer",
      features: [
        "Financial modeling",
        "M&A support",
        "Cash flow optimization",
        "Strategic planning",
      ],
      highlight: true,
    },
  ],
  Corporate: [
    {
      title: "Corporate Services",
      intro: "Company administration.",
      scope: "Annual & project fees",
      features: [
        "Company formation",
        "Registered office",
        "Company secretary",
        "Share transfers",
      ],
    },
    {
      title: "Licensing & Regulated",
      intro: "Complex authorizations.",
      scope: "Project based",
      features: [
        "License applications",
        "Regulatory reporting",
        "Compliance monitoring",
        "Authority correspondence",
      ],
      highlight: true,
    },
  ],
};

const SectionBadge = ({ text }: { text: string }) => (
  <div className="inline-flex items-center rounded-lg border-2 border-dashed border-(--landing-primary-blue)/30 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-(--landing-text-heading) bg-white/50 backdrop-blur-sm mb-6">
    {text}
  </div>
);

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<Category>("Essentials");

  return (
    <section className="relative py-10 overflow-hidden bg-(--landing-background-secondary)" id="pricing">
      {/* Background Decor - consistent with other sections */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-(--landing-primary-blue)/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-(--landing-purple-logo)/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header & Tabs reveal together */}
        <FadeIn direction="up" distance={30} duration={0.8}>
          <div className="text-center mb-10">
            <h2 className="text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest mb-3">Transparent Pricing</h2>
            <TextReveal
              text="Simple, Transparent Models."
              as="h2"
              className="text-4xl md:text-5xl font-medium text-(--landing-text-heading) tracking-tight mb-3"
            />
            <p className="text-(--landing-text-gray) text-xl mx-auto leading-relaxed max-w-2xl">
              Pricing designed to scale with you. Choose the services that match your current stage.
            </p>
          </div>

          {/* Custom Glass Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/40 p-1.5 rounded-full border border-white/60 shadow-sm backdrop-blur-xl flex gap-1 relative">
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
                    activeTab === tab ? "text-white" : "text-(--landing-text-gray) hover:text-(--landing-text-dark)"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="glassTab"
                      className="absolute inset-0 bg-(--landing-primary-blue) rounded-full shadow-lg shadow-blue-500/20"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Content Area - Simplified and Smooth */}
        <div className="min-h-[500px] relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {pricingData[activeTab].map((card, index) => (
                <motion.div
                  key={`${activeTab}-${index}`}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`group relative p-8 rounded-3xl border transition-all duration-500 backdrop-blur-md flex flex-col ${
                    card.highlight
                      ? "bg-white/80 border-white shadow-xl shadow-blue-100/40 hover:shadow-2xl hover:shadow-blue-200/50"
                      : "bg-white/40 border-white/50 hover:bg-white/60 hover:border-white shadow-sm hover:shadow-lg"
                  }`}
                >
                  {card.highlight && (
                    <div className="absolute inset-0 rounded-3xl border-2 border-(--landing-primary-blue)/10 pointer-events-none" />
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-medium text-(--landing-text-heading) mb-2 group-hover:text-(--landing-primary-blue) transition-colors">{card.title}</h3>
                    <p className="text-(--landing-text-gray) text-base">{card.intro}</p>
                  </div>

                  <div className="grow space-y-4 mb-10">
                    {card.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-base text-(--landing-text-heading) font-medium opacity-90">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${card.highlight ? "bg-(--landing-primary-blue)/10 text-(--landing-primary-blue)" : "bg-gray-100 text-gray-500"}`}>
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-8 border-t border-gray-100/50">
                    <p className="text-xs font-medium uppercase tracking-widest text-(--landing-text-gray)/60 mb-2">Pricing Model</p>
                    <p className="text-lg font-medium text-(--landing-primary-blue) tracking-tight">{card.scope}</p>
                  </div>
                </motion.div>
              ))}

              {/* Custom Quote Card */}
              <motion.div 
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative p-8 rounded-3xl border border-white/60 bg-linear-to-br from-white/60 to-white/30 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-(--landing-primary-blue)/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <MessageSquare className="w-8 h-8 text-(--landing-primary-blue)" />
                </div>
                <h3 className="text-xl font-medium text-(--landing-text-heading) mb-3">Need a custom quote?</h3>
                <p className="text-base text-(--landing-text-gray) mb-8 max-w-[240px]">
                  Get a tailored proposal based on your exact requirements.
                </p>
                <LandingButton 
                  href="#contact"
                  variant="primary" 
                  className="w-full justify-center py-4! text-base!"
                >
                  Get a Quote
                </LandingButton>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

