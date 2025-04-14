import { useState } from 'react';
import { Notification } from '@/types/notification';
import useNotifications from '@/hooks/use-notifications';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, Play, BookOpen, ListTodo, FormInput, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const { markAsRead, removeNotification } = useNotifications();
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'event':
        return <Calendar size={18} className="text-blue-400" />;
      case 'youtube':
        return <Play size={18} className="text-red-500" />;
      case 'medium':
        return <BookOpen size={18} className="text-green-400" />;
      case 'potd':
        return <ListTodo size={18} className="text-yellow-400" />;
      case 'poll':
        return <FormInput size={18} className="text-purple-400" />;
      case 'meeting':
        return <Video size={18} className="text-cyan-400" />;
      default:
        return null;
    }
  };

  // Handle action click based on action type
  const handleAction = (action: Notification['actions'][0]) => {
    // Mark notification as read
    if (!notification.read) {
      markAsRead(notification.id);
    }

    switch (action.type) {
      case 'calendar':
        // Add to calendar logic
        if (notification.data?.date) {
          const eventDetails = {
            title: notification.title,
            date: notification.data.date,
            description: notification.body
          };
          // Mock adding to calendar - in a real app this would integrate with Google Calendar API
          toast({
            title: "Added to Calendar",
            description: `Event "${notification.title}" added to calendar for ${notification.data.date}`,
          });
          console.log('Added event to calendar:', eventDetails);
        }
        break;

      case 'open':
        // Open preview
        setShowPreview(true);
        break;

      case 'task':
        // Add to tasks
        const task = {
          id: Date.now(),
          text: notification.title,
          completed: false,
          tags: notification.type === 'potd' ? ['POTD'] : []
        };
        // In a real app, this would add to a task list widget
        toast({
          title: "Added to Tasks",
          description: `"${notification.title}" added to your task list`,
        });
        console.log('Added task:', task);
        break;

      case 'link':
        // Open link in new tab
        if (notification.data?.url) {
          window.open(notification.data.url, '_blank');
        }
        break;

      case 'dismiss':
        // Remove notification
        removeNotification(notification.id);
        break;

      default:
        console.log('Unknown action type:', action.type);
    }
  };

  // Render content preview based on notification type
  const renderPreviewContent = () => {
    switch (notification.type) {
      case 'youtube':
        return (
          <div className="w-full aspect-video">
            {notification.data?.videoId ? (
              <iframe
                className="w-full h-full rounded-md"
                src={`https://www.youtube.com/embed/${notification.data.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full bg-black/20 rounded-md">
                Video unavailable
              </div>
            )}
          </div>
        );

      case 'medium':
        return (
          <div className="w-full">
            {notification.data?.url ? (
              <iframe
                className="w-full h-[400px] rounded-md"
                src={notification.data.url}
                title="Medium article"
                frameBorder="0"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-[400px] bg-black/20 rounded-md">
                Article unavailable
              </div>
            )}
          </div>
        );

      case 'poll':
        return (
          <div className="w-full">
            {notification.data?.formUrl ? (
              <iframe
                className="w-full h-[400px] rounded-md"
                src={notification.data.formUrl}
                title="Poll or survey"
                frameBorder="0"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-[400px] bg-black/20 rounded-md">
                Form unavailable
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-4">
            <p>{notification.body}</p>
            {notification.data?.imageUrl && (
              <img 
                src={notification.data.imageUrl} 
                alt={notification.title} 
                className="w-full mt-4 rounded-md"
              />
            )}
          </div>
        );
    }
  };

  return (
    <>
      <div 
        className={`
          p-3 rounded-lg glass-widget
          ${!notification.read ? 'border-l-2 border-l-blue-500' : 'opacity-80'}
        `}
        onClick={() => !notification.read && markAsRead(notification.id)}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-medium">{notification.title}</h4>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1 line-clamp-2">{notification.body}</p>
            
            {notification.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {notification.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(action);
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{notification.title}</DialogTitle>
          </DialogHeader>
          {renderPreviewContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationCard;
