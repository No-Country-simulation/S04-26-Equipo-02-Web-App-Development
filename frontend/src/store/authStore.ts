import { create } from 'zustand';
import * as authApi from '../api/auth';
import api from '../api/axios';
import { API_ENDPOINTS } from '../lib/constants';
import type { User, LoginCredentials, RegisterData } from '../types';

// ── Module-level idempotency guard ──────────────────────────────────────────
// Prevents checkSession from running twice in StrictMode double-mount.
let _initialized = false;

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (fields: Partial<User>) => void;
  checkSession: () => Promise<void>;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // ── Actions ──────────────────────────────────────────────────────────────

  login: async (credentials) => {
    await authApi.login(credentials);

    // Construct user from credentials — the API establishes the session cookie.
    // User details will be refined by checkSession() on next page load.
    const user: User = {
      id: '',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      role: credentials.provider,
    };

    set({ user, isAuthenticated: true });
    localStorage.setItem('user', JSON.stringify(user));
  },

  register: async (data) => {
    await authApi.register(data);
    // Intentionally no store change — register does NOT auto-login.
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
    localStorage.removeItem('company');
  },

  updateUser: (fields) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...fields };
    set({ user: updatedUser });
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },

  checkSession: async () => {
    // ── Idempotency guard ──────────────────────────────────────────────
    // React 19 StrictMode double-mounts in dev. This flag ensures the
    // validate-session call runs exactly once per page load.
    if (_initialized) return;
    _initialized = true;

    try {
      // 1. Validate the session cookie with the backend
      await authApi.validateSession();

      // 2. Session valid — read stored user data from localStorage
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const user: User = JSON.parse(storedUser);

        // 3. Role-specific enrichment
        if (user.role === 'PROFESSIONAL') {
          // Fetch full profile for name enrichment
          try {
            const profileRes = await api.get(API_ENDPOINTS.profiles + '/me');
            const profile = profileRes.data;
            if (profile) {
              user.id = profile.id || user.id;
              user.firstName = profile.firstName || user.firstName;
              user.lastName = profile.lastName || user.lastName;
              const fullName = [profile.firstName, profile.lastName]
                .filter(Boolean)
                .join(' ');
              if (fullName) user.name = fullName;
            }
          } catch {
            // Profile fetch failure is non-fatal — session remains valid
            // with the default name derived from email.
          }
        }

        if (user.role === 'COMPANY') {
          // Read company data from localStorage for display name
          const storedCompany = localStorage.getItem('company');
          if (storedCompany) {
            try {
              const companyData = JSON.parse(storedCompany);
              user.name = companyData.companyName || user.name;
            } catch {
              // Malformed JSON — use default name
            }
          }
        }

        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        // Session valid but no localStorage data — session-only edge case.
        // Keep user null; login page will prompt re-authentication.
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      // Session invalid, expired, or network error
      localStorage.removeItem('user');
      localStorage.removeItem('company');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
