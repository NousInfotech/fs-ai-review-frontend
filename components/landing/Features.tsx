"use client"
import { useState } from "react";
import { 
  ShieldCheck, 
  Search, 
  FileCheck, 
  BarChart3, 
  Zap, 
  Lock,
  X,
  ArrowRight
} from "lucide-react";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";
import LandingCard from "./LandingCard";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import LandingButton from "./LandingButton";

const features = [
  {
    id: 1,
    name: 'Automated Compliance',
    description: 'Instantly verify financial statements against thousands of regulatory rules (IFRS, GAAP) and internal policies.',
    expandedDescription: 'Our engine performs deep semantic analysis of disclosures, checking everything from IFRS 16 lease accounting to specific GAPSME requirements. It doesn\'t just find errors; it ensures full regulatory adherence across 1,000+ localized accounting rules.',
    icon: ShieldCheck,
    span: "lg:col-span-3 lg:row-span-2",
    delay: 0.1,
  },
  {
    id: 2,
    name: 'Discrepancy Detection',
    description: 'Identify arithmetic errors and inconsistencies across sections.',
    expandedDescription: 'Every number on every page is cross-referenced. If a figure in the Cash Flow statement doesn\'t match the corresponding Note, or if a subtotal fails to sum, our system flags it with the exact mathematical discrepancy.',
    icon: Search,
    span: "lg:col-span-2 lg:row-span-2 lg:col-start-4",
    delay: 0.2,
  },
  {
    id: 3,
    name: 'Evidence Mapping',
    description: 'Visual bounding boxes highlights suspected issues.',
    expandedDescription: 'Direct linkage between the audit finding and the raw document. Click a failure and the original PDF opens with the specifically highlighted area, providing defensible, audit-grade evidence for every single flag.',
    icon: FileCheck,
    span: "lg:col-span-2 lg:row-span-2 lg:row-start-3",
    delay: 0.3,
  },
  {
    id: 4,
    name: 'Real-time Analytics',
    description: 'Track failure trends and performance with interactive dashboards.',
    expandedDescription: 'Gain high-level insights into your firm\'s quality control. See which accounts generate the most errors, monitor team review speeds, and identify systemic reporting issues before they reach the partner level.',
    icon: BarChart3,
    span: "lg:col-span-3 lg:row-span-2 lg:col-start-3 lg:row-start-3",
    delay: 0.4,
  },
  {
    id: 5,
    name: 'Lightning Fast Processing',
    description: 'Process hundreds of pages in seconds. Reduce audit time from days to minutes.',
    expandedDescription: 'Built on a high-concurrency Rust-based processing engine, FS AI Review can ingest 500+ page annual reports and return a full audit summary in under 120 seconds. It works at the speed of your cursor.',
    icon: Zap,
    span: "lg:col-span-3 lg:row-span-2 lg:row-start-5",
    delay: 0.5,
  },
  {
    id: 6,
    name: 'Enterprise Security',
    description: 'SOC2 Type II certified infrastructure with end-to-end encryption.',
    expandedDescription: 'We prioritize data sovereignty. All documents are encrypted with AES-256 at rest and TLS 1.3 in transit. We offer granular access controls and strict data retention policies to meet the most demanding compliance needs.',
    icon: Lock,
    span: "lg:col-span-2 lg:row-span-2 lg:col-start-4 lg:row-start-5",
    delay: 0.6,
  },
];

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

  return (
    <div className="py-10 bg-(--landing-background) relative overflow-hidden" id="features">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-(--landing-primary-blue)/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--landing-purple-logo)/5 rounded-full blur-3xl -z-10" />

      <div className="mx-auto px-5 lg:px-20">
        <div className="text-center mx-auto mb-10">
          <FadeIn>
            <h2 className="text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest mb-3">Powerful Capabilities</h2>
          </FadeIn>
          <TextReveal
            text="Everything you need for a flawless audit"
            as="h2"
            className="text-4xl md:text-6xl font-medium text-(--landing-text-heading) tracking-tight mb-3"
          />
          <FadeIn delay={0.2}>
            <p className="text-xl text-(--landing-text-gray) leading-relaxed mx-auto">
              Stop manually ticking and bashing. Let our AI handle the tedious verification so you can focus on strategic judgment.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 lg:grid-rows-6 gap-6">
          {features.map((feature) => (
            <LandingCard
              key={feature.id}
              icon={feature.icon}
              title={feature.name}
              description={feature.description}
              delay={feature.delay}
              className={feature.span}
              footer={
                <button 
                  onClick={() => setSelectedFeature(feature)}
                  className="flex items-center gap-2 text-(--landing-primary-blue) font-semibold hover:gap-3 transition-all group/btn"
                >
                  Learn more 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              }
            />
          ))}
        </div>
      </div>

      {/* Modal Implementation */}
      <AnimatePresence>
        {selectedFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-8 right-8 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-(--landing-primary-blue)/10 flex items-center justify-center">
                    <selectedFeature.icon className="w-8 h-8 text-(--landing-primary-blue)" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-medium text-slate-900 tracking-tight">
                      {selectedFeature.name}
                    </h2>
                    <p className="text-(--landing-primary-blue) font-medium">Detailed Feature Overview</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-xl text-slate-700 leading-relaxed font-medium">
                    {selectedFeature.description}
                  </p>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {selectedFeature.expandedDescription}
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                  <LandingButton 
                    onClick={() => setSelectedFeature(null)}
                  >
                    Got it, thanks
                  </LandingButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
