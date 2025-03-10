import React, { useRef, useCallback, useEffect } from "react";
import { Drawer } from "antd";
import "./styles.scss";

export interface BottomActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number | string;
  zIndex?: number;
  className?: string;
  showClose?: boolean;
  footerContent?: React.ReactNode;
  onDragDown?: () => void;
}

export const BottomActionSheet: React.FC<BottomActionSheetProps> = ({
  isOpen,
  onClose,
  children,
  height = '80vh',
  zIndex = 1200,
  className = "",
  showClose = false,
  footerContent,
  onDragDown,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartY.current = touch.clientY;
    currentY.current = 0;
    isDragging.current = true;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default selection
    document.body.style.userSelect = "none"; // Disable text selection
    dragStartY.current = e.clientY;
    currentY.current = 0;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!sheetRef.current || !isDragging.current) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - dragStartY.current;
      currentY.current = deltaY;

      if (deltaY > 0) {
        e.preventDefault(); // Prevent browser refresh
        sheetRef.current.style.transform = `translateY(${deltaY}px)`;
        onDragDown?.();
      }
    },
    [onDragDown]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!sheetRef.current || !isDragging.current) return;

      requestAnimationFrame(() => {
        const deltaY = e.clientY - dragStartY.current;
        currentY.current = deltaY;

        if (deltaY > 0) {
          e.preventDefault();
          sheetRef.current!.style.transform = `translateY(${deltaY}px)`;
          onDragDown?.();
        }
      });
    },
    [onDragDown]
  );

  const handleDragEnd = useCallback(() => {
    if (!sheetRef.current) return;

    if (isDragging.current) {
      isDragging.current = false;
      document.body.style.userSelect = ""; // Re-enable text selection
      sheetRef.current.style.transform = "";

      if (currentY.current > 100) {
        onClose();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const handleMouseLeave = () => {
        if (isDragging.current) {
          handleDragEnd();
        }
      };

      // Touch events
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleDragEnd);
      // Mouse events
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        // Clean up touch events
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleDragEnd);
        // Clean up mouse events
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("mouseleave", handleMouseLeave);
        // Clean up styles when sheet is closed
        document.body.style.userSelect = "";
      };
    }
  }, [isOpen, handleTouchMove, handleMouseMove, handleDragEnd]);

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      placement="bottom"
      height={height}
      zIndex={zIndex}
      closeIcon={showClose}
      className={`bottom-action-sheet ${className}`}
      footer={footerContent && <div className="bottom-action-sheet-footer">{footerContent}</div>}
    >
      <div className="bottom-action-sheet-handle" 
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
      >
        <div className="bottom-action-sheet-handle-bar" />
      </div>
      <div ref={sheetRef} className="bottom-action-sheet-content">
        {children}
      </div>
    </Drawer>
  );
};
