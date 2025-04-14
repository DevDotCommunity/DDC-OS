import React, { useState, useEffect } from 'react';
import { Video, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface MeetingDetailsWidgetProps {
  data: {
    meetingId: string;
    meetingTitle: string;
    startTime: string;
    duration: number;
    meetingUrl?: string;
    platform?: 'zoom' | 'meet' | 'teams' | 'other';
  };
}

const MeetingDetailsWidget: React.FC<MeetingDetailsWidgetProps> = ({ data }) => {
  const { meetingTitle, startTime, duration, meetingUrl, platform } = data;
  const [countdownTime, setCountdownTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>('');
  
  // Get current status of meeting
  const startTimeObj = new Date(startTime);
  const endTimeObj = new Date(startTimeObj.getTime() + duration * 60 * 1000);
  const now = new Date();
  const isActive = now >= startTimeObj && now <= endTimeObj;
  const isPast = now > endTimeObj;
  const progress = isActive
    ? Math.min(100, ((now.getTime() - startTimeObj.getTime()) / (duration * 60 * 1000)) * 100)
    : 0;
  
  // Update countdown timer
  useEffect(() => {
    if (isPast) return;
    
    const updateCountdown = () => {
      const now = new Date();
      const target = isActive ? endTimeObj : startTimeObj;
      const timeRemaining = target.getTime() - now.getTime();
      
      if (timeRemaining <= 0) {
        setCountdownTime(0);
        return;
      }
      
      setCountdownTime(timeRemaining);
      
      const minutes = Math.floor(timeRemaining / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      setRemainingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [startTimeObj, endTimeObj, isActive, isPast]);
  
  // Platform icons or names
  const getPlatformLabel = () => {
    switch (platform) {
      case 'zoom': return 'Zoom Meeting';
      case 'meet': return 'Google Meet';
      case 'teams': return 'Microsoft Teams';
      default: return 'Online Meeting';
    }
  };
  
  return (
    <div className="h-full flex flex-col p-3">
      <h3 className="font-medium text-white text-lg flex items-center mb-4">
        <Video className="mr-2 h-5 w-5 text-blue-500" />
        {meetingTitle}
      </h3>
      
      <div className="space-y-4 flex-grow">
        <div className="flex items-center justify-between text-sm text-gray-300">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-400" />
            <span>
              {startTimeObj.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - 
              {endTimeObj.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
            </span>
          </div>
          <div>
            <span>Duration: {duration} min</span>
          </div>
        </div>
        
        {!isPast && (
          <div className="p-4 bg-white/5 rounded-md">
            {isActive ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">In progress</span>
                  <span className="text-gray-300">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-sm text-gray-400 text-center mt-1">
                  Ends in {remainingTime}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">{remainingTime}</div>
                <div className="text-sm text-gray-400">until meeting starts</div>
              </div>
            )}
          </div>
        )}
        
        {isPast && (
          <div className="p-4 bg-white/5 rounded-md text-center text-gray-400">
            This meeting has ended
          </div>
        )}
        
        {platform && (
          <div className="text-sm text-gray-300 flex items-center mt-2">
            <span className="text-gray-400">{getPlatformLabel()}</span>
          </div>
        )}
      </div>
      
      {!isPast && meetingUrl && (
        <Button 
          className={isActive ? "bg-green-600 hover:bg-green-700 mt-4" : "bg-blue-600 hover:bg-blue-700 mt-4"}
          onClick={() => window.open(meetingUrl, '_blank')}
        >
          {isActive ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Join Now
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Open Meeting Link
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default MeetingDetailsWidget;
