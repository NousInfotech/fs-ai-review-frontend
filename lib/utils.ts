import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to generate a display ID from _id if missing
export const generateDisplayId = (id: string) => {
  if (!id) return "DOC-????";
  // Take last 4 chars of ID or hash it
  const suffix = id.slice(-4).toUpperCase();
  // We can't easily get the year without date, so just use generic
  return `DOC-${suffix}`;
};

export const smoothScrollToTop = () => {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
