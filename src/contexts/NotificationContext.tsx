import React, { createContext, useContext } from 'react';
import { notification } from 'antd';
import type { NotificationArgsProps } from 'antd';
import './notification.scss';

type NotificationPlacement = NotificationArgsProps['placement'];

export interface NotificationContextType {
  showNotification: (
    message: string,
    description?: string,
    type?: 'success' | 'info' | 'warning' | 'error',
    placement?: NotificationPlacement
  ) => void;
  
  showSimpleNotification: (
    message: string,
    placement?: NotificationPlacement
  ) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  // Standard notification with type and description
  const showNotification = (
    message: string,
    description: string = '',
    type: 'success' | 'info' | 'warning' | 'error' = 'info',
    placement: NotificationPlacement = 'bottom'
  ) => {
    api[type]({
      message,
      description,
      placement,
    });
  };

  // Simple black notification as shown in the design
  const showSimpleNotification = (
    message: string,
    placement: NotificationPlacement = 'bottom'
  ) => {
    // Use the api instance from useNotification for consistency
    api.open({
      message,
      placement,
      className: 'simple-notification',
      duration: 3,
      // No description to keep it clean
      description: '',
    });
  };

  return (
    <NotificationContext.Provider value={{ showNotification, showSimpleNotification }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
