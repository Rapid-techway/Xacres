import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    const cr = price / 10000000;
    return cr.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " Cr";
  } else if (price >= 100000) {
    const lakh = price / 100000;
    return lakh.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " Lakh";
  } else {
    return price.toLocaleString('en-IN');
  }
}
