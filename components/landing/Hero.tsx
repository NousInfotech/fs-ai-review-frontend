"use client"
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Zap, CheckCircle, CheckCircle2 } from "lucide-react";
import LandingButton from "./LandingButton";
import TextReveal from './animations/TextReveal';
import HeroSkeleton from './HeroSkeleton';

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const video1 = useRef<HTMLVideoElement>(null);
  const video2 = useRef<HTMLVideoElement>(null);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const v1 = video1.current;
    const v2 = video2.current;
    if (!v1 || !v2 || isLoading) return;

    const tryPlay = async (video: HTMLVideoElement) => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Video autoplay blocked:", err);
      }
    };

    v1.currentTime = 0;
    v2.currentTime = 0;
    tryPlay(v1);
    tryPlay(v2);

    const restart = () => {
      v1.currentTime = 0;
      v2.currentTime = 0;
      tryPlay(v1);
      tryPlay(v2);
    };

    v1.addEventListener("ended", restart);
    v2.addEventListener("ended", restart);

    return () => {
      v1.removeEventListener("ended", restart);
      v2.removeEventListener("ended", restart);
    };
  }, [isLoading]);

  return (
    <>

      <section id="hero" className="relative pt-20 pb-8 md:pt-24 md:pb-12 flex flex-col lg:flex-row items-stretch px-5 md:px-10 overflow-hidden gap-12 transition-opacity duration-700">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 h-full">
          <video 
            ref={video1}
            autoPlay 
            muted 
            playsInline 
            loop
            onLoadedData={handleVideoLoad}
            className="w-full h-full object-cover opacity-40 dark:opacity-30"
          >
            <source src="/video/Vacei_Ai_Review.mp4" type="video/mp4" />
          </video>
          {/* Overlay for depth and readability */}
          <div className="absolute inset-0 bg-linear-to-b from-white/80 via-white/40 to-white/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,white)]" />
        </div>

        <div className="relative z-10 w-full lg:w-[75%] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.98 }}
            animate={!isLoading ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className='space-y-3'
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-(--landing-icon-bg) text-(--landing-primary-blue) border border-(--landing-gradient-blue-1)/30 uppercase tracking-wide">
              <Zap className="w-3 h-3 mr-1.5 fill-current" />
              FS = Financial Statements
            </span>
            
            <TextReveal
              text="Final review checks for Financial Statements — with evidence."
              as="h1"
              className="text-3xl md:text-5xl leading-tight font-medium text-(--landing-text-heading) tracking-tight"
            />
            
            <p className="text-base md:text-lg text-(--landing-text-gray) max-w-xl">
              Run an automated final check on your Financial Statements before sign-off.
            </p>

            <div className="space-y-4">
              {[
                "Totals and subtotals recalculated",
                "Notes and statements checked for consistency",
                "Formatting and presentation issues flagged",
                "Every issue shown with screenshot evidence"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-sm md:text-base text-(--landing-text-heading) font-medium opacity-90">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <LandingButton 
                  href="/dashboard"
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="w-full md:w-auto text-white px-8"
                >
                  Get 3 free checks
                </LandingButton>
                <LandingButton 
                  href="#demo"
                  variant="outline"
                  className="w-full md:w-auto px-8"
                >
                  Book a 10-minute demo
                </LandingButton>
              </div>
              <p className="mt-4 text-[10px] md:text-xs text-(--landing-text-gray) italic flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                Used by firms as a final review step before sign-off.
              </p>
            </div>
          </motion.div>
        </div>
        
        <div className="z-10 w-full lg:w-[55%] flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={!isLoading ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl h-full border border-white/50">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-20"
                  >
                    <HeroSkeleton />
                  </motion.div>
                )}
              </AnimatePresence>
              <video
                ref={video2}
                autoPlay
                muted
                playsInline
                loop
                className="w-full h-full object-cover"
              >
                <source src="/video/Vacei_Ai_Review.mp4" type="video/mp4" />
              </video>
            </div>
            
            {/* Floating Caption Overlay */}
            {/* <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1.2, duration: 0.6 }}
               className="absolute -bottom-6 right-6 lg:-right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 z-20 max-w-[260px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <p className="text-[13px] font-semibold text-(--landing-text-heading) leading-tight">
                   “Every issue includes screenshot evidence.”
                </p>
              </div>
            </motion.div> */}
          </motion.div>
        </div>
      </section>
    </>
  )
}

