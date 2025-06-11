import React, { useEffect, useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import useLogger from '../hooks/useLogger';
import withLogging from './withLogging';

interface PersonalInfo {
  fullName: string;
  email: string;
  age: number;
  phone: string;
}

interface FitnessGoals {
  currentWeight: number;
  targetWeight: number;
  height: number;
  weeklyExerciseGoal: number;
  primaryGoal: string;
}

interface UserPreferences {
  pushNotifications: boolean;
  emailReports: boolean;
  dataSharing: boolean;
}

const ProfileSection: React.FC = () => {
  const logger = useLogger({ componentName: 'ProfileSection' });
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    age: 28,
    phone: '+1 (555) 123-4567',
  });
  
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoals>({
    currentWeight: 75,
    targetWeight: 70,
    height: 175,
    weeklyExerciseGoal: 5,
    primaryGoal: 'Weight Loss',
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    pushNotifications: true,
    emailReports: false,
    dataSharing: true,
  });
  
  const [isEditing, setIsEditing] = useState({
    personalInfo: false,
    fitnessGoals: false,
  });

  useEffect(() => {
    const startTime = Date.now();
    logger.info('ProfileSection component mounted');
    
    // Log initial profile data
    const profileAnalytics = {
      personalInfo: {
        hasCompleteInfo: !!(personalInfo.fullName && personalInfo.email && personalInfo.age && personalInfo.phone),
        profileCompleteness: calculateProfileCompleteness(),
      },
      fitnessGoals: {
        hasRealisticGoals: fitnessGoals.targetWeight > 0 && fitnessGoals.currentWeight > 0,
        weightLossGoal: fitnessGoals.currentWeight - fitnessGoals.targetWeight,
        bmi: calculateBMI(),
        weeklyGoalRealistic: fitnessGoals.weeklyExerciseGoal <= 7,
      },
      preferences: {
        notificationsEnabled: preferences.pushNotifications,
        privacyOptIn: preferences.dataSharing,
        communicationPrefs: preferences.emailReports,
      },
    };
    
    logger.info('Profile data loaded and analyzed', profileAnalytics);
    logger.logPerformance('profile-data-analysis', Date.now() - startTime, 'ms');
  }, []);

  const calculateProfileCompleteness = () => {
    const fields = Object.values(personalInfo).filter(value => value && value.toString().trim() !== '');
    return Math.round((fields.length / 4) * 100);
  };

  const calculateBMI = () => {
    const heightInMeters = fitnessGoals.height / 100;
    return Math.round((fitnessGoals.currentWeight / (heightInMeters * heightInMeters)) * 10) / 10;
  };

  const handlePersonalInfoSave = () => {
    const startTime = Date.now();
    
    logger.logUserAction('personal-info-saved', {
      profileCompleteness: calculateProfileCompleteness(),
      fieldsUpdated: Object.keys(personalInfo),
      timestamp: new Date().toISOString(),
    });
    
    setIsEditing(prev => ({ ...prev, personalInfo: false }));
    logger.info('Personal information saved', { personalInfo });
    logger.logPerformance('personal-info-save', Date.now() - startTime, 'ms');
  };

  const handleFitnessGoalsUpdate = () => {
    const startTime = Date.now();
    const weightLossGoal = fitnessGoals.currentWeight - fitnessGoals.targetWeight;
    
    logger.logUserAction('fitness-goals-updated', {
      weightLossGoal,
      bmi: calculateBMI(),
      weeklyExerciseGoal: fitnessGoals.weeklyExerciseGoal,
      primaryGoal: fitnessGoals.primaryGoal,
      timestamp: new Date().toISOString(),
    });
    
    setIsEditing(prev => ({ ...prev, fitnessGoals: false }));
    logger.info('Fitness goals updated', { fitnessGoals, weightLossGoal, bmi: calculateBMI() });
    logger.logPerformance('fitness-goals-update', Date.now() - startTime, 'ms');
  };

  const handleGoalSelection = (goal: string) => {
    const startTime = Date.now();
    
    logger.logUserAction('primary-goal-changed', {
      previousGoal: fitnessGoals.primaryGoal,
      newGoal: goal,
      timestamp: new Date().toISOString(),
    });
    
    setFitnessGoals(prev => ({ ...prev, primaryGoal: goal }));
    logger.info('Primary fitness goal changed', { from: fitnessGoals.primaryGoal, to: goal });
    logger.logPerformance('goal-selection', Date.now() - startTime, 'ms');
  };

  const handlePreferenceToggle = (preference: keyof UserPreferences) => {
    const startTime = Date.now();
    const newValue = !preferences[preference];
    
    logger.logUserAction('preference-toggled', {
      preference,
      oldValue: preferences[preference],
      newValue,
      timestamp: new Date().toISOString(),
    });
    
    setPreferences(prev => ({ ...prev, [preference]: newValue }));
    logger.info('User preference toggled', { preference, newValue });
    logger.logPerformance('preference-toggle', Date.now() - startTime, 'ms');
  };

  const handleAccountAction = (action: string) => {
    const startTime = Date.now();
    
    logger.logUserAction('account-action-clicked', {
      action,
      userProfile: { email: personalInfo.email, primaryGoal: fitnessGoals.primaryGoal },
      timestamp: new Date().toISOString(),
    });
    
    logger.warn(`Account action requested: ${action}`, { action });
    logger.logPerformance('account-action', Date.now() - startTime, 'ms');
  };

  const handlePreferencesSave = () => {
    const startTime = Date.now();
    
    logger.logUserAction('preferences-saved', {
      preferences,
      notificationSettings: {
        pushEnabled: preferences.pushNotifications,
        emailEnabled: preferences.emailReports,
        dataShareEnabled: preferences.dataSharing,
      },
      timestamp: new Date().toISOString(),
    });
    
    logger.info('User preferences saved', { preferences });
    logger.logPerformance('preferences-save', Date.now() - startTime, 'ms');
  };  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and fitness preferences</p>
      </div>

      {/* Personal Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={personalInfo.fullName}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Enter your full name"
          />
          <Input
            label="Email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
          />
          <Input
            label="Age"
            type="number"
            value={personalInfo.age.toString()}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
            placeholder="Enter your age"
          />
          <Input
            label="Phone"
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Enter your phone number"
          />
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Profile Completeness: {calculateProfileCompleteness()}%
          </div>
          <Button variant="primary" onClick={handlePersonalInfoSave}>
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Fitness Goals */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fitness Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Current Weight (kg)"
            type="number"
            value={fitnessGoals.currentWeight.toString()}
            onChange={(e) => setFitnessGoals(prev => ({ ...prev, currentWeight: parseFloat(e.target.value) || 0 }))}
            placeholder="Enter current weight"
          />
          <Input
            label="Target Weight (kg)"
            type="number"
            value={fitnessGoals.targetWeight.toString()}
            onChange={(e) => setFitnessGoals(prev => ({ ...prev, targetWeight: parseFloat(e.target.value) || 0 }))}
            placeholder="Enter target weight"
          />
          <Input
            label="Height (cm)"
            type="number"
            value={fitnessGoals.height.toString()}
            onChange={(e) => setFitnessGoals(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
            placeholder="Enter your height"
          />
          <Input
            label="Weekly Exercise Goal"
            type="number"
            value={fitnessGoals.weeklyExerciseGoal.toString()}
            onChange={(e) => setFitnessGoals(prev => ({ ...prev, weeklyExerciseGoal: parseInt(e.target.value) || 0 }))}
            placeholder="Workouts per week"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Fitness Goal
          </label>
          <div className="flex flex-wrap gap-2">
            {['Weight Loss', 'Muscle Gain', 'Endurance', 'Strength', 'General Fitness'].map((goal) => (
              <Badge
                key={goal}
                variant={goal === fitnessGoals.primaryGoal ? 'primary' : 'default'}
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => handleGoalSelection(goal)}
              >
                {goal}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Current BMI: {calculateBMI()} | Goal: {(fitnessGoals.currentWeight - fitnessGoals.targetWeight).toFixed(1)}kg to lose
          </div>
          <Button variant="primary" onClick={handleFitnessGoalsUpdate}>
            Update Goals
          </Button>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Push Notifications</div>
              <div className="text-sm text-gray-500">Receive workout reminders and achievements</div>
            </div>
            <div 
              className={`w-12 h-6 ${preferences.pushNotifications ? 'bg-blue-500' : 'bg-gray-300'} rounded-full relative cursor-pointer transition-colors`}
              onClick={() => handlePreferenceToggle('pushNotifications')}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Email Reports</div>
              <div className="text-sm text-gray-500">Weekly progress summaries via email</div>
            </div>
            <div 
              className={`w-12 h-6 ${preferences.emailReports ? 'bg-blue-500' : 'bg-gray-300'} rounded-full relative cursor-pointer transition-colors`}
              onClick={() => handlePreferenceToggle('emailReports')}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.emailReports ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">Data Sharing</div>
              <div className="text-sm text-gray-500">Share anonymous data to improve AI recommendations</div>
            </div>
            <div 
              className={`w-12 h-6 ${preferences.dataSharing ? 'bg-blue-500' : 'bg-gray-300'} rounded-full relative cursor-pointer transition-colors`}
              onClick={() => handlePreferenceToggle('dataSharing')}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${preferences.dataSharing ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="primary" onClick={handlePreferencesSave}>
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Account Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => handleAccountAction('change-password')}
          >
            <span className="mr-2">🔒</span>
            Change Password
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => handleAccountAction('update-email')}
          >
            <span className="mr-2">📧</span>
            Update Email
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => handleAccountAction('export-data')}
          >
            <span className="mr-2">📁</span>
            Export Data
          </Button>
          <Button 
            variant="danger" 
            className="w-full justify-start"
            onClick={() => handleAccountAction('delete-account')}
          >
            <span className="mr-2">⚠️</span>
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSection;
