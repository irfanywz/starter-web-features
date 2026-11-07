import { clsx, type ClassValue } from "clsx";

/** Gabungkan class Tailwind dengan aman (conditional class). */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
