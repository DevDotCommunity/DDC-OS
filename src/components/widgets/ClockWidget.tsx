
import { useEffect, useState } from 'react';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM:SS
  const formattedTime = time.toLocaleTimeString();
  
  // Format date as Day, Month Date, Year
  const formattedDate = time.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get hours in 12-hour format for the analog clock
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  // Calculate angles for clock hands
  const hourDegrees = (hours * 30) + (minutes * 0.5);  // 30 degrees per hour
  const minuteDegrees = minutes * 6;  // 6 degrees per minute
  const secondDegrees = seconds * 6;  // 6 degrees per second
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 rounded-full border border-white/20 mb-4">
        {/* Clock face */}
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-2 bg-white/50" 
              style={{ 
                transform: `rotate(${i * 30}deg) translateY(-18px)`,
                transformOrigin: 'bottom center',
                top: '50%',
                left: 'calc(50% - 0.5px)'
              }}
            />
          ))}
          
          {/* Hour hand */}
          <div 
            className="absolute w-1 h-12 bg-white/90 rounded-full"
            style={{ 
              transform: `rotate(${hourDegrees}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: 'calc(50% - 0.5px)'
            }}
          />
          
          {/* Minute hand */}
          <div 
            className="absolute w-0.5 h-16 bg-white/80 rounded-full"
            style={{ 
              transform: `rotate(${minuteDegrees}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: 'calc(50% - 0.25px)'
            }}
          />
          
          {/* Second hand */}
          <div 
            className="absolute w-0.5 h-16 bg-red-500 rounded-full"
            style={{ 
              transform: `rotate(${secondDegrees}deg)`,
              transformOrigin: 'bottom center',
              bottom: '50%',
              left: 'calc(50% - 0.25px)'
            }}
          />
          
          {/* Center dot */}
          <div className="absolute w-3 h-3 bg-white rounded-full" />
        </div>
      </div>
      
      <div className="text-xl font-bold text-white mb-1">{formattedTime}</div>
      <div className="text-sm text-gray-300">{formattedDate}</div>
    </div>
  );
};

export default ClockWidget;
