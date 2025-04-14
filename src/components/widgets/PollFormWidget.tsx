import React from 'react';
import { BarChart, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PollFormWidgetProps {
  data: {
    pollId: string;
    pollTitle: string;
    formUrl: string;
    expiresAt?: string;
  };
}

const PollFormWidget: React.FC<PollFormWidgetProps> = ({ data }) => {
  const { pollTitle, formUrl, expiresAt } = data;
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-white/10">
        <h3 className="font-medium text-white flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-orange-500" />
          {pollTitle}
        </h3>
        
        {expiresAt && (
          <div className="text-xs text-gray-400 flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            Expires: {new Date(expiresAt).toLocaleDateString()}
          </div>
        )}
      </div>
      
      <div className="flex-grow overflow-hidden">
        <iframe 
          src={formUrl}
          width="100%" 
          height="100%" 
          frameBorder="0"
          className="min-h-[300px]"
        ></iframe>
      </div>
      
      <div className="p-3 border-t border-white/10">
        <Button 
          onClick={() => window.open(formUrl, '_blank')}
          variant="outline"
          className="w-full"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in Browser
        </Button>
      </div>
    </div>
  );
};

export default PollFormWidget;
