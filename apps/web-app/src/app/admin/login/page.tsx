'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

interface LoginResponse {
  token: string;
  username: string;
  role: string;
  expiresAt: string;
}

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5266/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      
      // Store the admin token separately from regular user tokens
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify({
        username: data.username,
        role: data.role,
        expiresAt: data.expiresAt
      }));

      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Panel Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with your admin credentials
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter admin username"
              autoComplete="username"
            />
            
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Sign in to Admin Panel
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              This is a restricted area. Unauthorized access is prohibited.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
