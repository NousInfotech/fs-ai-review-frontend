"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function ScrollArea({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-auto", className)}
      {...props}
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="h-full w-full rounded-[inherit]">
        {children}
      </div>
    </div>
  );
}

export function ScrollBar() {
    return null; // Simplified version doesn't need a separate scrollbar component
}
