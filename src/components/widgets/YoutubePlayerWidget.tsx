import React from 'react';

interface YoutubePlayerWidgetProps {
  data: {
    videoId: string;
    videoTitle?: string;
    channelName?: string;
  };
}

const YoutubePlayerWidget: React.FC<YoutubePlayerWidgetProps> = ({ data }) => {
  const { videoId, videoTitle, channelName } = data;
  
  return (
    <div className="h-full flex flex-col">
      <div className="aspect-video w-full bg-black flex-grow">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={videoTitle || "YouTube Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      {(videoTitle || channelName) && (
        <div className="p-2">
          {videoTitle && <h3 className="font-medium text-white">{videoTitle}</h3>}
          {channelName && <p className="text-sm text-gray-300">{channelName}</p>}
        </div>
      )}
    </div>
  );
};

export default YoutubePlayerWidget;
