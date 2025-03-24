class OAuthService {
  constructor() {}

  public initiateLogin(): void {
    window.location.href = '/login';
  }

  public getAuthParams(): Record<string, string> | null {
    return null;
  }

  public login(username: string): Record<string, string> {
    // Generate mock auth params - accepts any credentials
    return {
      token1: 'mock-token-123456',
      loginid: username,
    };
  }

  public logout(): void {
    // Clear auth state from localStorage
    localStorage.removeItem('app_params');
    localStorage.removeItem('app_auth');
    
    // Redirect to login page
    window.location.href = '/login';
  }
}

export const oauthService = new OAuthService();
