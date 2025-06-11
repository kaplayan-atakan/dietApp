'use client';

import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../components/Dashboard';
// import AppContainer from '../components/AppContainer';
import AuthForm from '../components/AuthForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <Dashboard /> : <AuthForm />}
    </div>
  );
}
