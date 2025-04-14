import React, { useEffect } from 'react';
import { useNotificationContext } from '@/contexts/notification-context';
import { getWidgetTitle, notificationConfig } from '@/lib/notification-utils';

type NotificationActionHandlerProps = {
  onCreateWidget: (type: string, title: string, data: any) => void;
};

export const NotificationActionHandler: React.FC<NotificationActionHandlerProps> = ({ 
  onCreateWidget
}) => {
  const { currentNotificationAction, setCurrentNotificationAction } = useNotificationContext();
  
  // When a notification action is triggered, create a widget instead of showing a modal
  useEffect(() => {
    if (!currentNotificationAction.type || !currentNotificationAction.data) return;
    
    const { type, data } = currentNotificationAction;
    
    // Get widget type from config, title from utility function
    const widgetType = notificationConfig.getWidgetType(type);
    const widgetTitle = getWidgetTitle(type, data);
    
    // Create widget with the proper type and title
    onCreateWidget(widgetType, widgetTitle, data);
    
    // Clear the current notification action after creating the widget
    setCurrentNotificationAction(null, null);
  }, [currentNotificationAction, onCreateWidget, setCurrentNotificationAction]);
  
  // This component doesn't render anything - it just coordinates
  return null;
};
