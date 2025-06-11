import React, { useEffect } from 'react';
import Button from './ui/Button';
import useLogger from '../hooks/useLogger';

export interface NavigationProps {
  activeSection: 'dashboard' | 'nutrition' | 'workouts' | 'progress' | 'profile';
  onSectionChange: (section: 'dashboard' | 'nutrition' | 'workouts' | 'progress' | 'profile') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const { logUserAction, logEvent, info } = useLogger({ 
    componentName: 'Navigation',
    minLevel: 'INFO' as any 
  });

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: '📊' },
    { id: 'nutrition' as const, label: 'Nutrition', icon: '🍎' },
    { id: 'workouts' as const, label: 'Workouts', icon: '💪' },
    { id: 'progress' as const, label: 'Progress', icon: '📈' },
    { id: 'profile' as const, label: 'Profile', icon: '👤' },
  ];

  // Log when active section changes
  useEffect(() => {
    info('Navigation section changed', {
      activeSection,
      timestamp: new Date().toISOString(),
    }, 'section-change');

    logEvent('navigation-section-active', {
      section: activeSection,
      timestamp: new Date().toISOString(),
    });
  }, [activeSection, info, logEvent]);

  const handleSectionChange = (section: typeof activeSection) => {
    logUserAction('navigation-click', {
      targetSection: section,
      currentSection: activeSection,
      timestamp: new Date().toISOString(),
    });

    logEvent('navigation-transition', {
      from: activeSection,
      to: section,
      transitionTime: Date.now(),
    });

    info('User navigated to section', {
      section,
      previousSection: activeSection,
    }, 'navigation');

    onSectionChange(section);
  };

  return (
    <nav className="bg-white border-r border-gray-200 w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Fitness Coach</span>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'primary' : 'outline'}
              className={`w-full justify-start space-x-3 ${
                activeSection === item.id ? 'bg-blue-50 border-blue-200' : 'border-transparent hover:bg-gray-50'
              }`}
              onClick={() => handleSectionChange(item.id)}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
