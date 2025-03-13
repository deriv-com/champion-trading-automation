interface AuthConfig {
  oauthAppId: string;
  oauthUrl: string;
  wsUrl: string;
  authUrl: string;
  derivUrl: string;
}

const CONFIG_STORAGE_KEY = 'auth_config_overrides';

class ConfigService {
  private static instance: ConfigService;
  
  private constructor() {}
  
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
  
  // Get stored overrides from localStorage
  private getStoredOverrides(): Partial<AuthConfig> {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading config from localStorage:', error);
      return {};
    }
  }
  
  // Save overrides to localStorage
  public saveOverrides(overrides: Partial<AuthConfig>): void {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(overrides));
    } catch (error) {
      console.error('Error saving config to localStorage:', error);
    }
  }
  
  // Clear all overrides
  public clearOverrides(): void {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  }
  
  // Get default values from environment variables
  public getDefaults(): AuthConfig {
    return {
      oauthAppId: import.meta.env.VITE_OAUTH_APP_ID || '',
      oauthUrl: import.meta.env.VITE_OAUTH_URL || '',
      wsUrl: import.meta.env.VITE_WS_URL || '',
      authUrl: import.meta.env.VITE_Auth_Url || '',
      derivUrl: import.meta.env.VITE_Deriv_Url || '',
    };
  }
  
  // Get effective configuration (overrides + defaults)
  public getConfig(): AuthConfig {
    const defaults = this.getDefaults();
    const overrides = this.getStoredOverrides();
    
    return {
      ...defaults,
      ...overrides,
    };
  }
  
  // Get a specific configuration value
  public getValue<K extends keyof AuthConfig>(key: K): AuthConfig[K] {
    const config = this.getConfig();
    return config[key];
  }
  
  // Set a specific configuration value
  public setValue<K extends keyof AuthConfig>(key: K, value: AuthConfig[K]): void {
    const overrides = this.getStoredOverrides();
    overrides[key] = value;
    this.saveOverrides(overrides);
  }
}

export const configService = ConfigService.getInstance();