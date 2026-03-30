import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(imagePath?: string | null, fallback: string = '/images/placeholder-avatar.jpg') {
  if (!imagePath) return fallback;
  if (imagePath.startsWith('http')) return imagePath;

  let baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.replace('/api', '');
  }

  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  if (!path.startsWith('/storage/')) {
    return `${base}/storage${path}`;
  }
  return `${base}${path}`;
}
