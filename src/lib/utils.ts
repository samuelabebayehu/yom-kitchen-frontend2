'use client'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useRouter } from 'next/navigation'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}




const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const verifyJwt = async (): Promise<boolean> => {
    const token = localStorage.getItem('admin_jwt_token');
    const router = useRouter(); // Get router instance inside the function

    if (!token) {
        router.push('/login'); // Redirect immediately if no token
        return false;
    }

    try {
        const response = await fetch(`${apiBaseURL}/admin/auth/verify-token`, { // Backend endpoint to verify token
            method: 'POST', // Or GET, depending on your backend API design
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json', // Adjust if needed
            },
        });

        if (response.ok) {
            return true; // Token is valid
        } else if (response.status === 401 || response.status === 403) {
            // 401 Unauthorized or 403 Forbidden - token is invalid or expired
            localStorage.removeItem('admin_jwt_token'); // Remove invalid token
            router.push('/login'); // Redirect to login
            return false;
        } else {
            // Other error status codes - might be server error or other issues
            console.error('JWT verification failed with status:', response.status, response.statusText);
            return false; // Treat as invalid for security, consider more specific error handling in production
        }
    } catch (error) {
        // Network error or other client-side error during fetch
        console.error('Error during JWT verification:', error);
        return false; // Treat as invalid for security, consider more specific error handling in production
    }
};