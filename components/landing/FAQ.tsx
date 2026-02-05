"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import TextReveal from "./animations/TextReveal";
import FadeIn from "./animations/FadeIn";

const faqs = [
  {
    question: "How accurate is the AI in detecting audit errors?",
    answer: "Our models are trained on millions of audited financial statements with a 99.9% accuracy rate on arithmetic verification and mandatory disclosure checks."
  },
  {
    question: "Is my financial data secure and SOC2 compliant?",
    answer: "Absolutely. We use enterprise-grade 256-bit encryption. All data is processed in SOC2 Type II compliant environments and is never used to train public models."
  },
  {
    question: "Can I integrate this with Xero or QuickBooks?",
    answer: "Yes, we offer direct API integrations for Xero, QuickBooks, and Sage, allowing you to pull statements directly for instant analysis."
  },
  {
    question: "Does it support international accounting standards?",
    answer: "We currently support IFRS and US GAAP, with automated updates for the latest regulatory changes in over 40 jurisdictions."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 bg-(--landing-background) relative overflow-hidden" id="faq">
      {/* Decorative Background Elements - matching Features section */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-(--landing-primary-blue)/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--landing-purple-logo)/5 rounded-full blur-3xl -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-10">
          <FadeIn>
            <h2 className="text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest mb-3">Support & FAQ</h2>
          </FadeIn>
          <TextReveal
            text="Common Questions."
            as="h2"
            className="text-4xl md:text-5xl font-medium text-(--landing-text-heading) tracking-tight mb-3"
          />
          <p className="text-lg text-(--landing-text-gray)">
            Everything you need to know about our AI-powered compliance platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === index 
                  ? "border-(--landing-primary-blue)/30 bg-blue-50/30 shadow-sm" 
                  : "border-gray-400 hover:border-(--landing-primary-blue)/40"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-(--landing-text-heading)">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-(--landing-text-gray) transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-(--landing-primary-blue)" : ""
                  }`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-base text-(--landing-text-gray) leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
