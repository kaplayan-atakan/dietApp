import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import NutritionSection from './NutritionSection';
import WorkoutsSection from './WorkoutsSection';
import ProgressSection from './ProgressSection';
import ProfileSection from './ProfileSection';
import Button from './ui/Button';

type ActiveSection = 'dashboard' | 'nutrition' | 'workouts' | 'progress' | 'profile';

const AppContainer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const { user, logout } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'nutrition':
        return <NutritionSection />;
      case 'workouts':
        return <WorkoutsSection />;
      case 'progress':
        return <ProgressSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 capitalize">
                  {activeSection === 'dashboard' ? 'Dashboard' : activeSection}
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-gray-400 ml-2">•</span>
                  <span className="ml-2">{user?.email}</span>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AppContainer;
