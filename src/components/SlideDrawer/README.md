# SlideDrawer Component

A reusable drawer component that can slide in from any side of the screen (right, left, top, bottom).

## Features

- Customizable header with title and close button
- Flexible content area
- Optional footer for action buttons
- Supports all drawer placements (right, left, top, bottom)
- Responsive design
- Dark mode compatible

## Usage

```tsx
import { SlideDrawer } from '../SlideDrawer';
import { Button } from 'antd';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  const footerContent = (
    <>
      <Button onClick={closeDrawer}>Cancel</Button>
      <Button type="primary" onClick={() => { /* Handle action */ }}>Submit</Button>
    </>
  );

  return (
    <>
      <Button onClick={openDrawer}>Open Drawer</Button>
      
      <SlideDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        title="My Drawer Title"
        placement="right"
        footerContent={footerContent}
      >
        <div>
          {/* Your drawer content here */}
          <p>This is the content of the drawer.</p>
        </div>
      </SlideDrawer>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | - | Controls whether the drawer is visible |
| onClose | function | - | Callback when the drawer is closed |
| title | string | - | Title displayed in the drawer header |
| children | ReactNode | - | Content to be displayed in the drawer body |
| placement | 'right' \| 'left' \| 'bottom' \| 'top' | 'right' | Position from which the drawer slides in |
| width | number \| string | 480 | Width of the drawer (for left/right placement) |
| height | number \| string | '80vh' | Height of the drawer (for top/bottom placement) |
| zIndex | number | 1100 | z-index of the drawer |
| className | string | '' | Additional CSS class for the drawer |
| footerContent | ReactNode | - | Content to be displayed in the footer (optional) |

## Styling

The component uses CSS variables for theming and is compatible with the application's dark mode. You can customize the appearance by overriding the following CSS classes:

- `.slide-drawer`
- `.slide-drawer__header`
- `.slide-drawer__title`
- `.slide-drawer__close`
- `.slide-drawer__body`
- `.slide-drawer__footer`
