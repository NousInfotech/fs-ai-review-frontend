"use client";

import React, { useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewSectionProps<T> {
  title: string;
  titleColorClass: string;
  badgeColorClass: string;
  count: number;
  content?: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage: string;
  emptyBgClass: string;
  emptyBorderClass: string;
  defaultSectionCollapsed?: boolean;
}

export default function ReviewSection<T>({
  title,
  titleColorClass,
  badgeColorClass,
  count,
  content,
  items,
  renderItem,
  emptyMessage,
  emptyBgClass,
  emptyBorderClass,
  defaultSectionCollapsed = false,
}: ReviewSectionProps<T>) {
  const [openValues, setOpenValues] = useState<string[]>([]);
  const [isSectionExpanded, setIsSectionExpanded] = useState(!defaultSectionCollapsed);

  const handleExpandAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenValues(items.map((_, idx) => `${title}-${idx}`));
  };

  const handleCollapseAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenValues([]);
  };

  const toggleSection = () => {
    setIsSectionExpanded(!isSectionExpanded);
  };

  return (
    <div className="mb-10 space-y-4">
      {/* Section Header */}
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group select-none"
        onClick={toggleSection}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            {/* Major Arrow Button */}
            <motion.div
              animate={{ rotate: isSectionExpanded ? 0 : -90 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            >
              <ChevronDown size={24} strokeWidth={2.5} />
            </motion.div>
            
            <h2 className={`text-lg font-semibold ${titleColorClass}`}>{title}</h2>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-medium ${badgeColorClass}`}>
              {count}
            </div>
          </div>
          {content && <p className="text-xs text-gray-500 ml-9">{content}</p>}
        </div>

        {/* Bulk Actions - only visible when section is expanded */}
        {/* {isSectionExpanded && items && items.length > 0 && (
          <div className="flex items-center gap-2 ml-9 sm:ml-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpandAll}
              className="text-xs flex items-center gap-1 hover:bg-gray-100 h-8"
            >
              <Plus size={14} />
              Expand All
            </Button>
            <div className="w-px h-4 bg-gray-200"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCollapseAll}
              className="text-xs flex items-center gap-1 hover:bg-gray-100 h-8"
            >
              <Minus size={14} />
              Collapse All
            </Button>
          </div>
        )} */}
      </div>

      {/* Section Content with Animation */}
      <AnimatePresence initial={false}>
        {isSectionExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {(!items || items.length === 0) ? (
              <div className={`rounded-lg p-6 text-center text-gray-500 border ${emptyBgClass} ${emptyBorderClass}`}>
                {emptyMessage}
              </div>
            ) : (
              <Accordion
                type="multiple"
                value={openValues}
                onValueChange={setOpenValues}
                className="border-none"
              >
                {items.map((item, idx) => renderItem(item, idx))}
              </Accordion>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
