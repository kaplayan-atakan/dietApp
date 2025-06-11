'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@ai-fitness/api-client';
import { useAuth } from '../contexts/AuthContext';
import type { DashboardData } from '@ai-fitness/shared-types';
import LoadingSpinner from './ui/LoadingSpinner';
import Button from './ui/Button';
import Card from './ui/Card';
import Progress from './ui/Progress';
import Badge from './ui/Badge';

const apiClient = new ApiClient({ 
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api' 
});

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);
  const loadDashboardData = async () => {
    try {
      const data = await apiClient.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">AI Fitness Coach</h1>
            </div>            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Hello, {user?.name}</span>
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
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h2>
            <p className="text-gray-600">Here's your fitness progress today</p>
          </div>          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🔥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Calories Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats?.totalCalories || 0}
                    </p>
                  </div>
                </div>
                <Badge variant="info" size="sm">
                  Goal: 2000
                </Badge>
              </div>
              <Progress
                value={dashboardData?.stats?.totalCalories || 0}
                max={2000}
                variant="default"
                showLabel={false}
              />
              <p className="text-xs text-gray-500 mt-2">
                {2000 - (dashboardData?.stats?.totalCalories || 0)} calories remaining
              </p>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">💪</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Workouts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats?.workoutsCompleted || 0}
                    </p>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  This Week
                </Badge>
              </div>
              <Progress
                value={dashboardData?.stats?.workoutsCompleted || 0}
                max={5}
                variant="success"
                showLabel={false}
              />
              <p className="text-xs text-gray-500 mt-2">
                {5 - (dashboardData?.stats?.workoutsCompleted || 0)} workouts to weekly goal
              </p>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">💧</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Water Intake</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData?.stats?.streak || 0} days
                    </p>
                  </div>
                </div>
                <Badge variant="primary" size="sm">
                  Streak
                </Badge>
              </div>
              <Progress
                value={dashboardData?.stats?.streak || 0}
                max={30}
                variant="default"
                showLabel={false}
              />
              <p className="text-xs text-gray-500 mt-2">
                {30 - (dashboardData?.stats?.streak || 0)} days to monthly goal
              </p>
            </Card>
          </div>

          {/* Weekly Goals */}
          <Card className="mb-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Weekly Goals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Exercise</span>
                  <Badge variant="success" size="sm">On Track</Badge>
                </div>
                <Progress value={3} max={5} variant="success" showLabel />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Nutrition</span>
                  <Badge variant="warning" size="sm">Behind</Badge>
                </div>
                <Progress value={4} max={7} variant="warning" showLabel />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Sleep</span>
                  <Badge variant="success" size="sm">Excellent</Badge>
                </div>
                <Progress value={6} max={7} variant="success" showLabel />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Hydration</span>
                  <Badge variant="default" size="sm">Good</Badge>
                </div>
                <Progress value={85} max={100} variant="default" showLabel />
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="mb-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto space-y-2"
              >
                <span className="text-2xl">🍎</span>
                <span className="text-sm font-medium">Log Meal</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto space-y-2"
              >
                <span className="text-2xl">🏋️</span>
                <span className="text-sm font-medium">Start Workout</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto space-y-2"
              >
                <span className="text-2xl">💧</span>
                <span className="text-sm font-medium">Add Water</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center p-4 h-auto space-y-2"
              >
                <span className="text-2xl">📊</span>
                <span className="text-sm font-medium">View Progress</span>
              </Button>
            </div>
          </Card>          {/* AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                AI Recommendations
              </h3>
              <div className="space-y-3">
                {dashboardData?.aiRecommendations?.map((recommendation, index) => (
                  <div key={recommendation.id} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1 mr-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">🤖</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{recommendation.title}</span>
                          <p className="text-xs text-gray-500 mt-1">{recommendation.description}</p>
                          <div className="flex items-center mt-2 space-x-2">
                            <Badge variant="info" size="sm">AI Generated</Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(recommendation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <p className="text-sm text-gray-500">No AI recommendations available yet</p>
                    <p className="text-xs text-gray-400 mt-1">Complete your profile to get personalized suggestions</p>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activities
              </h3>              <div className="space-y-3">
                {[
                  { id: 1, type: 'workout', title: 'Morning Cardio', time: '2 hours ago', icon: '🏃‍♂️', badge: 'Completed' },
                  { id: 2, type: 'meal', title: 'Logged Breakfast', time: '3 hours ago', icon: '🥗', badge: 'Healthy' },
                  { id: 3, type: 'water', title: 'Water Goal Reached', time: '4 hours ago', icon: '💧', badge: 'Achievement' },
                  { id: 4, type: 'sleep', title: 'Sleep Tracked', time: '8 hours ago', icon: '😴', badge: 'Good Quality' },
                ].map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm">{activity.icon}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="success" size="sm">
                        {activity.badge}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" size="sm" className="w-full">
                  View All Activities
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
