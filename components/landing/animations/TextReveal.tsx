"use client";
import { motion, Variants } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  once?: boolean;
  animate?: "visible" | "hidden";
}

export default function TextReveal({ 
  text, 
  className = "", 
  delay = 0, 
  as = "h2",
  once = true,
  animate
}: TextRevealProps) {
  const words = text.split(" ");
  
  const MotionComponent = (motion as any)[as];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: delay 
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      whileInView={animate ? undefined : "visible"}
      animate={animate}
      viewport={animate ? undefined : { once, amount: 0.2 }}
      className={className}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block relative mr-[0.25em] py-1">
          <motion.span
            variants={wordVariants}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
}
