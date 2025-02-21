# Champion Trading Automation

A modern, high-performance trading automation platform built with React, TypeScript, and Ant Design. This platform enables users to create, manage, and execute trading strategies with real-time market data integration.

## 🚀 Features 

### Core Functionality
- **Strategy Management**
  - Create and customize trading strategies
  - Real-time strategy monitoring
  - Performance analytics
  - Risk management tools

### Trading Tools
- **Repeat Trade**: Automated trade repetition with customizable parameters
- **Trade Logs**: Comprehensive trading history and analytics
- **Save Strategies**: Store and manage multiple trading configurations
- **Profile Management**: User preferences and settings

### Technical Features
- Real-time WebSocket data streaming
- Server-Sent Events (SSE) for updates
- OAuth2 authentication
- Responsive design for all devices
- Dark/Light theme support

## 🛠 Technology Stack

### Frontend
- **Core**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Ant Design
- **Styling**: SCSS Modules + CSS Variables
- **State Management**: React Context + Custom Hooks
- **Real-time Data**: WebSocket + SSE Integration

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript (Strict Mode)
- **Version Control**: Git
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
champion-automation/
├── src/
│   ├── assets/              # Static files (images, icons)
│   ├── components/          # Reusable React components
│   │   ├── Header/         # Application header
│   │   ├── Navigation/     # Navigation components
│   │   ├── StrategyList/   # Strategy management
│   │   └── ...
│   ├── config/             # Configuration files
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Page layout components
│   ├── providers/          # Service providers
│   ├── services/           # API and external services
│   │   ├── api/           # REST API services
│   │   ├── oauth/         # Authentication services
│   │   ├── sse/           # Server-Sent Events
│   │   └── websocket/     # WebSocket services
│   ├── styles/            # Global styles and themes
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── public/                # Static public assets
└── tests/                # Test files
```

## 🔧 Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/your-username/champion-automation.git
cd champion-automation
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# API Configuration
VITE_API_URL=https://api.example.com
VITE_API_VERSION=v1

# WebSocket Configuration
VITE_WS_URL=wss://ws.example.com
VITE_WS_RECONNECT_INTERVAL=5000

# Authentication
VITE_AUTH_URL=https://auth.example.com
VITE_CLIENT_ID=your_client_id
VITE_REDIRECT_URI=http://localhost:5173/callback

# Feature Flags
VITE_ENABLE_TRADE_LOGS=true
VITE_ENABLE_SAVE_STRATEGIES=true
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## 💻 Development Guidelines

### Code Style
- Follow TypeScript strict mode guidelines
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments and documentation

### Component Structure
```typescript
// Example component structure
import { FC, useState } from 'react';
import styles from './ComponentName.module.scss';

interface ComponentProps {
  // Props definition
}

export const ComponentName: FC<ComponentProps> = ({ prop }) => {
  // Component implementation
};
```

### Styling Conventions
- Use SCSS modules for component-specific styles
- Follow BEM methodology
- Utilize CSS variables for theming
- Maintain responsive design principles

## 🚀 Deployment

### Production Build
1. Update environment variables for production
2. Build the application:
```bash
npm run build
```
3. Test the production build:
```bash
npm run preview
```

### Deployment Platforms
- Vercel (Recommended)
- Netlify
- AWS S3 + CloudFront
- Docker container

## 🔄 CI/CD

Automated workflows include:
- Code quality checks
- Type checking
- Unit tests
- Build verification
- Automated deployments

## 📝 Documentation

Additional documentation:
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [State Management](./docs/state.md)
- [Testing Guide](./docs/testing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

