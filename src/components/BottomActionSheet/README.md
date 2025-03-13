# Bottom Action Sheet Component

A reusable bottom action sheet component built with Ant Design's Drawer component. This component provides a mobile-friendly interface for displaying content that slides up from the bottom of the screen, with drag-to-dismiss functionality.

## Features

- Customizable height and z-index
- Optional footer with action buttons
- Rounded corners at the top
- Draggable handle with visual feedback for intuitive user interaction
- Swipe down to dismiss
- Fully customizable content

## Usage

```tsx
import { BottomActionSheet } from '../BottomActionSheet';
import { useState } from 'react';
import { Button } from 'antd';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  // Optional callback when user starts dragging down
  const handleDragDown = () => {
    console.log('User is dragging down');
  };

  // Optional footer content
  const footerContent = (
    <>
      <Button onClick={handleClose}>Cancel</Button>
      <Button type="primary" onClick={handleClose}>Confirm</Button>
    </>
  );

  return (
    <>
      <Button onClick={handleOpen}>Open Action Sheet</Button>
      
      <BottomActionSheet
        isOpen={isOpen}
        onClose={handleClose}
        onDragDown={handleDragDown}
        height={300}
        footerContent={footerContent}
      >
        {/* Your content here */}
        <div>
          <p>This is the content of the bottom action sheet.</p>
          <p>You can put any React components here.</p>
          <p>Try dragging down from the handle to dismiss!</p>
        </div>
      </BottomActionSheet>
    </>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isOpen | boolean | required | Controls the visibility of the action sheet |
| onClose | () => void | required | Callback function when the action sheet is closed |
| children | React.ReactNode | required | Content to be displayed in the action sheet |
| height | number \| string | 300 | Height of the action sheet |
| zIndex | number | 1050 | z-index of the action sheet |
| className | string | "" | Additional CSS class for the action sheet |
| showClose | boolean | false | Whether to show the close icon |
| footerContent | React.ReactNode | undefined | Content to be displayed in the footer |
| onDragDown | () => void | undefined | Callback function when the user starts dragging down |

## Drag Behavior

The component includes touch and mouse event handlers to provide a native-feeling drag experience:

- Users can drag the sheet down by touching/clicking the handle at the top
- If dragged down more than 100px, the sheet will automatically close
- The sheet smoothly animates back to position if not dragged far enough
- Works with both touch devices and mouse interactions
- Visual feedback when the handle is pressed (changes color and slightly scales up)
