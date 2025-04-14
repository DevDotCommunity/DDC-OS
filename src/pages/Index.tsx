import { useState, useEffect } from 'react';
import Widget from '@/components/Widget';
import Dock from '@/components/Dock';
import WallpaperSelector from '@/components/WallpaperSelector';
import WaveBackground from '@/components/WaveBackground';
import ClockWidget from '@/components/widgets/ClockWidget';
import NotesWidget from '@/components/widgets/NotesWidget';
import WeatherWidget from '@/components/widgets/WeatherWidget';
import CalculatorWidget from '@/components/widgets/CalculatorWidget';
import TodoWidget from '@/components/widgets/TodoWidget';
import QuoteWidget from '@/components/widgets/QuoteWidget';
import NotificationCenterWidget from '@/components/widgets/NotificationCenterWidget';
import { Bell, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useNotificationContext } from '@/contexts/notification-context';
import { NotificationActionHandler } from '@/components/notifications/NotificationActionHandler';
import YoutubePlayerWidget from '@/components/widgets/YoutubePlayerWidget';
import BlogReaderWidget from '@/components/widgets/BlogReaderWidget';
import EventDetailsWidget from '@/components/widgets/EventDetailsWidget';
import ProblemDetailsWidget from '@/components/widgets/ProblemDetailsWidget';
import PollFormWidget from '@/components/widgets/PollFormWidget';
import MeetingDetailsWidget from '@/components/widgets/MeetingDetailsWidget';

const DEFAULT_WALLPAPERS = [
  'https://images.unsplash.com/photo-1662026911591-335639b11db6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY2MzY5MTI4MQ&ixlib=rb-1.2.1&q=80&w=1920',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1659472372772-fd67793cda22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
];

interface WidgetItem {
  id: string;
  type: string;
  position: { x: number; y: number };
  props?: any; // Add optional props for widget data
}

const Index = () => {
  const [widgets, setWidgets] = useState<WidgetItem[]>([]);
  const [wallpapers, setWallpapers] = useState<string[]>([]);
  const [wallpaper, setWallpaper] = useState('');
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [notificationPosition, setNotificationPosition] = useState({ 
    x: window.innerWidth - 380 - 10, // Match the weather panel X position but 10px more to the left
    y: 320 // Position 20px below the approximate bottom of the weather widget (100px position + ~200px height + 20px gap)
  });
  const { unreadCount, notificationPermission, requestNotificationPermission } = useNotificationContext();
  
  // Load saved widgets and wallpapers on mount
  useEffect(() => {
    // Load saved wallpapers first
    const savedWallpapers = localStorage.getItem('dashy-wallpapers');
    if (savedWallpapers) {
      setWallpapers(JSON.parse(savedWallpapers));
    } else {
      setWallpapers(DEFAULT_WALLPAPERS);
      localStorage.setItem('dashy-wallpapers', JSON.stringify(DEFAULT_WALLPAPERS));
    }
    
    // Then load current wallpaper
    const savedWallpaper = localStorage.getItem('dashy-wallpaper');
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    } else if (DEFAULT_WALLPAPERS.length > 0) {
      setWallpaper(DEFAULT_WALLPAPERS[0]);
    }
    
    // Load saved widgets
    const savedWidgets = localStorage.getItem('dashy-widgets');
    if (savedWidgets) {
      const parsedWidgets = JSON.parse(savedWidgets);
      setWidgets(parsedWidgets);
      
      // Set nextId based on highest existing id
      const highestId = parsedWidgets.reduce(
        (max: number, widget: WidgetItem) => {
          const id = parseInt(widget.id.split('-')[1], 10);
          return id > max ? id : max;
        },
        0
      );
      setNextId(highestId + 1);
    } else {
      // Add default widgets if none exist
      const defaultWidgets = [
        {
          id: 'widget-1',
          type: 'clock',
          position: { x: 100, y: 100 }
        },
        {
          id: 'widget-2',
          type: 'weather',
          position: { x: window.innerWidth - 400, y: 100 }
        },
        {
          id: 'widget-3',
          type: 'quote',
          position: { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 50 }
        }
      ];
      
      // Set notification panel position based on weather widget
      const weatherWidget = defaultWidgets.find(w => w.type === 'weather');
      if (weatherWidget) {
        setNotificationPosition({
          x: weatherWidget.position.x,
          y: Math.max(300, window.innerHeight - 550)
        });
      }
      
      setWidgets(defaultWidgets);
      localStorage.setItem('dashy-widgets', JSON.stringify(defaultWidgets));
    }
  }, []);
  
  // Save widgets to localStorage when they change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashy-widgets', JSON.stringify(widgets));
    }
  }, [widgets]);

  // Filter out any existing notification widgets on load
  useEffect(() => {
    if (widgets.some(widget => widget.type === 'notification')) {
      setWidgets(widgets.filter(widget => widget.type !== 'notification'));
    }
  }, []);

  // Set notification panel position based on weather widget
  useEffect(() => {
    const weatherWidget = widgets.find(w => w.type === 'weather');
    if (weatherWidget) {
      // Position the notification panel 50px below the bottom of the weather widget
      // and with 20px more gap from the right side
      setNotificationPosition({
        x: weatherWidget.position.x - 8, // Subtract 20px to create more gap from the right
        y: weatherWidget.position.y + 200 + 50 // weather position + weather height (200px) + 50px gap
      });
    }
  }, [widgets]);
  
  // Toggle notification panel
  const toggleNotificationPanel = () => {
    // Only show toast when opening the panel, not when closing it
    if (!showNotificationPanel) {
      toast({
        description: "Opened notification panel",
        duration: 1000
      });
    }
    setShowNotificationPanel(!showNotificationPanel);
  };
  
  // Handle adding a new widget
  const handleAddWidget = (type: string) => {
    // Don't add notification widget - it's shown as a fixed panel
    if (type === 'notification') {
      toggleNotificationPanel();
      return;
    }
    
    // Generate random position that doesn't overlap with existing widgets
    const padding = 20;
    const width = 300;
    const height = 200;
    
    let x = Math.random() * (window.innerWidth - width - padding * 2) + padding;
    let y = Math.random() * (window.innerHeight - height - padding * 2) + padding;
    
    const id = `widget-${nextId}`;
    
    const newWidget: WidgetItem = {
      id,
      type,
      position: { x, y }
    };
    
    setWidgets([...widgets, newWidget]);
    setNextId(nextId + 1);
    
    toast({
      description: `Added ${type} widget`,
      duration: 2000
    });
  };
  
  // Handle closing a widget
  const handleCloseWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };
  
  // Handle closing the notification panel
  const handleCloseNotifications = () => {
    setShowNotificationPanel(false);
  };

  // Handle selecting a wallpaper
  const handleSelectWallpaper = (newWallpaper: string) => {
    setWallpaper(newWallpaper);
    localStorage.setItem('dashy-wallpaper', newWallpaper);
    setShowWallpaperSelector(false);
  };
  
  // Handle adding a custom wallpaper
  const handleAddWallpaper = (newWallpaper: string) => {
    const updatedWallpapers = [...wallpapers, newWallpaper];
    setWallpapers(updatedWallpapers);
    localStorage.setItem('dashy-wallpapers', JSON.stringify(updatedWallpapers));
  };
  
  // Toggle wallpaper selector
  const toggleWallpaperSelector = () => {
    setShowWallpaperSelector(!showWallpaperSelector);
  };
  
  // Handle creating widgets from notification actions
  const handleNotificationAction = (type: string, title: string, data: any) => {
    // Generate a position offset to prevent stacking
    const offsetX = Math.random() * 100;
    const offsetY = Math.random() * 100;
    
    // Focus management - reduce z-index of existing widgets
    document.querySelectorAll('.widget').forEach((el) => {
      (el as HTMLElement).style.zIndex = '1';
    });
    
    // Add a new widget to the widgets state
    const newWidget = {
      id: `widget-${nextId}`,
      type,
      position: { 
        x: Math.max(50, Math.min(window.innerWidth - 400, window.innerWidth / 2 - 200 + offsetX)), 
        y: Math.max(50, Math.min(window.innerHeight - 400, window.innerHeight / 2 - 150 + offsetY))
      },
      props: data // Add the data as props to the widget
    };
    
    setWidgets([...widgets, newWidget]);
    setNextId(nextId + 1);
    
    // Set timeout to ensure the new widget is rendered before we try to focus it
    setTimeout(() => {
      const newWidgetElement = document.getElementById(`widget-${nextId - 1}`);
      if (newWidgetElement) {
        newWidgetElement.style.zIndex = '10';
      }
    }, 100);
  };
  
  // Render the appropriate widget content based on type
  const renderWidgetContent = (type: string, widgetProps: any) => {
    switch (type) {
      case 'clock':
        return <ClockWidget />;
      case 'notes':
        return <NotesWidget />;
      case 'weather':
        return <WeatherWidget />;
      case 'calculator':
        return <CalculatorWidget />;
      case 'todo':
        return <TodoWidget />;
      case 'quote':
        return <QuoteWidget />;
      case 'notification':
        return <NotificationCenterWidget />;
      case 'youtube-player':
        return <YoutubePlayerWidget data={widgetProps} />;
      case 'blog-reader':
        return <BlogReaderWidget data={widgetProps} />;
      case 'event-details':
        return <EventDetailsWidget data={widgetProps} />;
      case 'problem-details':
        return <ProblemDetailsWidget data={widgetProps} />;
      case 'poll-form':
        return <PollFormWidget data={widgetProps} />;
      case 'meeting-details':
        return <MeetingDetailsWidget data={widgetProps} />;
      default:
        return <div className="text-white">Unknown widget type</div>;
    }
  };
  
  // Get widget title based on type
  const getWidgetTitle = (type: string, widgetProps: any) => {
    switch (type) {
      case 'clock':
        return 'Clock';
      case 'notes':
        return 'Quick Notes';
      case 'weather':
        return 'Weather';
      case 'calculator':
        return 'Calculator';
      case 'todo':
        return 'To-Do List';
      case 'quote':
        return 'Quote';
      case 'notification':
        return 'Notifications';
      case 'youtube-player':
        return widgetProps?.videoTitle || 'YouTube Video';
      case 'blog-reader':
        return widgetProps?.blogTitle || 'Blog';
      case 'event-details':
        return widgetProps?.eventTitle || 'Event';
      case 'problem-details':
        return 'Problem of the Day';
      case 'poll-form':
        return widgetProps?.pollTitle || 'Survey';
      case 'meeting-details':
        return widgetProps?.meetingTitle || 'Meeting';
      default:
        return 'Widget';
    }
  };
  
  // Get widget width based on type
  const getWidgetWidth = (type: string) => {
    const widths: Record<string, number> = {
      calculator: 260,
      clock: 280,
      quote: 320,
      notes: 300,
      weather: 300,
      todo: 300,
      notification: 350,
      'youtube-player': 480,
      'poll-form': 600,
      'blog-reader': 500,
      'problem-details': 400, // Increase width for POTD widget to prevent button overflow
      'event-details': 350,
      'meeting-details': 350
    };
    
    return widths[type] || 300;
  };
  
  // Get widget class based on type
  const getWidgetClass = (type: string) => {
    const classMap: Record<string, string> = {
      notification: 'notification-widget',
      'youtube-player': 'youtube-widget',
      'poll-form': 'poll-widget',
      'blog-reader': 'blog-reader-widget',
      'event-details': 'event-details-widget',
      'problem-details': 'problem-details-widget',
      'meeting-details': 'meeting-details-widget'
    };
    
    return classMap[type] || '';
  };
  
  // Check if we should hide window controls
  const shouldHideControls = (type: string) => {
    return ['clock', 'weather', 'quote'].includes(type);
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        {wallpaper ? (
          <img
            src={wallpaper}
            alt="Wallpaper"
            className="w-full h-full object-cover"
          />
        ) : (
          <WaveBackground />
        )}
      </div>
      
      {/* Notification action handler */}
      <NotificationActionHandler onCreateWidget={handleNotificationAction} />
      
      {/* Widgets */}
      {widgets.map(widget => (
        <Widget
          key={widget.id}
          id={widget.id}
          type={widget.type}
          title={getWidgetTitle(widget.type, widget.props)}
          initialPosition={widget.position}
          onClose={handleCloseWidget}
          width={getWidgetWidth(widget.type)}
          hideControls={shouldHideControls(widget.type)}
          className={getWidgetClass(widget.type)}
        >
          {renderWidgetContent(widget.type, widget.props)}
        </Widget>
      ))}
      
      {/* Notification Panel as Widget */}
      {showNotificationPanel && (
        <Widget
          id="notification-panel"
          type="notification"
          title="Notifications"
          initialPosition={notificationPosition}
          onClose={handleCloseNotifications}
          width={320}
          className="notification-widget"
        >
          <NotificationCenterWidget onNotificationChange={() => {
            // Force a re-render to update unread counts everywhere
            setNextId(prev => prev);
          }} />
        </Widget>
      )}
      
      {/* Dock */}
      <Dock
        onAddWidget={handleAddWidget}
        onToggleWallpaper={toggleWallpaperSelector}
        onToggleNotifications={toggleNotificationPanel}
      />
      
      {/* Wallpaper selector */}
      <WallpaperSelector
        isVisible={showWallpaperSelector}
        wallpapers={wallpapers}
        onSelect={handleSelectWallpaper}
        onAddWallpaper={handleAddWallpaper}
      />
    </div>
  );
};

export default Index;
