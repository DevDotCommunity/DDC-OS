import { 
  NotificationType, 
  NotificationActionData,
  YoutubeActionData,
  BlogActionData,
  EventActionData,
  PotdActionData,
  PollActionData,
  MeetingActionData
} from '@/contexts/notification-context';

// Type guard functions to check notification types
export function isYoutubeData(type: NotificationType, data: NotificationActionData): data is YoutubeActionData {
  return type === 'youtube';
}

export function isBlogData(type: NotificationType, data: NotificationActionData): data is BlogActionData {
  return type === 'blog';
}

export function isEventData(type: NotificationType, data: NotificationActionData): data is EventActionData {
  return type === 'event';
}

export function isPotdData(type: NotificationType, data: NotificationActionData): data is PotdActionData {
  return type === 'potd';
}

export function isPollData(type: NotificationType, data: NotificationActionData): data is PollActionData {
  return type === 'poll';
}

export function isMeetingData(type: NotificationType, data: NotificationActionData): data is MeetingActionData {
  return type === 'meeting';
}

// Safe access to notification data properties
export function getWidgetTitle(type: NotificationType, data: NotificationActionData): string {
  if (!data) return 'Notification';
  
  switch (type) {
    case 'youtube':
      return isYoutubeData(type, data) ? data.videoTitle : 'YouTube Video';
    case 'blog':
      return isBlogData(type, data) ? data.blogTitle : 'Blog Post';
    case 'event':
      return isEventData(type, data) ? data.eventTitle : 'Event';
    case 'potd':
      return isPotdData(type, data) ? data.problemTitle : 'Problem of the Day';
    case 'poll':
      return isPollData(type, data) ? data.pollTitle : 'Survey';
    case 'meeting':
      return isMeetingData(type, data) ? data.meetingTitle : 'Meeting';
    default:
      return 'Notification';
  }
}

// Utility class to manage notification configuration
export class NotificationConfig {
  private static instance: NotificationConfig;
  private config: Record<string, any> = {};

  private constructor() {
    // Load from environment variables
    this.config = {
        enabled: import.meta.env.VITE_NOTIFICATION_CONFIG_ENABLED === 'true',
        youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
        calendarApiEndpoint: import.meta.env.VITE_CALENDAR_API_ENDPOINT,
        blogApiEndpoint: import.meta.env.VITE_BLOG_API_ENDPOINT,
        potdApiEndpoint: import.meta.env.VITE_POTD_API_ENDPOINT,
        pollApiEndpoint: import.meta.env.VITE_POLL_API_ENDPOINT,
        meetingApiEndpoint: import.meta.env.VITE_MEETING_API_ENDPOINT,
      };
  }

  public static getInstance(): NotificationConfig {
    if (!NotificationConfig.instance) {
      NotificationConfig.instance = new NotificationConfig();
    }
    return NotificationConfig.instance;
  }

  public get(key: string): any {
    return this.config[key];
  }

  public getWidgetType(notificationType: NotificationType): string {
    switch (notificationType) {
      case 'youtube': return 'youtube-player';
      case 'blog': return 'blog-reader';
      case 'event': return 'event-details';
      case 'potd': return 'problem-details';
      case 'poll': return 'poll-form';
      case 'meeting': return 'meeting-details';
      default: return 'notification';
    }
  }
}

export const notificationConfig = NotificationConfig.getInstance();
