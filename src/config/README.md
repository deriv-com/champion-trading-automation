# Config

This directory contains configuration files and utilities for the Champion Trading Automation application.

## Overview

The config directory centralizes application configuration, making it easier to manage environment-specific settings, API endpoints, feature flags, and other configuration parameters.

## Structure

The main configuration file is `api.config.ts`, which defines API-related configuration settings.

## API Configuration

The `api.config.ts` file defines API endpoints, timeouts, and other API-related settings:

```typescript
// Example api.config.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  ENDPOINTS: {
    AUTH: '/auth',
    TRADE: '/trade',
    POSITIONS: '/positions',
    STRATEGIES: '/strategies',
    BOTS: '/bots',
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};
```

## Environment Variables

The application uses Vite's environment variable system, which is defined in the `vite-env.d.ts` file:

```typescript
// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_Auth_Url: string
  readonly VITE_Deriv_Url: string
  readonly VITE_OAUTH_APP_ID: string
  readonly VITE_OAUTH_URL: string
  readonly VITE_PLATFORM_NAME: string
  readonly VITE_BRAND_NAME: string
  readonly VITE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Environment variables are loaded from `.env` files and can be accessed using `import.meta.env.VARIABLE_NAME`.

## Usage

### Accessing Configuration

Configuration values can be imported and used throughout the application:

```typescript
import { API_CONFIG } from '../config/api.config';

function fetchData() {
  return fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POSITIONS}`, {
    headers: API_CONFIG.HEADERS,
    timeout: API_CONFIG.TIMEOUT,
  });
}
```

### Environment-Specific Configuration

Different environments (development, staging, production) can have different configuration values:

```typescript
// Example of environment-specific configuration
export const API_CONFIG = {
  BASE_URL: (() => {
    switch (import.meta.env.MODE) {
      case 'development':
        return 'http://localhost:3000/api';
      case 'staging':
        return 'https://staging-api.example.com';
      case 'production':
        return 'https://api.example.com';
      default:
        return 'http://localhost:3000/api';
    }
  })(),
  // Other configuration...
};
```

## Configuration Service

For more complex configuration needs, a configuration service can be used to manage configuration values:

```typescript
// Example configService.ts
import { API_CONFIG } from '../config/api.config';

class ConfigService {
  private config = {
    api: { ...API_CONFIG },
    features: {
      darkMode: true,
      betaFeatures: false,
    },
    // Other configuration...
  };

  getApiUrl() {
    return this.config.api.BASE_URL;
  }

  getApiEndpoint(name: keyof typeof API_CONFIG.ENDPOINTS) {
    return this.config.api.ENDPOINTS[name];
  }

  isFeatureEnabled(featureName: keyof typeof this.config.features) {
    return this.config.features[featureName];
  }

  updateConfig(newConfig: Partial<typeof this.config>) {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }
}

export const configService = new ConfigService();
```

## Best Practices

### Configuration Management

1. **Centralization**: Keep all configuration in a central location to make it easier to manage.

2. **Environment Variables**: Use environment variables for sensitive or environment-specific configuration.

3. **Type Safety**: Use TypeScript interfaces to ensure type safety for configuration values.

### Security

1. **Sensitive Data**: Never include sensitive data like API keys or secrets directly in the code.

2. **Environment Variables**: Use environment variables for sensitive configuration.

3. **Runtime Configuration**: Consider using runtime configuration for values that might change without redeploying the application.

### Maintainability

1. **Documentation**: Document configuration values and their purpose.

2. **Default Values**: Provide sensible default values for all configuration parameters.

3. **Validation**: Validate configuration values to ensure they are valid.

## Testing

Configuration can be mocked in tests to isolate components from external dependencies:

```typescript
// Example test setup
import { API_CONFIG } from '../config/api.config';

// Mock the API_CONFIG
jest.mock('../config/api.config', () => ({
  API_CONFIG: {
    BASE_URL: 'http://test-api.example.com',
    TIMEOUT: 1000,
    ENDPOINTS: {
      AUTH: '/auth',
      // Other endpoints...
    },
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }
}));

// Test that uses the mocked configuration
test('API client uses correct base URL', () => {
  expect(API_CONFIG.BASE_URL).toBe('http://test-api.example.com');
});
```

## Extending Configuration

When adding new configuration:

1. Add the configuration to the appropriate file
2. Update TypeScript interfaces to include the new configuration
3. Add default values for the new configuration
4. Update documentation to describe the new configuration
5. Consider backward compatibility if changing existing configuration
