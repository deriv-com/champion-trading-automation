# Assets

This directory contains static assets used throughout the Champion Trading Automation application.

## Overview

The assets directory stores various static files such as images, icons, fonts, and other resources that are used in the application's user interface.

## Structure

The assets directory is organized by asset type:

- `favicon.svg`: The application favicon

Additional asset types that might be added in the future:
- `images/`: For image files (PNG, JPG, WebP)
- `icons/`: For icon files (SVG, PNG)
- `fonts/`: For font files
- `animations/`: For animation files (JSON for Lottie, etc.)

## Usage

### Importing Assets

Assets can be imported directly in TypeScript/JavaScript files:

```tsx
// Importing an SVG
import DerivLogo from '../../assets/favicon.svg';

function Header() {
  return (
    <header>
      <img src={DerivLogo} alt="Deriv Logo" />
    </header>
  );
}
```

### Using Assets in SCSS

Assets can also be referenced in SCSS files:

```scss
.header {
  background-image: url('../../assets/images/background.jpg');
  background-size: cover;
}
```

## SVG Assets

SVG assets can be used in two ways:

1. **As image sources**:

```tsx
import DerivLogo from '../../assets/favicon.svg';

function Header() {
  return <img src={DerivLogo} alt="Deriv Logo" />;
}
```

2. **As React components** (requires additional setup with SVGR):

```tsx
import { ReactComponent as DerivLogo } from '../../assets/favicon.svg';

function Header() {
  return <DerivLogo className="logo" aria-label="Deriv Logo" />;
}
```

## Asset Optimization

Assets are optimized during the build process using Vite's built-in asset handling:

- Images are compressed and optimized
- SVGs can be inlined or loaded as separate files
- Assets below a certain size threshold are inlined as data URLs
- Larger assets are hashed and cached

## Best Practices

### Asset Management

1. **File Size**: Keep asset file sizes as small as possible without sacrificing quality.

2. **Format Selection**: Use appropriate formats for different asset types:
   - SVG for icons and simple graphics
   - WebP for photos with transparency
   - PNG for images with transparency
   - JPG for photos without transparency

3. **Resolution**: Provide high-resolution assets for retina displays when necessary.

### Naming Conventions

1. **Consistency**: Use consistent naming conventions for all assets.

2. **Descriptive Names**: Use descriptive names that indicate the asset's purpose.

3. **Kebab Case**: Use kebab-case for file names (e.g., `trading-icon.svg`).

### Organization

1. **Categorization**: Organize assets by type and purpose.

2. **Modularity**: Keep component-specific assets close to their components when appropriate.

3. **Documentation**: Document the purpose and usage of shared assets.

## Adding New Assets

When adding new assets:

1. Optimize the asset for web use (compress images, minify SVGs)
2. Place the asset in the appropriate directory
3. Use a descriptive, kebab-case file name
4. Import and use the asset in your components
5. Consider adding documentation for shared or complex assets

## External Assets

For external assets loaded from CDNs or other sources, consider:

1. **Performance**: Evaluate the performance impact of loading external assets.

2. **Reliability**: Ensure the external source is reliable and available.

3. **Fallbacks**: Provide fallbacks for external assets that may fail to load.

4. **Caching**: Implement appropriate caching strategies for external assets.
