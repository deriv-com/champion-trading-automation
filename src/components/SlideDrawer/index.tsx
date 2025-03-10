import React from "react";
import { Drawer, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./styles.scss";

export interface SlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  placement?: "right" | "left" | "bottom" | "top";
  width?: number | string;
  height?: number | string;
  zIndex?: number;
  className?: string;
  footerContent?: React.ReactNode;
}

export const SlideDrawer: React.FC<SlideDrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  placement = "right",
  width = 480,
  height = "80vh",
  zIndex = 1100,
  className = "",
  footerContent,
}) => {
  const isVertical = placement === "top" || placement === "bottom";
  const sizeProps = isVertical ? { height } : { width };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      placement={placement}
      closable={false}
      zIndex={zIndex}
      className={`slide-drawer ${
        isVertical ? "slide-drawer--vertical" : ""
      } ${className}`}
      {...sizeProps}
    >
      <div className="slide-drawer__header">
        {title && <h3 className="slide-drawer__title">{title}</h3>}
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          className="slide-drawer__close"
          aria-label="Close drawer"
        />
      </div>
      <div className="slide-drawer__body">{children}</div>
      {footerContent && (
        <div className="slide-drawer__footer">{footerContent}</div>
      )}
    </Drawer>
  );
};
