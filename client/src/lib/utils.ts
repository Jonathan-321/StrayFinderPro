import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    // Try to parse the date if it's in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    return "Invalid date";
  }
  
  // Check if the date is today
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  
  // Check if the date is less than 7 days ago
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  
  // Format the date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function calculateTimeDifference(dateString: string): string {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return "";
  }
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) {
    return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  } else {
    return formatDate(dateString);
  }
}

export function getStatusBadgeColor(status: string): {
  bg: string;
  text: string;
} {
  switch (status.toLowerCase()) {
    case "active":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "claimed":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "archived":
      return { bg: "bg-gray-100", text: "text-gray-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
