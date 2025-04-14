import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventDetailsWidgetProps {
  data: {
    eventTitle: string;
    eventDate: string;
    eventLocation?: string;
    calendarLink?: string;
  };
}

const EventDetailsWidget: React.FC<EventDetailsWidgetProps> = ({ data }) => {
  const { eventTitle, eventDate, eventLocation, calendarLink } = data;
  const eventDateObj = new Date(eventDate);
  
  const addToCalendar = () => {
    const start = new Date(eventDate);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour event
    const format = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${format(start)}/${format(end)}&details=Event%20from%20Dashy&location=${encodeURIComponent(
      eventLocation || ''
    )}`;
    
    window.open(calendarUrl, '_blank');
  };
  
  return (
    <div className="h-full flex flex-col p-3">
      <h3 className="font-medium text-white text-lg mb-4 flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-blue-500" />
        {eventTitle}
      </h3>
      
      <div className="space-y-3 flex-grow">
        <div className="flex items-center text-sm text-gray-300">
          <Clock className="mr-2 h-4 w-4 text-gray-400" />
          <span>{eventDateObj.toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        
        {eventLocation && (
          <div className="flex items-center text-sm text-gray-300">
            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
            <span>{eventLocation}</span>
          </div>
        )}
      </div>
      
      {calendarLink && (
        <div className="mt-4">
          <Button 
            onClick={addToCalendar}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Add to Calendar
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventDetailsWidget;
