import { AuthorizeResponse } from '../types/auth';
import { configService } from '../services/config/configService';

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
    return {
      'loginid': this.state.authorizeResponse?.authorize.loginid || '',
      'authorize': this.state.authParams?.token1 || '',
      'userid': String(this.state.authorizeResponse?.authorize.userId || ''),
      'auth-url': configService.getValue('authUrl'),
      'deriv-url': configService.getValue('derivUrl')
    };
  }
}

export const authStore = AuthStore.getInstance();
