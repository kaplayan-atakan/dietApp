import '@testing-library/jest-dom';

// Global functions needed for JWT token testing
global.btoa = global.btoa || ((str) => Buffer.from(str, 'binary').toString('base64'));
global.atob = global.atob || ((str) => Buffer.from(str, 'base64').toString('binary'));
