import { useState, useCallback } from 'react';
import { useNotificationContext } from '@/contexts/notification-context';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { receiveApiNotification } = useNotificationContext();

  const apiUrl = 'https://api.example.com';

  const fetchNotifications = useCallback(async (url = `${apiUrl}/notifications`) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      
      data.forEach((notification: any) => {
        receiveApiNotification({
          title: notification.title,
          message: notification.message,
          type: notification.type || 'standard',
          actionData: notification.actionData || null
        });
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [receiveApiNotification]);

  return {
    loading,
    error,
    fetchNotifications
  };
}
