"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  openValues: string[];
  toggleValue: (value: string) => void;
  type: "single" | "multiple";
}>({
  openValues: [],
  toggleValue: () => {},
  type: "multiple",
});

export function Accordion({
  type = "multiple",
  value,
  onValueChange,
  defaultValue,
  children,
  className,
}: {
  type?: "single" | "multiple";
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string | string[];
  children: React.ReactNode;
  className?: string;
}) {
  const [internalOpenValues, setInternalOpenValues] = React.useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  );

  const isControlled = value !== undefined;
  const openValues = isControlled ? value : internalOpenValues;

  const toggleValue = (val: string) => {
    let nextValue: string[];
    if (type === "single") {
      nextValue = openValues.includes(val) ? [] : [val];
    } else {
      nextValue = openValues.includes(val)
        ? openValues.filter((v) => v !== val)
        : [...openValues, val];
    }

    if (!isControlled) {
      setInternalOpenValues(nextValue);
    }
    onValueChange?.(nextValue);
  };

  return (
    <AccordionContext.Provider value={{ openValues, toggleValue, type }}>
      <div className={cn("divide-y border-t border-b", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = React.createContext<{ value: string }>({ value: "" });

export function AccordionItem({
  value,
  children,
  className,
  onClick,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div 
        className={cn("border-b last:border-b-0", className)}
        onClick={onClick}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { value } = React.useContext(AccordionItemContext);
  const { openValues, toggleValue } = React.useContext(AccordionContext);
  const isOpen = openValues.includes(value);

  return (
    <button
      type="button"
      onClick={() => toggleValue(value)}
      className={cn(
        "group text-sm flex w-full items-center justify-between py-4 font-medium transition-all duration-200 ease-in-out cursor-pointer",
        className
      )}
    >
      {children}
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="h-4 w-4 shrink-0" />
      </motion.div>
    </button>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { value } = React.useContext(AccordionItemContext);
  const { openValues } = React.useContext(AccordionContext);
  const isOpen = openValues.includes(value);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden text-sm"
        >
          <div className={cn("pb-4 pt-0", className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
