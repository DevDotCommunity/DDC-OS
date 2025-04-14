import { useState } from 'react';
import { useNotificationContext } from '@/contexts/notification-context';
import { 
  Trash2, 
  Check, 
  Bell, 
  Youtube as YoutubeIcon, 
  FileText, 
  CalendarDays, 
  Code,
  BarChart2,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterWidgetProps {
  onNotificationChange?: () => void;
}

const NotificationCenterWidget: React.FC<NotificationCenterWidgetProps> = ({
  onNotificationChange
}) => {
  const {
    notifications,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    setCurrentNotificationAction
  } = useNotificationContext();
  
  const [filter, setFilter] = useState<string>('all');

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
    if (onNotificationChange) onNotificationChange();
  };

  const handleClearNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    clearNotification(id);
    if (onNotificationChange) onNotificationChange();
  };

  const handleClearAll = () => {
    clearAllNotifications();
    if (onNotificationChange) onNotificationChange();
  };

  const handleNotificationClick = (id: string, notification: any) => {
    if (!notification.read) {
      markAsRead(id);
      if (onNotificationChange) onNotificationChange();
    }

    if (notification.actionData) {
      setCurrentNotificationAction(notification.type, notification.actionData);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <YoutubeIcon size={16} className="text-red-500" />;
      case 'blog':
        return <FileText size={16} className="text-blue-400" />;
      case 'event':
        return <CalendarDays size={16} className="text-purple-400" />;
      case 'potd':
        return <Code size={16} className="text-yellow-400" />;
      case 'poll':
        return <BarChart2 size={16} className="text-orange-400" />;
      case 'meeting':
        return <Video size={16} className="text-cyan-400" />;
      default:
        return <Bell size={16} className="text-gray-400" />;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div className="flex space-x-1 bg-black/20 rounded-md p-0.5">
          <Button 
            variant={filter === 'all' ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setFilter('all')}
            className="h-7 text-xs"
          >
            All
          </Button>
          <Button 
            variant={filter === 'event' ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setFilter('event')}
            className="h-7 text-xs"
          >
            Events
          </Button>
          <Button 
            variant={filter === 'youtube' ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setFilter('youtube')}
            className="h-7 text-xs"
          >
            Videos
          </Button>
        </div>
        
        {notifications.length > 0 && (
          <button 
            className="text-xs text-gray-400 hover:text-white"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Bell className="mb-3 opacity-30" size={32} />
            <p className="mb-5">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-3 rounded-md border relative cursor-pointer',
                  !notification.read
                    ? 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/15'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                )}
                onClick={() => handleNotificationClick(notification.id, notification)}
              >
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notification.type)}
                    <h4 className="font-medium text-white">{notification.title}</h4>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notification.timestamp), {
                      addSuffix: true
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-1 mb-3 ml-6">
                  {notification.message}
                </p>

                {notification.type === 'youtube' && notification.actionData && (
                  <div className="ml-6 mb-3 bg-black/30 rounded overflow-hidden relative">
                    <div className="flex items-center">
                      <img 
                        src={(notification.actionData as any).thumbnailUrl || `https://img.youtube.com/vi/${(notification.actionData as any).videoId}/mqdefault.jpg`} 
                        alt={(notification.actionData as any).videoTitle}
                        className="w-20 h-12 object-cover"
                      />
                      <div className="p-2">
                        <div className="text-xs font-medium text-white">{(notification.actionData as any).videoTitle}</div>
                        <div className="text-xs text-gray-400">{(notification.actionData as any).channelName}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-2">
                  {!notification.read ? (
                    <button
                      className="text-xs flex items-center gap-1 py-1 px-2 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      onClick={(e) => handleMarkAsRead(e, notification.id)}
                    >
                      <Check size={12} /> Read
                    </button>
                  ) : (
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Check size={12} /> Read
                    </div>
                  )}
                  <button
                    className="text-xs flex items-center gap-1 py-1 px-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    onClick={(e) => handleClearNotification(e, notification.id)}
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenterWidget;
