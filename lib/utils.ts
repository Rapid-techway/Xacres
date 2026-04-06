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

/**
 * Native Share / Clipboard Fallback for properties
 */
export async function shareProperty({
  title,
  slug,
  area,
  district,
  village,
  type,
  price
}: {
  title: string
  slug: string
  area: number
  district: string
  village: string
  type: string
  price?: number
}) {
  const shareUrl = `${window.location.origin}/lands/${slug}`;
  const shareTitle = `${title} - ${area} Acres in ${district}`;
  
  let shareText = `Check out this ${type} land in ${village}, ${district}.\n\nArea: ${area} Acres`;
  if (price) {
    shareText += `\nPrice: ₹${formatPrice(price)}`;
  }
  shareText += `\n\nView details here:`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl,
      });
      return false; // Shared via native, no need for "Copied" toast
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
      return false;
    }
  } else {
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${shareUrl}`);
      return true; // Successfully copied fallback
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      return false;
    }
  }
}
