# Champion Trading Automation

This directory contains the source code for the Champion Trading Automation application, a sophisticated platform for automated cryptocurrency and forex trading.

## Application Overview

Champion Trading Automation is a professional-grade React-based web application designed for automated trading. It provides traders with a comprehensive interface for creating, managing, and monitoring trading strategies, bots, and positions across multiple markets.

### Key Features

- **Strategy Management**: Create, test, and deploy trading strategies
- **Bot Automation**: Configure and monitor automated trading bots
- **Position Tracking**: Real-time monitoring of open and closed positions
- **Market Analysis**: Tools for analyzing market trends and opportunities
- **Real-time Updates**: Live data streaming via WebSockets and SSE
- **User Authentication**: Secure OAuth2-based authentication
- **Responsive Design**: Full functionality across desktop and mobile devices

## Directory Structure

The application follows a domain-driven, feature-based architecture with the following directory structure:

```
src/
├── assets/            # Static assets (images, icons, fonts)
├── components/        # Reusable UI components
│   ├── AccountHeader/ # Account information display
│   ├── Bots/         # Bot management components
│   ├── Positions/    # Position tracking components
│   └── ...           # Other component directories
├── config/           # Application configuration
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Top-level page components
├── providers/        # Provider components
├── router/           # Routing configuration
├── services/         # Service modules for external interactions
│   ├── api/          # API service
│   ├── oauth/        # Authentication service
│   ├── sse/          # Server-Sent Events service
│   ├── trade/        # Trading service
│   └── websocket/    # WebSocket service
├── stores/           # State management stores
├── styles/           # Global styles and theming
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
└── vite-env.d.ts     # TypeScript declarations for Vite
```

## Key Files

- **App.tsx**: Main application component that sets up the layout and routing structure
- **main.tsx**: Application entry point that renders the app with all necessary providers
- **vite-env.d.ts**: TypeScript declarations for Vite environment variables and module types

## Technology Stack

### Core Technologies

- **React 18**: UI library with hooks and functional components
- **TypeScript 5**: Strongly-typed programming language
- **Vite**: Modern build tool for fast development and optimized production builds

### UI and Styling

- **Ant Design 5**: Enterprise-grade UI component library
- **SCSS Modules**: Scoped styling with BEM methodology
- **CSS Variables**: For theming and consistent design tokens

### State Management and Data Flow

- **React Context API**: For shared state management
- **Custom Hooks**: For encapsulating and reusing stateful logic
- **Store Pattern**: For state that needs to be accessed outside React

### Routing and Navigation

- **React Router 6**: For declarative routing
- **History API**: For programmatic navigation

### Network and Communication

- **Axios**: HTTP client for API requests
- **WebSocket API**: For real-time bidirectional communication
- **Server-Sent Events (SSE)**: For server-to-client real-time updates

### Testing

- **Jest**: Testing framework
- **React Testing Library**: For component testing
- **MSW**: For API mocking

## Architecture

The application follows a modern React architecture with several key design principles:

### Component Architecture

Components are organized following atomic design principles and the container/presentational pattern:

#### Component Hierarchy

```
Pages
├── Container Components (connected to state)
│   ├── Feature Components (domain-specific)
│   │   ├── UI Components (presentational)
│   │   └── Shared Components (reusable)
```

#### Component Structure

Each component is encapsulated in its own directory:

```
ComponentName/
├── index.tsx          # Component implementation
├── styles.scss        # Component-specific styles
├── README.md          # Component documentation (optional)
└── components/        # Sub-components (optional)
    └── SubComponent/
```

### State Management Architecture

The application uses a layered state management approach:

#### State Management Layers

1. **Component State**: Local state using `useState` and `useReducer`
2. **Shared State**: React Context for state shared across components
3. **Global State**: Store modules for application-wide state
4. **Persistent State**: Local storage for state that persists across sessions

#### Context Structure

Contexts are organized by domain and follow a provider/consumer pattern:

```
AuthContext
├── AuthProvider       # Provides authentication state
├── useAuth           # Custom hook for consuming auth state
└── AuthContext       # The context object itself
```

### Data Flow Architecture

The application follows a unidirectional data flow pattern:

#### Data Flow Cycle

```
┌─────────────────┐
│  User Interface │
└────────┬────────┘
         │ Events
         ▼
┌─────────────────┐
│  State Updates  │
└────────┬────────┘
         │ Effects
         ▼
┌─────────────────┐
│ Service Calls   │
└────────┬────────┘
         │ Responses
         ▼
┌─────────────────┐
│  State Updates  │
└────────┬────────┘
         │ Renders
         ▼
┌─────────────────┐
│  User Interface │
└─────────────────┘
```

### Real-time Communication Architecture

The application implements a sophisticated real-time communication system:

#### WebSocket Communication

- **Connection Management**: Automatic connection establishment and reconnection
- **Message Handling**: Type-safe message parsing and handling
- **Subscription Model**: Topic-based subscription for targeted updates

#### Server-Sent Events (SSE)

- **Event Streaming**: Continuous event stream from server to client
- **Event Filtering**: Client-side filtering of relevant events
- **Reconnection Logic**: Automatic reconnection with exponential backoff

## Development Workflow

The application follows a rigorous Test-Driven Development (TDD) approach:

### TDD Cycle

```
┌─────────────────┐
│   Write Test    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Test Fails     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Write Minimal   │
│     Code        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Test Passes    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Refactor     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Tests Still Pass│
└─────────────────┘
```

### Development Process

1. **Feature Planning**: Define requirements and acceptance criteria
2. **Test Writing**: Create tests that define the expected behavior
3. **Implementation**: Write the minimal code to pass the tests
4. **Refactoring**: Improve the code while maintaining test coverage
5. **Code Review**: Peer review of code changes
6. **Integration**: Merge changes into the main codebase

## Getting Started

To start working with the Champion Trading Automation codebase:

### Prerequisites

- Node.js 16+ and npm 8+
- Git
- A modern IDE with TypeScript support (VS Code recommended)

### Setup Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd champion-trading-automation
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Run Tests**:
   ```bash
   npm test
   ```

### Understanding the Codebase

1. **Explore the Directory Structure**: Familiarize yourself with the organization
2. **Review Documentation**: Read the README files in each directory
3. **Examine Key Components**: Look at core components like App.tsx and main.tsx
4. **Study the Data Flow**: Understand how data moves through the application

## Best Practices

### Component Design

- **Atomic Design**: Build components from small, focused pieces
- **Single Responsibility**: Each component should do one thing well
- **Prop Typing**: Use TypeScript interfaces for component props
- **Composition**: Favor composition over inheritance
- **Memoization**: Use React.memo and useMemo for performance optimization

### State Management

- **State Colocation**: Keep state as close as possible to where it's used
- **Context Splitting**: Split contexts by domain to prevent unnecessary re-renders
- **Immutability**: Treat state as immutable and create new state objects when updating
- **Selectors**: Use selector patterns to derive state
- **Persistence**: Use appropriate persistence strategies for different types of state

### Testing

- **Component Testing**: Test components in isolation with React Testing Library
- **Hook Testing**: Test custom hooks with renderHook
- **Integration Testing**: Test key user flows
- **Mocking**: Mock external dependencies and services
- **Coverage**: Maintain at least 90% test coverage

### Performance

- **Code Splitting**: Use dynamic imports for route-based code splitting
- **Lazy Loading**: Lazy load components and routes
- **Virtualization**: Use virtualization for long lists
- **Memoization**: Memoize expensive calculations and component renders
- **Bundle Analysis**: Regularly analyze and optimize bundle size

### Accessibility

- **Semantic HTML**: Use appropriate HTML elements
- **ARIA Attributes**: Add ARIA attributes where necessary
- **Keyboard Navigation**: Ensure all functionality is accessible via keyboard
- **Color Contrast**: Maintain sufficient color contrast
- **Screen Reader Support**: Test with screen readers

### Security

- **Authentication**: Implement secure authentication flows
- **Authorization**: Check permissions before rendering sensitive UI or making protected API calls
- **Input Validation**: Validate all user inputs
- **XSS Prevention**: Sanitize data before rendering
- **CSRF Protection**: Implement CSRF tokens for forms

## Further Documentation

Each directory contains its own README.md file with detailed information about its purpose, structure, and usage guidelines. These README files provide in-depth documentation specific to each part of the application:

- **components/README.md**: Detailed component documentation and usage examples
- **contexts/README.md**: Context API implementation and state management patterns
- **hooks/README.md**: Custom hook documentation and usage examples
- **pages/README.md**: Page component structure and routing information
- **services/README.md**: Service implementation details and API documentation
- **stores/README.md**: Store implementation and state management patterns
- **types/README.md**: TypeScript type definitions and usage guidelines

For specific implementation details, refer to the relevant README file or the inline documentation within the code.
