import { configService } from '../config/configService';

class OAuthService {
  constructor() {}

  public initiateLogin(): void {
    const appId = configService.getValue('oauthAppId');
    const authUrl = configService.getValue('oauthUrl');
    
    const params = new URLSearchParams({
      app_id: appId,
      l: 'en',
      route: window.location.pathname,
    });

    window.location.href = `${authUrl}?${params.toString()}`;
  }

  public getAuthParams(): Record<string, string> | null {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    
    // Clean up URL after extracting parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return Object.keys(params).length > 0 ? params : null;
  }
}

export const oauthService = new OAuthService();
