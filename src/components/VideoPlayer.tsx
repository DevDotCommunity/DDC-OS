import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  channelName: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  title, 
  channelName,
  onClose 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="glass-widget w-full max-w-3xl rounded-lg overflow-hidden animate-fade-in"
      >
        <div className="widget-header flex justify-between items-center">
          <div className="font-medium text-white">{title}</div>
          <button 
            className="text-white/70 hover:text-white"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="aspect-video bg-black">
          <iframe 
            width="100%" 
            height="100%" 
            src={videoUrl} 
            title={title}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
        <div className="p-4 text-white">
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-300">{channelName}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
