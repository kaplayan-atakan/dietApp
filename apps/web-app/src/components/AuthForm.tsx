'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Input from './ui/Input';
import useLogger from '../hooks/useLogger';
import { LogLevel } from '../utils/logger';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const { info, error: logError, logUserAction, logEvent } = useLogger({
    componentName: 'AuthForm',
    minLevel: LogLevel.INFO,
  });  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const authType = isLogin ? 'login' : 'register';
    logUserAction(`auth-form-submit`, { 
      authType, 
      email: email.toLowerCase(),
      hasValidData: isLogin ? !!email && !!password : !!email && !!password && !!firstName 
    });

    try {
      if (isLogin) {
        info('Starting login process', { email: email.toLowerCase() }, 'login-start');
        await login({ email, password });
        info('Login successful', { email: email.toLowerCase() }, 'login-success');
        logEvent('auth-success', { type: 'login', email: email.toLowerCase() });
      } else {
        info('Starting registration process', { 
          email: email.toLowerCase(), 
          firstName, 
          lastName,
          hasProfile: !!height && !!weight && !!activityLevel 
        }, 'register-start');
        
        await register({ 
          email, 
          password, 
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender: gender as 'male' | 'female' | 'other',
          height: parseFloat(height),
          weight: parseFloat(weight),
          activityLevel: activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
        });
        
        info('Registration successful', { 
          email: email.toLowerCase(), 
          firstName, 
          lastName 
        }, 'register-success');
        logEvent('auth-success', { type: 'register', email: email.toLowerCase() });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Authentication failed';
      setError(errorMessage);
      
      logError(
        `Authentication failed: ${authType}`,
        err,
        {
          authType,
          email: email.toLowerCase(),
          errorMessage,
          errorCode: err.code,
        },
        'auth-error'
      );
      
      logEvent('auth-error', { 
        type: authType, 
        email: email.toLowerCase(),
        error: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your AI-powered fitness journey starts here
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="space-y-4">            {!isLogin && (
              <>
                <Input
                  type="text"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Enter your first name"
                />
                <Input
                  type="text"
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Enter your last name"
                />
                <Input
                  type="date"
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  placeholder="Select your date of birth"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input
                  type="number"
                  label="Height (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                  placeholder="Enter your height in cm"
                  min="100"
                  max="300"
                />
                <Input
                  type="number"
                  label="Weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  placeholder="Enter your weight in kg"
                  min="30"
                  max="500"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Activity Level</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very_active">Very Active (2x/day or intense exercise)</option>
                  </select>
                </div>
              </>
            )}
            
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </Button>
              <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  const newMode = !isLogin;
                  setIsLogin(newMode);
                  logUserAction('auth-mode-switch', { 
                    from: isLogin ? 'login' : 'register',
                    to: newMode ? 'login' : 'register'
                  });
                  info(`Switched auth mode`, { 
                    newMode: newMode ? 'login' : 'register' 
                  }, 'mode-switch');
                }}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
