import React, { ComponentType, useEffect, useRef } from 'react';
import { Logger, LogLevel } from '../utils/logger';

interface WithLoggingOptions {
  logLevel?: LogLevel;
  logMount?: boolean;
  logUnmount?: boolean;
  logRenders?: boolean;
  logProps?: boolean;
  componentName?: string;
}

const defaultOptions: WithLoggingOptions = {
  logLevel: LogLevel.DEBUG,
  logMount: true,
  logUnmount: true,
  logRenders: false,
  logProps: false,
};

function withLogging<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithLoggingOptions = {}
) {
  const opts = { ...defaultOptions, ...options };
  const componentName = opts.componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  const WithLoggingComponent = (props: P) => {
    const logger = useRef(new Logger({
      minLevel: opts.logLevel!,
      enableConsole: true,
      enableLocalStorage: true,
      enableRemoteLogging: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
    }));

    const renderCount = useRef(0);
    const mountTime = useRef<number>();

    useEffect(() => {
      // Component mounted
      mountTime.current = Date.now();
      
      if (opts.logMount) {
        logger.current.info(
          `Component mounted`,
          {
            ...(opts.logProps && { props }),
            mountTime: mountTime.current,
          },
          componentName,
          'mount'
        );
      }

      // Component unmount
      return () => {
        if (opts.logUnmount) {
          const unmountTime = Date.now();
          const lifetime = mountTime.current ? unmountTime - mountTime.current : undefined;
          
          logger.current.info(
            `Component unmounted`,
            {
              unmountTime,
              lifetime,
              renderCount: renderCount.current,
            },
            componentName,
            'unmount'
          );
        }
      };
    }, []);

    // Log renders
    useEffect(() => {
      renderCount.current += 1;
      
      if (opts.logRenders) {
        logger.current.debug(
          `Component rendered`,
          {
            renderCount: renderCount.current,
            ...(opts.logProps && { props }),
          },
          componentName,
          'render'
        );
      }
    });

    try {
      return <WrappedComponent {...props} />;
    } catch (error) {
      // Log component render errors
      logger.current.error(
        `Component render error`,
        error as Error,
        {
          props: opts.logProps ? props : '[props hidden]',
          renderCount: renderCount.current,
        },
        componentName,
        'render-error'
      );
      
      // Re-throw the error so Error Boundary can catch it
      throw error;
    }
  };

  WithLoggingComponent.displayName = `withLogging(${componentName})`;
  
  return WithLoggingComponent;
}

export default withLogging;
