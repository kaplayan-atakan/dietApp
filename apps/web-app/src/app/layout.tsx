import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { ErrorLoggerProvider } from '../contexts/ErrorLoggerContext';
import { Providers } from '../components/Providers';
import { ErrorBoundary } from '../utils/errorLogger';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Fitness Coach',
  description: 'Your personal AI-powered fitness and nutrition companion',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#6366f1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">      <body className={inter.className}>        <ErrorBoundary>
          <ErrorLoggerProvider>
            <Providers>
              <AuthProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </AuthProvider>
            </Providers>
          </ErrorLoggerProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
