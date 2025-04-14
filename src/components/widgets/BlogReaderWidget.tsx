import React from 'react';
import { ExternalLink } from 'lucide-react';

interface BlogReaderWidgetProps {
  data: {
    blogUrl: string;
    blogTitle: string;
    author: string;
    excerpt: string;
    mediumUrl?: string;
  };
}

const BlogReaderWidget: React.FC<BlogReaderWidgetProps> = ({ data }) => {
  const { blogUrl, blogTitle, author, excerpt, mediumUrl } = data;
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex flex-col p-2 mb-2">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-white">{blogTitle}</h3>
          <a 
            href={blogUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-400 hover:text-blue-300"
          >
            <ExternalLink size={16} />
          </a>
        </div>
        <p className="text-sm text-gray-300">By {author}</p>
      </div>
      
      {mediumUrl ? (
        <div className="flex-grow bg-white">
          <iframe 
            src={`${mediumUrl}?format=lite`} 
            width="100%" 
            height="100%" 
            frameBorder="0"
            className="bg-white min-h-[250px]"
          ></iframe>
        </div>
      ) : (
        <div className="p-2 border-l-4 border-gray-700 ml-2 italic text-gray-300 text-sm">
          {excerpt}
        </div>
      )}
    </div>
  );
};

export default BlogReaderWidget;
