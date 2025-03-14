# Technical Context: Champion Trading Automation

## Frontend Core Technologies

### React 18
- **Usage**: Primary UI library for building the component-based interface
- **Key Features**:
  - Functional components with hooks
  - Concurrent rendering
  - Automatic batching of state updates
  - Suspense for data fetching
- **Implementation Notes**:
  - Strict mode enabled for development
  - Error boundaries implemented for graceful error handling
  - React.memo used for performance optimization

### TypeScript 5
- **Usage**: Primary programming language for type safety and developer experience
- **Key Features**:
  - Strong static typing
  - Interface-based design
  - Generics for reusable components
  - Type guards for runtime type checking
- **Implementation Notes**:
  - Strict mode enabled
  - Explicit return types on public functions
  - Comprehensive interface definitions
  - Discriminated unions for complex state

### Vite
- **Usage**: Build tool for development and production builds
- **Key Features**:
  - Fast hot module replacement (HMR)
  - ES modules native support
  - Optimized production builds
  - Built-in TypeScript support
- **Implementation Notes**:
  - Custom Vite plugins for specific build requirements
  - Environment variable handling
  - Optimized asset handling

## UI and Styling

### Ant Design 5
- **Usage**: Enterprise-grade UI component library
- **Key Components**:
  - Form elements and validation
  - Data display components
  - Navigation components
  - Feedback components
- **Implementation Notes**:
  - Custom theme configuration
  - On-demand import for performance
  - Extended components for specific needs

### SCSS Modules
- **Usage**: Component-scoped styling with BEM methodology
- **Key Features**:
  - Local scope for styles
  - Variables and mixins
  - Nested selectors
  - Import of shared styles
- **Implementation Notes**:
  - BEM naming convention
  - Separate files for each component
  - Shared variables in central files

### CSS Variables
- **Usage**: Theming and consistent design tokens
- **Key Features**:
  - Runtime theme switching
  - Consistent color palette
  - Responsive spacing system
  - Typography scale
- **Implementation Notes**:
  - Root variables for global tokens
  - Component-specific variables
  - Media query integration

## State Management

### React Context API
- **Usage**: Shared state management across components
- **Key Contexts**:
  - AuthContext: Authentication state
  - ThemeContext: Theme preferences
  - BalanceContext: User balance information
  - PositionsContext: Trading positions
  - NavigationContext: Navigation state
  - ProcessingStackContext: Processing queue
  - TradeContext: Trading operations
  - SSEContext: Server-sent events
- **Implementation Notes**:
  - Provider composition pattern
  - Context-specific hooks for consumers
  - Memoization of context values

### Custom Hooks
- **Usage**: Encapsulating and reusing stateful logic
- **Key Hooks**:
  - useWebSocket: WebSocket connection management
  - useSSE: Server-sent events handling
  - useBalanceSSE: Balance updates via SSE
  - useBots: Bot management operations
  - useExternalSSE: External SSE integration
- **Implementation Notes**:
  - Consistent naming convention
  - Clear return type definitions
  - Error handling and loading states
  - Cleanup on unmount

### Singleton Stores
- **Usage**: Global state accessible outside React components
- **Key Stores**:
  - authStore: Authentication state and operations
- **Implementation Notes**:
  - Private constructors
  - Static getInstance methods
  - Observable pattern for updates
  - Persistence integration

## Network and Communication

### Axios
- **Usage**: HTTP client for API requests
- **Key Features**:
  - Request/response interceptors
  - Automatic JSON transformation
  - Error handling
  - Request cancellation
- **Implementation Notes**:
  - Base instance with common configuration
  - Service-specific instances
  - Retry logic for transient failures
  - Authentication token management

### WebSocket API
- **Usage**: Real-time bidirectional communication
- **Key Features**:
  - Connection management
  - Automatic reconnection
  - Message parsing
  - Subscription management
- **Implementation Notes**:
  - Custom wrapper for WebSocket API
  - Typed message handling
  - Heartbeat mechanism
  - Backoff strategy for reconnection

### Server-Sent Events (SSE)
- **Usage**: Server-to-client real-time updates
- **Key Features**:
  - Connection management
  - Event filtering
  - Automatic reconnection
  - Message parsing
- **Implementation Notes**:
  - Custom wrapper for EventSource API
  - Typed event handling
  - Reconnection with exponential backoff
  - Multiple stream support

## Development and Quality

### ESLint + Prettier
- **Usage**: Code quality and formatting
- **Key Features**:
  - TypeScript-specific rules
  - React best practices
  - Automatic formatting
  - Import sorting
- **Implementation Notes**:
  - Custom rule configuration
  - Pre-commit hooks integration
  - Editor integration
  - CI/CD pipeline integration

### Jest + React Testing Library
- **Usage**: Testing framework
- **Key Features**:
  - Component testing
  - Hook testing
  - Service testing
  - Snapshot testing
- **Implementation Notes**:
  - Test coverage requirements
  - Mock implementations
  - Custom test utilities
  - CI/CD pipeline integration

### Git Hooks
- **Usage**: Pre-commit validation and quality checks
- **Key Features**:
  - Build verification
  - Linting
  - Type checking
  - Test running
- **Implementation Notes**:
  - Husky for hook management
  - Custom scripts for validation
  - Bypass options for emergencies
  - Documentation for developers

## Development Environment Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- Git

### Installation Steps
1. Clone the repository
2. Install dependencies with `npm install`
3. Configure environment variables by copying `.env.example` to `.env`
4. Start development server with `npm run dev`

### Environment Variables
```
# API Configuration
VITE_OAUTH_APP_ID=your_app_id
VITE_OAUTH_URL=https://your-oauth-server.com/oauth2/authorize
VITE_PLATFORM_NAME=champion-automation
VITE_BRAND_NAME=your_brand

# WebSocket Configuration
VITE_WS_URL=wss://your-ws-server.com/websockets/v3
VITE_Auth_Url=https://your-auth-server.com/websockets/authorize
VITE_Deriv_Url=wss://your-deriv-server.com/websockets/v3
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run format`: Run Prettier
- `npm run test`: Run Jest tests
- `npm run test:coverage`: Run tests with coverage report
- `npm run test:pre-commit`: Test the pre-commit hook

## Deployment Configuration

### Vercel Configuration
- **vercel.json**: Configuration for Vercel deployment
- **Key Settings**:
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variables
  - Redirects for SPA routing

### Firebase Configuration
- **firebase.json**: Configuration for Firebase deployment
- **Key Settings**:
  - Hosting configuration
  - Rewrite rules for SPA routing
  - Cache control headers
  - Redirect rules

## Technical Constraints

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Android Chrome
- **No IE Support**: Internet Explorer is not supported

### Performance Targets
- **Initial Load**: < 2s on broadband, < 5s on 3G
- **Time to Interactive**: < 3s on broadband, < 6s on 3G
- **Runtime Performance**: 60fps for animations and interactions
- **Bundle Size**: < 500KB initial load (gzipped)

### API Limitations
- **Rate Limits**: Varies by endpoint, typically 60-120 requests per minute
- **WebSocket Connections**: Limited to 4 concurrent connections per user
- **SSE Connections**: Limited to 2 concurrent connections per user
- **Authentication**: OAuth2 tokens expire after 1 hour, refresh tokens after 30 days

### Security Requirements
- **Authentication**: OAuth2 with PKCE
- **Data Storage**: Sensitive data not stored in localStorage
- **API Communication**: HTTPS only
- **CORS**: Strict origin policy
- **Content Security Policy**: Restrictive CSP implemented

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.x | UI library |
| react-dom | 18.x | DOM rendering |
| react-router-dom | 6.x | Routing |
| typescript | 5.x | Type checking |
| antd | 5.x | UI components |
| axios | 1.x | HTTP client |
| date-fns | 2.x | Date manipulation |
| lodash | 4.x | Utility functions |
| uuid | 9.x | UUID generation |
| zod | 3.x | Schema validation |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | 4.x | Build tool |
| @types/react | 18.x | React type definitions |
| @types/react-dom | 18.x | React DOM type definitions |
| @typescript-eslint/eslint-plugin | 5.x | TypeScript ESLint |
| eslint | 8.x | Linting |
| eslint-plugin-react | 7.x | React linting |
| eslint-plugin-react-hooks | 4.x | React hooks linting |
| jest | 29.x | Testing |
| @testing-library/react | 14.x | React testing |
| prettier | 2.x | Code formatting |
| sass | 1.x | SCSS processing |
| husky | 8.x | Git hooks |

## Integration Points

### OAuth Provider
- **Integration Type**: OAuth2 authentication
- **Endpoints**:
  - Authorization: `${VITE_OAUTH_URL}`
  - Token: `${VITE_OAUTH_URL}/token`
  - Userinfo: `${VITE_OAUTH_URL}/userinfo`
- **Implementation**: Custom OAuth service with token management

### Trading API
- **Integration Type**: REST API
- **Base URL**: Configured via environment variables
- **Authentication**: Bearer token
- **Implementation**: Service layer with typed requests/responses

### Market Data WebSocket
- **Integration Type**: WebSocket API
- **URL**: `${VITE_WS_URL}`
- **Authentication**: Token-based
- **Implementation**: Custom WebSocket service with reconnection logic

### Notification SSE
- **Integration Type**: Server-Sent Events
- **URL**: Configured via environment variables
- **Authentication**: Token in request header
- **Implementation**: Custom SSE service with event filtering