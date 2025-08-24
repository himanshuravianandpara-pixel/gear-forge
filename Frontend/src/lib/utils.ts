import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency conversion utility
export const convertUSDToINR = (usdAmount: number): number => {
  // Current exchange rate: 1 USD = 85 INR (approximate)
  const exchangeRate = 85;
  return Math.round(usdAmount * exchangeRate);
};

export const formatINR = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
