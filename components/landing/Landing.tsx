"use client";

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './Navbar'
import Hero from './Hero'
import TrustedBy from './TrustedBy'
import HowItWorks from './HowItWorks'
import Features from './Features'
import Pricing from './Pricing'
import FAQ from './FAQ'
import CTA from './CTA'
import Footer from './Footer'
import './landing.css'
import SmoothScroll from './animations/SmoothScroll'
import Preloader from './animations/Preloader'

const Landing = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SmoothScroll>
      <div className="bg-white min-h-screen relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
          ) : (
            <motion.div
              key="content"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}>
                <Navbar />
              </motion.div>
              
              <main>
                <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } } }}>
                  <Hero />
                </motion.div>
                
                <HowItWorks />
                <Features />
                <Pricing />
                <FAQ />
                <CTA />
              </main>

              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SmoothScroll>
  )
}

export default Landing