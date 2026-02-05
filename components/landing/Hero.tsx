"use client"
import { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";
import LandingButton from "./LandingButton";
import TextReveal from './animations/TextReveal';

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const video1 = useRef<HTMLVideoElement>(null);
  const video2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v1 = video1.current;
    const v2 = video2.current;
    if (!v1 || !v2) return;

    const tryPlay = async (video: HTMLVideoElement) => {
      try {
        await video.play();
      } catch (err) {
        console.warn("Video autoplay blocked:", err);
      }
    };

    const syncVideos = () => {
      v1.currentTime = 0;
      v2.currentTime = 0;
      tryPlay(v1);
      tryPlay(v2);
    };

    const start = () => {
      syncVideos();
    };

    v1.addEventListener("loadeddata", start);
    v2.addEventListener("loadeddata", start);

    v1.addEventListener("ended", syncVideos);
    v2.addEventListener("ended", syncVideos);

    return () => {
      v1.removeEventListener("loadeddata", start);
      v2.removeEventListener("loadeddata", start);
      v1.removeEventListener("ended", syncVideos);
      v2.removeEventListener("ended", syncVideos);
    };
  }, []);

  return (
    <section id="hero" className="relative py-10 md:pt-30 flex flex-col lg:flex-row items-center px-5 md:px-10 overflow-hidden gap-5 min-h-[85vh]">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 h-full">
        <video 
          ref={video1}
          autoPlay 
          muted 
          playsInline 
          loop
          className="w-full h-full object-cover opacity-40 dark:opacity-30"
        >
          <source src="/video/Main%20Render%201.mp4" type="video/mp4" />
        </video>
        {/* Overlay for depth and readability */}
        <div className="absolute inset-0 bg-linear-to-b from-white/80 via-white/40 to-white/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,white)]" />
      </div>

      <div className="mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className='space-y-7'
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-(--landing-icon-bg) text-(--landing-primary-blue) border border-(--landing-gradient-blue-1)/30 uppercase tracking-wide">
            <Zap className="w-3 h-3 mr-1.5 fill-current" />
            New: AI-Powered Financial Reconciliation
          </span>
          
          <TextReveal
            text="Automate Your Financial Audit & Compliance Reviews"
            as="h1"
            className="text-3xl md:text-6xl leading-none tracking-tighter font-medium text-(--landing-text-heading)"
          />
          
          <p className="text-xs md:text-xl text-(--landing-text-gray) max-w-xl uppercase tracking-wide">
            Instantly analyze financial statements for compliance errors, arithmetic inconsistencies, and disclosure breaches with enterprise-grade AI.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <LandingButton 
              href="/dashboard"
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full md:w-auto text-white"
            >
              Start Free Analysis
            </LandingButton>
            <LandingButton 
              href="#demo"
              variant="outline"
              className="w-full md:w-auto"
            >
              View Sample Report
            </LandingButton>
          </div>

          <div className="flex items-center gap-6 text-[10px] md:text-xs uppercase tracking-widest text-(--landing-text-gray)">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>SOC2 Compliant</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>99.9% Accuracy</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="z-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <video
            ref={video2}
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-auto rounded-2xl shadow-2xl"
          >
            <source src="/video/Main%20Render%201.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>

    </section>
  )
}

