# Components

This directory contains all the reusable UI components used throughout the Champion Trading Automation application.

## Structure

Components are organized following atomic design principles, with each component encapsulated in its own directory containing:

- `index.tsx`: The component implementation
- `styles.scss`: Component-specific styles using SCSS modules
- `README.md` (optional): Component-specific documentation
- `components/` (optional): Sub-components specific to this component

## Usage Guidelines

### Component Structure

Each component follows these principles:

1. **Atomic and Independent Design**:
   - Components encapsulate their own markup, styles, and state
   - Local state is preferred for single-use logic
   - Props are used for configuration and data passing

2. **TypeScript Interfaces**:
   - All props are defined using TypeScript interfaces
   - Proper typing ensures compile-time safety

3. **Error Handling**:
   - Components should handle potential errors gracefully
   - Use error boundaries where appropriate

### Styling

- SCSS Modules are used for component styling
- BEM methodology is followed for class naming
- Styles are scoped to the component to prevent leakage

## Available Components

### UI Framework Components

- **AccountHeader**: Displays account information and related actions. Shows account type, balance, and currency information.

- **Header**: Application header with authentication and account controls. Renders different content based on authentication state, including login buttons and account information.

- **InputField**: Reusable form input components with built-in validation and error handling. Wraps Ant Design form controls with additional functionality.

- **Navigation**: Main application navigation bar. Provides tab-based navigation between main sections of the application.

- **PageTitle**: Standardized page title component that maintains consistent heading styles across the application.

- **Sidebar**: Side navigation and additional controls. Provides secondary navigation options and contextual actions.

### Layout Components

- **BottomActionSheet**: Mobile-friendly action sheet that slides from the bottom of the screen. Features include:
  - Customizable height and z-index
  - Draggable handle with visual feedback
  - Swipe down to dismiss functionality
  - Optional footer with action buttons
  - Touch and mouse event support

- **SlideDrawer**: Versatile drawer component that can slide in from any side of the screen. Features include:
  - Support for all placements (right, left, top, bottom)
  - Customizable header with title and close button
  - Optional footer for action buttons
  - Responsive design and dark mode compatibility

### Trading Components

- **Bots**: Bot management interface components. Contains:
  - **BotCard**: Card component displaying a trading bot with its details, parameters, and action buttons (run, edit, delete).

- **MarketSelector**: Interface for selecting trading markets. Includes:
  - Market filtering capabilities
  - Visual market icons for different trading instruments
  - Support for various market types

- **Positions**: Components for displaying and managing trading positions. Contains:
  - **TradeCard**: Card component for individual trade positions
  - **TradeFilters**: Filtering controls for trade positions
  - **TradeGrid**: Grid layout for displaying multiple trade positions

- **StrategyCard**: Display card for trading strategies. Shows strategy title, description, and provides navigation to strategy details.

- **StrategyDrawer**: Drawer component for displaying and editing strategy details.

- **StrategyFilters**: Filtering components for strategies based on various criteria.

- **StrategyForm**: Form components for creating and editing trading strategies.

- **StrategyList**: Components for displaying lists of available trading strategies.

- **StrategyUpdates**: Components for displaying strategy update information and notifications.

### Utility Components

- **ConfigEndpoint**: Configuration interface for API endpoints. Allows users to configure connection settings.

- **ErrorBoundary**: Error handling components for graceful failure. Catches and displays errors without crashing the application.

## Dependencies

- **Ant Design**: Primary UI component library
- **React**: Component framework
- **SCSS**: For component styling
- **TypeScript**: For type safety

## Testing

Components are tested using Jest and React Testing Library following the Test-Driven Development (TDD) approach:

1. Write failing tests first
2. Implement minimal code to pass tests
3. Refactor to ensure adherence to SOLID principles

## Best Practices

- Keep components focused on a single responsibility
- Avoid unnecessary dependencies on parent components
- Use React Context for shared/global state instead of prop drilling
- Document complex components with JSDoc comments
- Maintain at least 90% test coverage
