"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";
import LandingButton from "./LandingButton";
import { MessageSquare, Check, Zap, Clock, BarChart3 } from "lucide-react";

export default function Pricing() {
  return (
    <section className="relative py-10 overflow-hidden bg-(--landing-background-secondary)" id="pricing">
      {/* Background Decor - consistent with other sections */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-(--landing-primary-blue)/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-(--landing-purple-logo)/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-10 z-10">
        <FadeIn direction="up" distance={30} duration={0.8}>
          <div className="text-center mb-10">
            <h2 className="text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest mb-3">Pricing</h2>
            <TextReveal
              text="Simple, Transparent Models."
              as="h2"
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-(--landing-text-heading) tracking-tight mb-3"
            />
            <p className="text-(--landing-text-gray) text-xl mx-auto leading-relaxed">
              €6.50 per Financial Statements review. No subscriptions. No contracts.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Standard Review Card */}
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative p-8 rounded-[2.5rem] border bg-white/80 border-white shadow-xl shadow-blue-100/40 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 backdrop-blur-md flex flex-col"
          >
            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-(--landing-primary-blue)/10 pointer-events-none" />
            
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-(--landing-primary-blue)" />
              </div>
              <h3 className="text-2xl font-bold text-(--landing-text-heading) mb-2">Standard Review</h3>
              <p className="text-(--landing-text-gray) text-base">Professional Digital Audit</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-extrabold text-slate-900 tracking-tighter">€6.50</span>
                <span className="text-slate-400 font-medium">/ review</span>
              </div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-(--landing-primary-blue) text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                Pay on demand
              </div>
            </div>

            <div className="grow space-y-4 mb-10">
              {[
                "No subscriptions.",
                "No contracts.",
                "Checks never expire."
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-base text-(--landing-text-heading) font-medium opacity-90">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-(--landing-primary-blue)/10 text-(--landing-primary-blue)">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <LandingButton 
              href="/auth/register"
              variant="primary" 
              className="w-full justify-center py-4! text-base!"
            >
              Get 3 free checks
            </LandingButton>
          </motion.div>

          {/* Volume Pricing Card */}
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative p-8 rounded-[2.5rem] border bg-white/40 border-white/50 hover:bg-white/60 hover:border-white shadow-sm hover:shadow-lg transition-all duration-500 backdrop-blur-md flex flex-col"
          >
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-(--landing-text-heading) mb-2">Volume Pricing</h3>
              <p className="text-(--landing-text-gray) text-base">For firms & high-volume</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">Custom</span>
              </div>
              <p className="text-sm text-slate-400 font-medium">Rates for 100+ files/year</p>
            </div>

            <div className="grow space-y-4 mb-10">
              {[
                "Bulk review automation",
                "Advanced team management",
                "Priority firm support",
                "Dedicated data security"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-base text-(--landing-text-heading) font-medium opacity-90">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-gray-500">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <LandingButton 
              href="#contact"
              variant="outline" 
            >
              Request volume pricing
            </LandingButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
