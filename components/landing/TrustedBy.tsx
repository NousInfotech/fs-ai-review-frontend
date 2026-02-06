"use client"
import { motion } from "framer-motion";
import FadeIn from "./animations/FadeIn";

const brands = [
  "Goldman & Co",
  "PwC Global",
  "Deloitte Finance",
  "KPMG Tech",
  "EY Advisory",
  "Morgan Stanley"
];

export default function TrustedBy() {
  return (
    <section className="py-12 border-y border-gray-100 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-(--landing-text-gray) mb-8">
          Trusted by leading financial institutions & auditing firms
        </p>
        <FadeIn
          delay={0.1}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
        >
          {brands.map((brand) => (
            <div
              key={brand}
              className="text-xl md:text-2xl font-bold tracking-tighter text-gray-900"
            >
              {brand}
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
