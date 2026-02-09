"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import FadeIn from "./animations/FadeIn";

interface LandingCardProps {
  icon?: LucideIcon | React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
}

export default function LandingCard({
  icon: Icon,
  title,
  description,
  children,
  footer,
  className = "",
  delay = 0,
  direction = "up",
  distance = 30,
}: LandingCardProps) {
  const renderIcon = () => {
    if (!Icon) return null;

    // If it's already an element (like <Calculator />), render it directly
    if (React.isValidElement(Icon)) {
      return (
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-(--landing-primary-blue)/10 transition-all duration-500">
          <div className="text-(--landing-primary-blue)">{Icon}</div>
        </div>
      );
    }

    // Otherwise, assume it's a component type (function or object with render/$$typeof)
    const isComponent = typeof Icon === "function" || 
      (typeof Icon === "object" && Icon !== null && (Icon as any).$$typeof);

    return (
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-(--landing-primary-blue)/10 transition-all duration-500">
        {isComponent ? (
          React.createElement(Icon as React.ComponentType<any>, { 
            className: "w-7 h-7 text-(--landing-primary-blue)" 
          })
        ) : (
          <div className="text-(--landing-primary-blue)">{Icon as React.ReactNode}</div>
        )}
      </div>
    );
  };

  return (
    <FadeIn
      delay={delay}
      direction={direction}
      distance={distance}
      className={`${className} group h-full`}
    >
      <div className="relative h-full bg-white border border-slate-100 rounded-3xl p-6 md:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <div className="relative z-10">
          {renderIcon()}
          
          {title && (
            <h3 className="text-xl md:text-2xl font-medium text-(--landing-text-heading) mb-3 tracking-tight group-hover:text-(--landing-primary-blue) transition-colors">
              {title}
            </h3>
          )}
          
          {description && (
            <p className="text-(--landing-text-gray) leading-relaxed  md:text-lg mb-4">
              {description}
            </p>
          )}
          
          {children}
        </div>

        {footer && (
          <div className="border-t border-slate-50 pt-6 mt-auto relative z-20">
            {footer}
          </div>
        )}

        {/* Decorative Bottom Shape */}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-4 border-r-4 border-slate-900 opacity-5 group-hover:opacity-10 transition-opacity rounded-br-2xl" />
      </div>
    </FadeIn>
  );
}
