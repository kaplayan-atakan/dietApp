import { createErrorLogger, getErrorLogger } from '@ai-fitness/utils';

// Initialize error logger for landing page
const ERROR_LOGGER_CONFIG = {
  apiEndpoint: 'http://localhost:5266/api/logs',
  enabledEnvironments: ['development', 'production'],
  batchSize: 3,
  flushInterval: 5000,
  enableConsoleLogging: typeof window !== 'undefined' && window.location.hostname === 'localhost'
};

// Initialize error logger
let isInitialized = false;

export const initializeLandingPageLogger = () => {
  if (!isInitialized) {
    try {
      createErrorLogger(ERROR_LOGGER_CONFIG);
      isInitialized = true;
      
      // Log landing page initialization
      const logger = getErrorLogger();
      logger.info('Landing page initialized', {
        component: 'LandingPage',
        action: 'Initialize',
        context: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize landing page logger:', error);
      // Set flag to true even on error to prevent infinite retries
      isInitialized = true;
    }
  }
};

// Hook for components to log user interactions
export const useLandingPageLogger = () => {
  // Ensure logger is initialized before using
  if (!isInitialized) {
    initializeLandingPageLogger();
  }
  
  let logger;
  try {
    logger = getErrorLogger();
  } catch (error) {
    console.error('Error getting logger in useLandingPageLogger:', error);
    // Return dummy functions if logger fails
    return {
      logUserInteraction: () => {},
      logFormSubmission: () => {},
      logPageView: () => {},
      logger: null
    };
  }
  
  const logUserInteraction = (action: string, component: string, context: any = {}) => {
    try {
      logger.info(`User interaction: ${action}`, {
        component: `LandingPage.${component}`,
        action,
        context: {
          ...context,
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      });
    } catch (error) {
      console.error('Error logging user interaction:', error);
    }
  };
  const logFormSubmission = (formName: string, success: boolean, errorMessage?: string) => {
    try {
      if (success) {
        logger.info(`Form submitted successfully: ${formName}`, {
          component: 'LandingPage.Form',
          action: 'FormSubmit',
          context: { formName, success }
        });
      } else {
        logger.error(`Form submission failed: ${formName}`, {
          component: 'LandingPage.Form',
          action: 'FormSubmit',
          errorDetails: errorMessage,
          context: { formName, success }
        });
      }
    } catch (error) {
      console.error('Error logging form submission:', error);
    }
  };
  const logPageView = (section: string) => {
    try {
      logger.info(`Page section viewed: ${section}`, {
        component: 'LandingPage.Navigation',
        action: 'PageView',
        context: {
          section,
          timestamp: new Date().toISOString(),
          url: window.location.href
        }
      });
    } catch (error) {
      console.error('Error logging page view:', error);
    }
  };

  return {
    logUserInteraction,
    logFormSubmission,
    logPageView,
    logger
  };
};
