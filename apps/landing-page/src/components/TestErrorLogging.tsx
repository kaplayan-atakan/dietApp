import React, { useState } from 'react';
import { useLandingPageLogger } from '../utils/errorLogger';

const TestErrorLoggingComponent: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const { logUserInteraction, logFormSubmission, logPageView, logger } = useLandingPageLogger();

  const handleHeroClick = () => {
    logUserInteraction('HeroButtonClick', 'Hero', {
      buttonText: 'Get Started',
      section: 'hero'
    });
    setTestResult('Hero interaction logged!');
  };

  const handleFeatureView = () => {
    logPageView('Features');
    setTestResult('Feature section view logged!');
  };

  const handleContactForm = () => {
    // Simulate form submission
    const success = Math.random() > 0.3; // 70% success rate
    
    if (success) {
      logFormSubmission('ContactForm', true);
      setTestResult('Contact form success logged!');
    } else {
      logFormSubmission('ContactForm', false, 'Email validation failed');
      setTestResult('Contact form error logged!');
    }
  };

  const handleNewsletterSignup = () => {
    logUserInteraction('NewsletterSignup', 'Footer', {
      email: 'test@example.com',
      source: 'footer'
    });
    setTestResult('Newsletter signup logged!');
  };

  const handlePricingClick = () => {
    logUserInteraction('PricingPlanClick', 'Pricing', {
      plan: 'premium',
      price: '$29/month'
    });
    setTestResult('Pricing plan click logged!');
  };

  const handleApiError = () => {
    // Simulate an API error during landing page operation
    logger.error('Landing page API error', {
      component: 'LandingPage.ContactForm',
      action: 'SubmitContact',
      errorDetails: 'Failed to submit contact form',
      stackTrace: 'Error: Network timeout\n    at submitForm (contact.js:45:12)',
      context: {
        formData: { name: 'Test User', email: 'test@example.com' },
        endpoint: '/api/contact'
      }
    });
    setTestResult('API error logged!');
  };

  const handlePerformanceIssue = () => {
    // Simulate slow loading
    const loadTime = Math.floor(Math.random() * 8000) + 2000; // 2-10 seconds
    
    logger.logPerformance('PageLoad', loadTime, 'LandingPage.Hero');
    setTestResult(`Performance issue logged! Load time: ${loadTime}ms`);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '20px auto', 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Landing Page Error Logging Test</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleHeroClick}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Hero Click
        </button>
        
        <button
          onClick={handleFeatureView}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Feature View
        </button>
        
        <button
          onClick={handleContactForm}
          style={{
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Contact Form
        </button>
        
        <button
          onClick={handleNewsletterSignup}
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Newsletter
        </button>
        
        <button
          onClick={handlePricingClick}
          style={{
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Pricing Click
        </button>
        
        <button
          onClick={handleApiError}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test API Error
        </button>
        
        <button
          onClick={handlePerformanceIssue}
          style={{
            backgroundColor: '#fd7e14',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Performance
        </button>
      </div>

      {testResult && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #c3e6cb'
        }}>
          ✅ {testResult}
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e9ecef',
        borderRadius: '5px'
      }}>
        <h3 style={{ marginBottom: '10px', color: '#495057' }}>Instructions</h3>
        <ul style={{ color: '#6c757d', fontSize: '14px', lineHeight: '1.5' }}>
          <li>• Click the buttons above to test different types of logging</li>
          <li>• Check the admin panel to see the logs in real-time</li>
          <li>• Logs are automatically batched and sent to the server</li>
          <li>• User interactions, form submissions, and errors are all tracked</li>
        </ul>
      </div>
    </div>
  );
};

export default TestErrorLoggingComponent;
