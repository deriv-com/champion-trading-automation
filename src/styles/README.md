# Styles

This directory contains global styles and theming for the Champion Trading Automation application.

## Overview

The application uses SCSS (Sass) for styling, with a combination of global styles and component-specific styles. Global styles provide consistent theming, typography, and layout rules, while component-specific styles are encapsulated within their respective component directories.

## Structure

The styles directory contains:

- `index.scss`: Main entry point for global styles
- `global.scss`: Global styles applied to the entire application
- `App.scss`: Styles specific to the App component
- `variables.scss`: SCSS variables for colors, spacing, typography, etc.
- `themes.scss`: Theme definitions for light and dark modes

## Styling Approach

### SCSS Modules

Component-specific styles use SCSS modules to encapsulate styles and prevent leakage:

```scss
// Component/styles.scss
.component {
  display: flex;
  
  &__header {
    font-weight: bold;
  }
  
  &__content {
    padding: 1rem;
  }
}
```

```tsx
// Component/index.tsx
import './styles.scss';

export function Component() {
  return (
    <div className="component">
      <div className="component__header">Header</div>
      <div className="component__content">Content</div>
    </div>
  );
}
```

### BEM Methodology

The application follows the Block Element Modifier (BEM) methodology for class naming:

- **Block**: The component or standalone entity (e.g., `.button`, `.header`)
- **Element**: A part of the block (e.g., `.button__icon`, `.header__title`)
- **Modifier**: A variant or state of the block or element (e.g., `.button--primary`, `.header__title--large`)

Example:
```scss
.strategy-card {
  // Block styles
  
  &__title {
    // Element styles
  }
  
  &__description {
    // Element styles
  }
  
  &--featured {
    // Modifier styles
  }
}
```

## Global Styles

### Variables

The `variables.scss` file defines global variables for consistent styling:

```scss
// Colors
$primary-color: #007bff;
$secondary-color: #6c757d;
$success-color: #28a745;
$danger-color: #dc3545;
$warning-color: #ffc107;
$info-color: #17a2b8;

// Typography
$font-family-base: 'Roboto', sans-serif;
$font-size-base: 1rem;
$font-weight-normal: 400;
$font-weight-bold: 700;

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// Breakpoints
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

### Themes

The `themes.scss` file defines theme variables for light and dark modes:

```scss
:root {
  // Light theme (default)
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --border-color: #dee2e6;
}

[data-theme="dark"] {
  // Dark theme
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: #f8f9fa;
  --text-secondary: #adb5bd;
  --border-color: #343a40;
}
```

## Integration with Ant Design

The application uses Ant Design as its UI component library. Custom styles are applied to Ant Design components to match the application's design system:

```scss
// Customizing Ant Design components
.ant-btn {
  border-radius: 4px;
  
  &-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }
}

.ant-input {
  border-radius: 4px;
}
```

## Responsive Design

The application implements responsive design using media queries:

```scss
.container {
  padding: $spacing-md;
  
  @media (min-width: $breakpoint-md) {
    padding: $spacing-lg;
  }
  
  @media (min-width: $breakpoint-lg) {
    padding: $spacing-xl;
  }
}
```

## Mixins and Functions

Common style patterns are encapsulated in SCSS mixins and functions:

```scss
// Flexbox mixin
@mixin flex($direction: row, $justify: flex-start, $align: stretch) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

// Usage
.card {
  @include flex(column, space-between, center);
}
```

## Best Practices

### Style Organization

1. **Global vs. Component Styles**: Keep global styles minimal and focused on application-wide concerns. Component-specific styles should be in the component's directory.

2. **Variable Usage**: Use SCSS variables for consistent styling and easy theme changes.

3. **Nesting**: Limit nesting to 3 levels to maintain readability and performance.

### Performance

1. **Specificity**: Keep selector specificity low to avoid specificity wars.

2. **Reusability**: Create reusable style patterns with mixins and functions.

3. **Critical CSS**: Consider extracting critical CSS for improved loading performance.

### Maintainability

1. **Comments**: Document complex styles and the purpose of variables and mixins.

2. **Consistent Naming**: Follow BEM naming conventions consistently.

3. **File Organization**: Keep related styles together and split large files into logical parts.

## Theme Switching

The application supports theme switching through the `ThemeContext`:

```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## Testing

Styles are tested as part of component tests:

1. **Visual Regression Testing**: Use tools like Storybook and visual regression testing to catch unintended style changes.

2. **Theme Testing**: Test components in both light and dark themes.

3. **Responsive Testing**: Test components at different viewport sizes.
