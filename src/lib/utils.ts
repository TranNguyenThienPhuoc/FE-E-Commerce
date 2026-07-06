import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return 'https://placehold.co/400x400/png?text=No+Image';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // URL S3 bucket từ biến môi trường hoặc mặc định
  const baseUrl = import.meta.env.VITE_S3_MEDIA_URL || 'https://my-app-uploads.s3.ap-southeast-1.amazonaws.com';
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${baseUrl}/${cleanPath}`;
}
