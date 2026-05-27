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
  hiring: {
    opportunities: `/api/${API_VERSION}/hiring/opportunities`,
    offers: `/api/${API_VERSION}/hiring/offers`,
    createOffer: `/api/${API_VERSION}/hiring/create-offer`,
    updateOffer: `/api/${API_VERSION}/hiring/update-offer`,
    deleteOffer: (id: string) => `/api/${API_VERSION}/hiring/delete-offer/${id}`,
    searchCandidates: `/api/${API_VERSION}/hiring/search-candidates`,
    preselection: `/api/${API_VERSION}/hiring/preselection`,
    preselectionStatus: (id: string, status: string) =>
      `/api/${API_VERSION}/hiring/preselection/${id}/${status}`,
  },
  events: {
    getAll: `/api/${API_VERSION}/events/get-all`,
    enroll: (id: string) => `/api/${API_VERSION}/events/enroll/${id}`,
    unenroll: (id: string) => `/api/${API_VERSION}/events/unenroll/${id}`,
    create: `/api/${API_VERSION}/events/create`,
  },
} as const;