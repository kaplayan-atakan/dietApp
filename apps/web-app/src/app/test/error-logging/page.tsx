import TestErrorLogging from '../../../components/TestErrorLogging';

export default function ErrorLoggingTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Error Logging Test Page
        </h1>
        <TestErrorLogging />
      </div>
    </div>
  );
}
