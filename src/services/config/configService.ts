/**
 * @file: configService.ts
 * @description: Service for managing application configuration with support for
 *               environment variables, local storage overrides, and runtime configuration.
 *
 * @components:
 *   - ConfigService: Singleton class implementing configuration management
 *   - configService: Exported singleton instance
 *   - AuthConfig: Interface defining configuration structure
 * @dependencies:
 *   - localStorage: For persistent configuration overrides
 *   - Vite environment variables: For default configuration values
 * @usage:
 *   // Get a configuration value
 *   const wsUrl = configService.getValue('wsUrl');
 *
 *   // Override a configuration value
 *   configService.setValue('oauthUrl', 'https://custom-oauth-server.com');
 *
 *   // Get complete configuration
 *   const config = configService.getConfig();
 *
 * @architecture: Singleton service with localStorage persistence
 * @relationships:
 *   - Used by: OAuth service, WebSocket service, API services
 *   - Related to: Environment configuration (.env files)
 * @dataFlow:
 *   - Defaults: Loaded from environment variables
 *   - Overrides: Stored in and retrieved from localStorage
 *   - Runtime: Merged configuration provided to services
 *
 * @ai-hints: This service implements the Singleton pattern and provides a centralized
 *            way to manage configuration with a layered approach (defaults from env vars,
 *            overrides from localStorage). It's particularly useful for endpoint
 *            configuration that might need to be changed at runtime.
 */
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