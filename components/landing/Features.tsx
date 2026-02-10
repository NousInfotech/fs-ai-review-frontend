"use client"
import React, { useState, useRef } from "react";
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
import { motion, AnimatePresence, useAnimationFrame, useMotionValue } from "framer-motion";
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

// Set this to true to use the scrolling marquee UI, false for the bento grid UI
const USE_SCROLL_UI = true;
const AutoscrollCarousel = ({ onSelectFeature }: { onSelectFeature: (f: any) => void }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [baseWidth, setBaseWidth] = useState(0);
  const isDragging = useRef(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Use 3 sets of items for a better buffer during dragging
  const scrollItems = [...features, ...features, ...features];
  const velocity = -0.5;

  // Calculate baseWidth on mount and resize
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.scrollWidth / 3;
        setBaseWidth(width);
        // Initialize x to the start of the second set
        x.set(-width);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [x]);

  useAnimationFrame(() => {
    if (isPaused || isDragging.current || baseWidth === 0) return;
    
    let currentX = x.get();
    currentX += velocity;

    // Wrap precisely
    if (currentX <= -baseWidth * 2) {
        currentX += baseWidth;
    }
    
    x.set(currentX);
  });

  const handleInteraction = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 8000);
  };

  const onDragStart = () => {
    isDragging.current = true;
    handleInteraction();
  };

  const onDragEnd = () => {
    isDragging.current = false;
    
    if (baseWidth > 0) {
        let currentX = x.get();
        // Ensure we're in the middle set's range after dragging
        while (currentX <= -baseWidth * 2) currentX += baseWidth;
        while (currentX >= -baseWidth) currentX -= baseWidth;
        x.set(currentX);
    }
  };

  return (
    <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
      <motion.div 
        ref={containerRef}
        className="flex gap-6 w-fit"
        style={{ x }}
        drag="x"
        dragConstraints={{
            left: -baseWidth * 2,
            right: 0
        }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onPointerDown={handleInteraction}
      >
        {scrollItems.map((feature, idx) => (
          <div 
            key={`${feature.id}-${idx}`}
            className="w-[280px] md:w-[450px] shrink-0 select-none"
          >
            <LandingCard
              icon={feature.icon}
              title={feature.name}
              description={feature.description}
              delay={0}
              className="h-full pointer-events-none" // Disable events on card so drag works smoothly
              footer={
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFeature(feature);
                  }}
                  className="flex items-center gap-2 text-(--landing-primary-blue) font-semibold hover:gap-3 transition-all group/btn relative z-30 py-2 cursor-pointer touch-manipulation active:scale-95 pointer-events-auto"
                >
                  Learn more 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              }
            />
          </div>
        ))}
      </motion.div>

      {/* Gradient Fades for the edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-(--landing-background)/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-(--landing-background)/50 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

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
            <h2 className="text-xs md:text-base font-semibold text-(--landing-primary-blue) uppercase tracking-widest mb-3">Powerful Capabilities</h2>
          </FadeIn>
          <TextReveal
            text="Everything you need for a flawless audit"
            as="h2"
            className="text-2xl md:text-6xl font-medium text-(--landing-text-heading) tracking-tight mb-3"
          />
          <FadeIn delay={0.2}>
            <p className="md:text-xl text-(--landing-text-gray) leading-relaxed mx-auto max-w-3xl">
              Stop manually ticking and bashing. Let our AI handle the tedious verification so you can focus on strategic judgment.
            </p>
          </FadeIn>
        </div>
      </div>

      {USE_SCROLL_UI ? (
        <AutoscrollCarousel onSelectFeature={setSelectedFeature} />
      ) : (
        <div className="mx-auto px-5 lg:px-20">
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
                      className="flex items-center gap-2 text-(--landing-primary-blue) font-semibold hover:gap-3 transition-all group/btn relative z-20 py-2 cursor-pointer touch-manipulation active:scale-95"
                    >
                      Learn more 
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal Implementation */}
      <AnimatePresence>
        {selectedFeature && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 md:p-10">
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
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-12 overflow-y-auto">
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors z-30"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 md:mb-8 mt-4 md:mt-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-(--landing-primary-blue)/10 flex items-center justify-center shrink-0">
                    <selectedFeature.icon className="w-6 h-6 md:w-8 md:h-8 text-(--landing-primary-blue)" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-medium text-slate-900 tracking-tight">
                      {selectedFeature.name}
                    </h2>
                    <p className="text-sm md:text-base text-(--landing-primary-blue) font-medium italic opacity-80">Detailed Feature Overview</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-semibold">
                    {selectedFeature.description}
                  </p>
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed font-normal opacity-90">
                    {selectedFeature.expandedDescription}
                  </p>
                </div>

                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-100 flex justify-end">
                  <LandingButton 
                    onClick={() => setSelectedFeature(null)}
                    className="w-full md:w-auto"
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
