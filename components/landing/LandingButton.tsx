"use client"
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Assuming utils exists, otherwise I'll define a simple cn

interface LandingButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function LandingButton({
  href,
  children,
  variant = 'primary',
  className,
  icon,
  iconPosition = 'right'
}: LandingButtonProps) {
  
  const variants = {
    primary: "bg-[var(--landing-primary-blue)] text-white hover:bg-[var(--landing-primary-blue-hover)] shadow-lg",
    secondary: "bg-[var(--landing-navbar-btn-bg)] text-white hover:bg-[var(--landing-primary-blue-hover)] border border-[var(--landing-navbar-btn-border)]",
    outline: "bg-transparent text-[var(--landing-text-dark)] border border-gray-200 hover:bg-gray-50",
    ghost: "bg-transparent text-[var(--landing-text-gray)] hover:text-[var(--landing-text-dark)] hover:bg-gray-100"
  };

  return (
    <Link 
      href={href}
      className={cn(
        "inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
        variants[variant],
        className
      )}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </Link>
  );
}
