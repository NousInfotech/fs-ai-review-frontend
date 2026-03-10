import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateDisplayId(id: string | null | undefined): string {
  if (!id) return "DOC-UNKNOWN";
  
  // if it's already a short string or doesn't look like a standard Mongo/UUID
  if (id.length <= 8) return id.toUpperCase();
  
  // Return a formatted display ID (e.g. DOC-A1B2C3)
  return `DOC-${id.substring(id.length - 6).toUpperCase()}`;
}
