"use client"
import { motion } from "framer-motion";

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
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-xl md:text-2xl font-bold tracking-tighter text-gray-900"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
