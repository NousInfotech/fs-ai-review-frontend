"use client"
import { UploadCloud, ScanSearch, FileCheck2 } from "lucide-react";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "1. Upload Documents",
    description: "Drag and drop your financial statements (PDF, Excel). We support scanned documents too.",
    icon: UploadCloud,
    color: "(--landing-primary-blue)",
  },
  {
    id: 2,
    title: "2. AI Analysis",
    description: "Our engine extracts data, verifies calculations, and checks compliance rules instantly.",
    icon: ScanSearch,
    color: "(--landing-primary-blue)",
  },
  {
    id: 3,
    title: "3. Review & Export",
    description: "Verify flagged issues with visual evidence and export your clean audit report.",
    icon: FileCheck2,
    color: "(--landing-primary-blue)",
  }
];

export default function HowItWorks() {
  return (
    <div className="py-10 bg-(--landing-background-secondary) relative overflow-hidden" id="how-it-works">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-(--landing-primary-blue)/5 rounded-full blur-3xl -z-10" />

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <FadeIn>
            <h2 className="text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest mb-3">Our Process</h2>
          </FadeIn>
          <TextReveal
            text="Audit in three simple steps"
            as="h2"
            className="text-4xl font-medium text-(--landing-text-heading) sm:text-5xl tracking-tight mb-3"
          />
          <FadeIn delay={0.2}>
            <p className="mx-auto text-xl text-(--landing-text-gray) leading-relaxed">
              From upload to final report in less than 2 minutes. Our automated pipeline handles the heavy lifting.
            </p>
          </FadeIn>
        </div>

        <div className="relative">
          {/* Connector Lines (Desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 z-0">
            <div className="flex justify-between w-full h-full relative">
              {/* Line between 1 and 2 */}
              <div className="w-1/2 h-full bg-gray-200 relative overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: "100%" }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                   className="absolute inset-0 bg-(--landing-primary-blue)/40"
                />
              </div>
              {/* Line between 2 and 3 */}
              <div className="w-1/2 h-full bg-gray-200 relative overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: "100%" }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 1.8, ease: "easeInOut" }}
                   className="absolute inset-0 bg-(--landing-primary-blue)/40"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {steps.map((step, index) => (
              <FadeIn 
                key={step.id} 
                delay={0.2 * (index + 1)} 
                direction="up"
                distance={30}
                className="text-center group"
              >
                <div className="relative mb-8 inline-block">
                  <div className="w-20 h-20 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                    <step.icon className="w-10 h-10 text-(--landing-primary-blue)" />
                  </div>
                  {/* Step Number Badge */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 * (index + 2), type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-(--landing-primary-blue) text-white text-sm font-bold flex items-center justify-center border-4 border-white shadow-md"
                  >
                    {step.id}
                  </motion.div>
                </div>
                
                <h3 className="text-2xl font-medium text-(--landing-text-heading) mb-4 group-hover:text-(--landing-primary-blue) transition-colors">
                  {step.title.split('. ')[1]}
                </h3>
                <p className="text-lg text-(--landing-text-gray) leading-relaxed px-4">
                  {step.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
