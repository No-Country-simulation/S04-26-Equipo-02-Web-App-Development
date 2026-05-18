const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

export const API_ENDPOINTS = {
  auth: {
    login: `/api/${API_VERSION}/auth/login`,
    register: `/api/${API_VERSION}/auth/register`,
    logout: `/api/${API_VERSION}/auth/logout`,
    validateSession: `/api/${API_VERSION}/auth/validate-session`,
    verifyEmail: (token: string) => `/api/${API_VERSION}/auth/verify-email/${token}`,
  },
  profiles: `/api/${API_VERSION}/profiles`,
  diagnostic: `/api/${API_VERSION}/diagnostic`,
} as const;