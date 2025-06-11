'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      // Verify token is still valid
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          // Token is valid, redirect to dashboard
          router.push('/admin/dashboard');
          return;
        }
      } catch (error) {
        // Invalid token, remove it
        localStorage.removeItem('adminToken');
      }
    }
    
    // No valid token, redirect to login
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
