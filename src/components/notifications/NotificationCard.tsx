import { Notification, NotificationType } from '@/contexts/notification-context';
import { Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClear: (id: string) => void;
  onClick: (id: string, type: NotificationType, actionData: any) => void;
  icon: React.ReactNode;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onClear,
  onClick,
  icon
}) => {
  const formattedTime = formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true });
  
  const handleClick = () => {
    onClick(notification.id, notification.type, notification.actionData);
  };
  
  return (
    <div 
      className={cn(
        "p-3 rounded-md border relative cursor-pointer",
        !notification.read 
          ? "border-blue-500/50 bg-blue-500/10" 
          : "bg-white/5 border-white/10"
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-medium text-white">{notification.title}</h4>
        </div>
        <span className="text-xs text-gray-400">{formattedTime}</span>
      </div>
      <p className="text-sm text-gray-300 mt-1 mb-3 ml-6">{notification.message}</p>
      
      {/* Preview content based on notification type */}
      {notification.type === 'youtube' && notification.actionData && (
        <div className="ml-6 mt-2 mb-2 bg-black/30 rounded overflow-hidden relative group">
          <div className="flex items-center">
            <img 
              src={(notification.actionData as any).thumbnailUrl} 
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
      
      {/* Action buttons */}
      <div className="flex justify-end gap-2 mt-2">
        {!notification.read ? (
          <button 
            className="text-xs flex items-center gap-1 py-1 px-2 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
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
          onClick={(e) => {
            e.stopPropagation();
            onClear(notification.id);
          }}
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
};
