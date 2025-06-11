"use client";

import { useEffect, useState } from 'react';

export default function TestLogging() {
  const [logResults, setLogResults] = useState<string[]>([]);
  const [networkRequests, setNetworkRequests] = useState<string[]>([]);

  useEffect(() => {
    console.log('Test logging page loaded');
    setLogResults(prev => [...prev, 'Page loaded successfully']);
    setLogResults(prev => [...prev, 'Ready for testing']);
  }, []);

  const handleManualTest = async () => {
    try {
      setLogResults(prev => [...prev, 'Sending manual test log...']);

      const testLog = {
        Logs: [
          {
            Timestamp: new Date().toISOString(),
            Level: "Info",
            Message: "Manual test log from web app",
            Component: "TestLogging",
            Action: "ManualTest",
            Context: JSON.stringify({
              source: "manual_button",
              timestamp: new Date().toISOString()
            })
          }
        ]
      };

      const response = await fetch('http://localhost:5266/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testLog),
      });

      if (response.ok) {
        const result = await response.json();
        setLogResults(prev => [...prev, `✅ Manual test successful: ${result.message}`]);
        setNetworkRequests(prev => [...prev, `${new Date().toISOString()}: POST /api/logs - 200 OK`]);
      } else {
        setLogResults(prev => [...prev, `❌ Manual test failed: ${response.status} ${response.statusText}`]);
        setNetworkRequests(prev => [...prev, `${new Date().toISOString()}: POST /api/logs - ${response.status} ${response.statusText}`]);
      }
    } catch (error) {
      setLogResults(prev => [...prev, `❌ Manual test error: ${error}`]);
      setNetworkRequests(prev => [...prev, `${new Date().toISOString()}: POST /api/logs - ERROR: ${error}`]);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Logging Test Page</h1>
      <p className="mb-4">
        This page tests the logging functionality by sending logs directly to the admin API.
      </p>
      
      <div className="space-x-4 mb-6">
        <button 
          onClick={handleManualTest}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🚀 Send Manual Test Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-blue-50 rounded">
          <h2 className="font-semibold mb-2">📋 Log Actions:</h2>
          <div className="space-y-1 text-sm">
            {logResults.map((result, index) => (
              <div key={index} className="text-gray-700">{result}</div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <h2 className="font-semibold mb-2">🌐 Network Requests:</h2>
          <div className="space-y-1 text-sm">
            {networkRequests.length === 0 ? (
              <div className="text-gray-500">No requests yet...</div>
            ) : (
              networkRequests.map((request, index) => (
                <div key={index} className="text-gray-700 font-mono text-xs">{request}</div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">ℹ️ Test Information:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>This page sends logs directly to Admin API: <code>http://localhost:5266/api/logs</code></li>
          <li>Admin API logs endpoint is configured with <code>[AllowAnonymous]</code></li>
          <li>Expected response: "Logs created successfully, count: 1"</li>
          <li>Click the button above to test the connection</li>
        </ul>
      </div>
    </div>
  );
}
