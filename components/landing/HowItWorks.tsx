"use client";

import { useRef, useState } from "react";
import { 
  UploadCloud, 
  ScanSearch, 
  Database, 
  Calculator, 
  ClipboardCheck 
} from "lucide-react";
import FadeIn from "./animations/FadeIn";
import TextReveal from "./animations/TextReveal";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Upload Documents",
    description: "Securely upload your Financial Statements in PDF or Word format. Our engine immediately begins structural analysis.",
    icon: UploadCloud,
    threshold: 0.1, // Approximate scroll position for activation
  },
  {
    id: 2,
    title: "Data Extraction",
    description: "Our proprietary extraction engine automatically identifies tables, notes, and figures with 99.9% accuracy.",
    icon: Database,
    threshold: 0.3,
  },
  {
    id: 3,
    title: "Digital Recalculation",
    description: "Every total, subtotal, and cross-reference is recalculated deterministically. No 'black-box' estimation.",
    icon: Calculator,
    threshold: 0.5,
  },
  {
    id: 4,
    title: "Visual Evidence Mapping",
    description: "Suspected issues are flagged directly on the document with visual bounding boxes for immediate context.",
    icon: ScanSearch,
    threshold: 0.7,
  },
  {
    id: 5,
    title: "Final Summary Report",
    description: "Generate a professional, review-ready summary that details every finding with specific screenshot evidence.",
    icon: ClipboardCheck,
    threshold: 0.9,
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="py-10 relative overflow-hidden" id="how-it-works" ref={containerRef}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-(--landing-primary-blue)/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-(--landing-purple-logo)/5 rounded-full blur-3xl -z-10" />
      
      <div className="mx-auto px-5 lg:px-8">
        <div className="text-center mb-10">
          <FadeIn>
            <h2 className="text-xs md:text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest mb-3">Our Process</h2>
          </FadeIn>
          <TextReveal
            text="Audit in five simple steps"
            as="h2"
            className="text-2xl md:text-6xl font-medium text-(--landing-text-heading) tracking-tight mb-3"
          />
          <FadeIn delay={0.2}>
            <p className="mx-auto md:text-xl text-(--landing-text-gray) leading-relaxed">
              From upload to final report in less than 2 minutes. Our automated pipeline handles the heavy lifting.
            </p>
          </FadeIn>
        </div>

        <div className="relative">
          {/* Central Vertical Line (Desktop) */}
          <div className="absolute left-8 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-px bg-slate-100 h-full">
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute inset-0 bg-linear-to-b from-(--landing-primary-blue) to-indigo-400 w-full"
            />
          </div>

          <div className="space-y-20 lg:space-y-25">
            {steps.map((step, index) => (
              <TimelineStep 
                key={step.id} 
                step={step} 
                index={index} 
                scrollYProgress={scrollYProgress} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ step, index, scrollYProgress }: { step: typeof steps[0], index: number, scrollYProgress: any }) {
  const isEven = index % 2 === 1;
  const stepRef = useRef(null);

  // Link opacity and movement to when the scroll line reaches the threshold
  const opacity = useTransform(scrollYProgress, 
    [step.threshold - 0.1, step.threshold], 
    [0, 1]
  );
  
  const xTranslate = useTransform(scrollYProgress, 
    [step.threshold - 0.1, step.threshold], 
    [isEven ? 50 : -50, 0]
  );

  // Derive activation for the TextReveal
  const [isActive, setIsActive] = useState(false);
  const syncReveal = useTransform(scrollYProgress, (value: number) => {
    if (value >= step.threshold && !isActive) setIsActive(true);
    if (value < step.threshold - 0.15 && isActive) setIsActive(false);
    return value;
  });

  return (
    <div ref={stepRef} className={`relative flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}>
      <motion.div style={{ opacity: syncReveal }} className="hidden" /> {/* Connector for trigger */}
      
      {/* Spacer for alternating layout */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* Icon Bubble on the line */}
      <div className="absolute left-8 lg:left-1/2 lg:-translate-x-1/2 top-0 z-20">
        <div className="relative">
          <motion.div
            style={{ opacity }}
            className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white border-2 border-slate-100 shadow-xl flex items-center justify-center -translate-x-1/2 lg:translate-x-0"
          >
            <step.icon className="w-5 h-5 lg:w-8 lg:h-8 text-(--landing-primary-blue)" />
            {/* Step Number Badge */}
            <div className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 w-5 h-5 lg:w-7 lg:h-7 rounded-full bg-(--landing-primary-blue) text-white text-[8px] lg:text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-md">
              {step.id}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Text Content */}
      <motion.div 
        style={{ opacity, x: xTranslate }}
        className={`w-full lg:w-1/2 pl-20 lg:pl-0 ${isEven ? 'lg:pr-24 lg:text-right' : 'lg:pl-24 lg:text-left'}`}
      >
        <div className="space-y-2 md:space-y-4">
          <TextReveal
            text={step.title}
            as="h3"
            animate={isActive ? "visible" : "hidden"}
            className="text-xl md:text-3xl font-medium text-(--landing-text-heading) tracking-tight"
          />
          <p className="md:text-lg text-(--landing-text-gray) leading-relaxed max-w-lg lg:ml-auto lg:mr-0 inline-block">
            {step.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
