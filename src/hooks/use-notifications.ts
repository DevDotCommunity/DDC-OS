import { useState, useEffect } from 'react';
import { Notification as NotificationInterface, NotificationType } from '@/types/notification';
import { toast } from '@/components/ui/use-toast';
import { nanoid } from 'nanoid';

const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationInterface[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('dashy-notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: NotificationInterface) => !n.read).length);
      } catch (error) {
        console.error('Failed to parse notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('dashy-notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Add a new notification
  const addNotification = (
    type: NotificationType,
    title: string,
    body: string,
    actions: NotificationInterface['actions'] = [],
    data: NotificationInterface['data'] = {}
  ) => {
    const newNotification: NotificationInterface = {
      id: nanoid(),
      type,
      title,
      body,
      timestamp: Date.now(),
      read: false,
      actions,
      data
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast({
      title,
      description: body,
      duration: 5000,
    });

    // If browser notifications are supported and granted, show one
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/notification-icon.png',
        });
      } catch (error) {
        console.error('Error showing browser notification:', error);
      }
    }

    return newNotification.id;
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Remove a notification
  const removeNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('dashy-notifications');
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  };
};

export default useNotifications;
