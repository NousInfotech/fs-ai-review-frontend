"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import LandingButton from "./LandingButton";
import StaggeredMenu from "./StaggeredMenu";

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
      {/* Desktop Navbar */}
      <div className="hidden md:block bg-white/60 backdrop-blur-xl border-b border-white/20">
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
                <span className="md:text-xl font-normal text-(--landing-text-heading) tracking-tight group-hover:text-(--landing-primary-blue) transition-colors">
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
                  className="text-sm font-normal text-(--landing-text-gray) hover:text-(--landing-primary-blue) transition-colors relative group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-(--landing-primary-blue) transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right: Actions (Desktop) */}
            <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
              <div className="flex items-center gap-3">
                <LandingButton 
                  href="/login"
                  variant="outline"
                  className="px-6! py-2.5! text-sm! font-normal rounded-xl!"
                >
                  Sign In
                </LandingButton>
                <LandingButton 
                  href="/dashboard"
                  variant="primary"
                  className="px-6! py-2.5! text-sm! font-normal rounded-xl! shadow-blue-500/10"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </LandingButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navbar with Staggered Menu */}
      <div className="md:hidden bg-white/60 backdrop-blur-xl border-b border-white/20 h-16">
        <StaggeredMenu 
          title="Financial Review AI"
          items={[
            ...navLinks.map(link => ({ label: link.name, ariaLabel: link.name, link: link.href })),
            { label: "Sign In", ariaLabel: "Sign In", link: "/login", variant: 'button-outline' },
            { label: "Get Started", ariaLabel: "Get Started", link: "/dashboard", variant: 'button-primary' }
          ]}
          logoUrl="/images/Logo.png"
          isFixed={true}
          colors={['var(--landing-primary-blue)', 'var(--landing-navbar-btn-bg)']}
          accentColor="var(--landing-primary-blue)"
          displaySocials={false}
          displayItemNumbering={false}
        />
      </div>
    </nav>
  );
}
