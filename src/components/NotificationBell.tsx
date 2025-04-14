import { Bell } from 'lucide-react';
import { useNotificationContext } from '@/contexts/notification-context';

interface NotificationBellProps {
  onClick?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  const { unreadCount } = useNotificationContext();
  
  return (
    <button 
      className="relative p-1 rounded-full hover:bg-white/10 transition-colors"
      onClick={onClick}
    >
      <Bell className="text-white" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
