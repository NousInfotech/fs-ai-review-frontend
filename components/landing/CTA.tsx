"use client"
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import LandingButton from "./LandingButton";
import TextReveal from "./animations/TextReveal";

export default function CTA() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-(--landing-footer-hero-bg) p-10 shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-(--landing-primary-blue)/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-(--landing-purple-logo)/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-[10px] md:text-xs font-semibold uppercase tracking-widest mb-5 md:mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Join 500+ forward-thinking firms
            </motion.div>

            <TextReveal
              text="Run a final check before you sign or send your Financial Statements."
              as="h2"
              className="md:text-4xl text-lg font-medium text-white tracking-tight mb-3 max-w-4xl"
            />
            
            <p className="text-gray-400 text-xs md:text-lg mb-10">
              Start your 14-day free trial today. No credit card required. Experience the power of AI-driven compliance reviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <LandingButton
                href="/dashboard"
                variant="primary"
                className=" shadow-blue-500/20"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started for Free
              </LandingButton>
              <LandingButton
                href="#pricing"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                View Plans
              </LandingButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
