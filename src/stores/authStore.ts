/**
 * @file: authStore.ts
 * @description: Singleton store for managing authentication state globally,
 *               providing access to auth data outside of the React component tree.
 *
 * @components:
 *   - AuthStore class: Singleton implementation of auth state management
 *   - authStore export: Singleton instance
 * @dependencies:
 *   - types/auth: AuthorizeResponse type definition
 *   - configService: For retrieving configuration values
 * @usage:
 *   // Get authentication data
 *   const headers = authStore.getHeaders();
 *
 *   // Update authentication state
 *   authStore.setAuthParams(params);
 *
 * @architecture: Singleton pattern with private state management
 * @relationships:
 *   - Used by: API services, auth-related utilities
 *   - Synchronized with: AuthContext for React components
 * @dataFlow:
 *   - Storage: Maintains auth state in memory
 *   - Access: Provides getters for auth data and formatted headers
 *   - Updates: Receives updates from AuthContext
 *
 * @ai-hints: This store uses the Singleton pattern to ensure a single source of
 *            truth for auth state across the application. It's primarily used by
 *            services that need auth data but don't have access to React context.
 */
import { AuthorizeResponse } from '../types/auth';
// Import configService if needed in the future
// import { configService } from '../services/config/configService';

interface AuthState {
  authorizeResponse: AuthorizeResponse | null;
  authParams: Record<string, string> | null;
}

class AuthStore {
  private static instance: AuthStore;
  private state: AuthState = {
    authorizeResponse: null,
    authParams: null
  };

  private constructor() {
    // Initialize from localStorage if available
    const storedAuth = localStorage.getItem('app_auth');
    const storedParams = localStorage.getItem('app_params');
    
    if (storedAuth) {
      this.state.authorizeResponse = JSON.parse(storedAuth);
    }
    if (storedParams) {
      this.state.authParams = JSON.parse(storedParams);
    }
  }

  public static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  public setAuthorizeResponse(data: AuthorizeResponse | null): void {
    this.state.authorizeResponse = data;
  }

  public setAuthParams(params: Record<string, string> | null): void {
    this.state.authParams = params;
  }

  public getAuthorizeResponse(): AuthorizeResponse | null {
    return this.state.authorizeResponse;
  }

  public getAuthParams(): Record<string, string> | null {
    return this.state.authParams;
  }

  public getHeaders(): Record<string, string> {
    return {};
  }
}

export const authStore = AuthStore.getInstance();
