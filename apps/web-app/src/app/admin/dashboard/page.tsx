'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  BugAntIcon,
  ClockIcon,
  ComputerDesktopIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface LogStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  lastLogTime?: string;
  logsByComponent: Record<string, number>;
  logsByLevel: Record<string, number>;
}

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  component?: string;
  action?: string;
  context?: any;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  errorDetails?: string;
  responseCode?: number;
  responseTime?: number;
}

interface PagedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const LogLevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors = {
    ERROR: 'bg-red-100 text-red-800 border-red-200',
    WARN: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    INFO: 'bg-blue-100 text-blue-800 border-blue-200',
    DEBUG: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[level as keyof typeof colors] || colors.DEBUG}`}>
      {level}
    </span>
  );
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 50,
    totalCount: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    level: '',
    component: '',
    search: '',
    page: 1
  });
  const [error, setError] = useState('');
  const router = useRouter();

  // Get admin token with authorization header
  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (!token || !userStr) {
      router.push('/admin/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const expiresAt = new Date(user.expiresAt);
      
      if (expiresAt <= new Date()) {
        // Token expired
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
        return;
      }

      setAdminUser(user);
      setIsAuthenticated(true);
    } catch {
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch log statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5266/api/logs/summary', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    }
  };

  // Fetch logs with filters
  const fetchLogs = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        pageSize: '50',
        ...(filters.level && { level: filters.level }),
        ...(filters.component && { component: filters.component }),
        ...(filters.search && { message: filters.search })
      });

      const response = await fetch(`http://localhost:5266/api/logs?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error('Failed to fetch logs');
      }
      
      const data: PagedResponse<LogEntry> = await response.json();
      setLogs(data.data);
      setPagination({
        currentPage: data.pageNumber,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        totalPages: data.totalPages
      });
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load logs');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchStats(), fetchLogs()]);
        setLoading(false);
      };
      loadData();
    }
  }, [isAuthenticated, filters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Client Logging & Monitoring Panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {adminUser?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Logs</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalLogs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Errors</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.errorCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <InformationCircleIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Warnings</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.warningCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <InformationCircleIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Info Logs</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.infoCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Level
              </label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="ERROR">Error</option>
                <option value="WARN">Warning</option>
                <option value="INFO">Info</option>
                <option value="DEBUG">Debug</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Component
              </label>
              <input
                type="text"
                value={filters.component}
                onChange={(e) => handleFilterChange('component', e.target.value)}
                placeholder="Filter by component"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Message
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search in messages"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Logs</h2>
            <p className="text-sm text-gray-600">
              Showing {logs.length} of {pagination.totalCount} logs
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">Loading logs...</div>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">No logs found matching your criteria</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Component
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <LogLevelBadge level={log.level} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.component || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                        {log.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.userId || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
