"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import LandingButton from "./LandingButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
        // Update URL hash without jumping the page instantly
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-9999">
      <div className="bg-white/60 backdrop-blur-xl border-b border-white/20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            {/* Left: Logo and Name */}
            <div className="flex-1 flex justify-start">
              <Link 
                href="#hero" 
                className="flex items-center gap-2 group"
                onClick={(e) => scrollToSection(e, "#hero")}
              >
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <Image 
                    src="/images/Logo.png" 
                    alt="Financial Review AI Logo" 
                    width={32} 
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-medium text-(--landing-text-heading) tracking-tight group-hover:text-(--landing-primary-blue) transition-colors">
                  Financial Review AI
                </span>
              </Link>
            </div>

            {/* Center: Navigation Links (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="text-sm font-medium text-(--landing-text-gray) hover:text-(--landing-primary-blue) transition-colors relative group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-(--landing-primary-blue) transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right: Actions (Desktop) */}
            <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
              <div className="hidden md:flex items-center gap-3">
                <LandingButton 
                  href="/login"
                  variant="outline"
                  className="px-6! py-2.5! text-sm! font-medium rounded-xl!"
                >
                  Sign In
                </LandingButton>
                <LandingButton 
                  href="/dashboard"
                  variant="primary"
                  className="px-6! py-2.5! text-sm! font-medium rounded-xl! shadow-blue-500/10"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </LandingButton>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-(--landing-text-gray) hover:text-(--landing-primary-blue) transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-white/20 overflow-hidden shadow-2xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="block px-3 py-4 text-base font-medium text-(--landing-text-gray) hover:text-(--landing-primary-blue) active:bg-blue-50/50 rounded-xl transition-all"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3 px-3">
                <LandingButton 
                  href="/login"
                  variant="outline"
                  className="w-full justify-center py-3.5!"
                >
                  Sign In
                </LandingButton>
                <LandingButton 
                  href="/dashboard"
                  variant="primary"
                  className="w-full justify-center py-3.5!"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started
                </LandingButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
