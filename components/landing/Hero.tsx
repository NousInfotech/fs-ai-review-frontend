"use client"
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Zap, CheckCircle, CheckCircle2, Play, X, Volume2 } from "lucide-react";
import LandingButton from "./LandingButton";
import TextReveal from './animations/TextReveal';
import HeroSkeleton from './HeroSkeleton';

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const video1 = useRef<HTMLVideoElement>(null);
  const video2 = useRef<HTMLVideoElement>(null);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (showVideoModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showVideoModal]);

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

      <section id="hero" className="relative pt-20 pb-8 md:pt-28 md:pb-12 overflow-hidden transition-opacity duration-700 px-0">
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

        <div className="relative z-10 flex flex-col lg:flex-row items-center px-5 md:px-20 gap-12">
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
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
                className="text-2xl md:text-5xl leading-tight font-medium text-(--landing-text-heading) tracking-tight"
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
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={!isLoading ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/50">
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
                
                {/* LAPTOP VIEW: Open View Overlay Button (Hover) */}
                {!isLoading && (
                  <div className="hidden lg:flex absolute inset-0 z-20 items-start justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowVideoModal(true)}
                      className="flex items-center gap-3 px-5 py-2.5 bg-white/90 backdrop-blur-md text-slate-900 rounded-full font-bold shadow-2xl border border-white/50 transform translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-(--landing-primary-blue) flex items-center justify-center text-white">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                      <span className="text-sm">Open View</span>
                    </motion.button>
                  </div>
                )}
              </div>

              {/* MOBILE & TABLET VIEW: Bottom Title Bar (Non-overlay) */}
              {!isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setShowVideoModal(true)}
                  className="lg:hidden mt-4 px-5 py-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-(--landing-primary-blue) flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                    <span className="text-sm md:text-base font-medium tracking-tight">See how FS AI Review works</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10000 flex items-center justify-center p-4 md:p-10 bg-slate-900/95 backdrop-blur-xl"
            onClick={() => setShowVideoModal(false)}
          >
           <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-6xl flex flex-col rounded-4xl overflow-hidden bg-black shadow-[0_0_100px_rgba(59,130,246,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header/Title (Bottom for mobile, Top for desktop) */}
              <div className="absolute top-0 left-0 w-full p-6 md:p-8 flex items-center justify-between z-50 bg-linear-to-b from-black/80 to-transparent">
                <h3 className="hidden md:block text-xl font-medium text-white tracking-tight">
                  See how FS AI Review works
                </h3>
                <div className="md:hidden" /> {/* Spacer for mobile close button alignment */}
                <button 
                  onClick={() => setShowVideoModal(false)}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative aspect-video w-full h-full">
                <video
                  autoPlay
                  playsInline
                  controls
                  muted={false}
                  className="w-full h-full object-contain"
                >
                  <source src="/video/Vacei_Ai_Review.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Mobile Bottom Title - Modal */}
              <div className="md:hidden p-6 bg-slate-900/80 backdrop-blur-md border-t border-white/10">
                <h3 className="text-lg font-medium text-white text-center">
                  See how FS AI Review works
                </h3>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

