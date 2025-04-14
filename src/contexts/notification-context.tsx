import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export type NotificationType =
  | 'standard'
  | 'event'
  | 'youtube'
  | 'blog'
  | 'potd'
  | 'poll'
  | 'meeting';

export interface EventActionData {
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  calendarLink?: string;
}

export interface YoutubeActionData {
  videoId: string;
  videoTitle: string;
  channelName: string;
  thumbnailUrl?: string;
}

export interface BlogActionData {
  blogUrl: string;
  blogTitle: string;
  author: string;
  excerpt: string;
  mediumUrl?: string;
}

export interface PotdActionData {
  problemId: string;
  problemTitle: string;
  problemUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PollActionData {
  pollId: string;
  pollTitle: string;
  formUrl: string;
  expiresAt?: string;
}

export interface MeetingActionData {
  meetingId: string;
  meetingTitle: string;
  startTime: string;
  duration: number;
  meetingUrl?: string;
  platform?: 'zoom' | 'meet' | 'teams' | 'other';
}

export type NotificationActionData =
  | EventActionData
  | YoutubeActionData
  | BlogActionData
  | PotdActionData
  | PollActionData
  | MeetingActionData
  | null;

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: NotificationType;
  actionData?: NotificationActionData;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    title: string,
    message: string,
    type?: NotificationType,
    actionData?: NotificationActionData
  ) => void;
  receiveApiNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => void;
  currentNotificationAction: {
    type: NotificationType | null;
    data: NotificationActionData | null;
  };
  setCurrentNotificationAction: (
    type: NotificationType | null,
    data: NotificationActionData | null
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [currentNotificationAction, setCurrentNotificationActionState] = useState<{
    type: NotificationType | null;
    data: NotificationActionData | null;
  }>({
    type: null,
    data: null
  });

  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('dashy-notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }

    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dashy-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const setCurrentNotificationAction = (type: NotificationType | null, data: NotificationActionData | null) => {
    setCurrentNotificationActionState({ type, data });
  };

  const addNotification = (
    title: string,
    message: string,
    type: NotificationType = 'standard',
    actionData?: NotificationActionData
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: Date.now(),
      read: false,
      type,
      actionData
    };

    setNotifications((prev) => [newNotification, ...prev]);

    if (notificationPermission === 'granted') {
      const sysNotification = new Notification(title, {
        body: message,
      });

      sysNotification.onclick = () => {
        window.focus();
        markAsRead(newNotification.id);
        if (actionData) {
          setCurrentNotificationAction(type, actionData);
        }
      };
    }
  };

  const receiveApiNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false
    };

    setNotifications((prev) => [newNotification, ...prev]);

    if (notificationPermission === 'granted') {
      const sysNotification = new Notification(notification.title, {
        body: notification.message,
      });

      sysNotification.onclick = () => {
        window.focus();
        markAsRead(newNotification.id);
        if (notification.actionData) {
          setCurrentNotificationAction(notification.type, notification.actionData);
        }
      };
    }
  };

  const markAsRead = (id: string) => {
    const notificationToUpdate = notifications.find(n => n.id === id);
    
    if (notificationToUpdate && !notificationToUpdate.read) {
      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    }
  };
  
  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Notifications not supported',
        description: "Your browser doesn't support notifications.",
        variant: 'destructive'
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      toast({
        title: permission === 'granted' ? 'Notifications enabled' : 'Notifications disabled',
        description:
          permission === 'granted'
            ? "You'll now receive desktop notifications."
            : "You won't receive desktop notifications.",
        variant: permission === 'granted' ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request notification permissions.',
        variant: 'destructive'
      });
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        receiveApiNotification,
        markAsRead,
        clearNotification,
        clearAllNotifications,
        notificationPermission,
        requestNotificationPermission,
        currentNotificationAction,
        setCurrentNotificationAction
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
