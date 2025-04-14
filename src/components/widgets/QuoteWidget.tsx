
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const quotes = [
  {
    text: "The world is a book, and those who do not travel read only a page.",
    author: "Augustine of Hippo"
  },
  {
    text: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde"
  },
  {
    text: "In three words I can sum up everything I've learned about life: it goes on.",
    author: "Robert Frost"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu"
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  }
];

const QuoteWidget = () => {
  const [quote, setQuote] = useState(quotes[0]);
  
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };
  
  useEffect(() => {
    // Initial random quote
    getRandomQuote();
    
    // Change quote every 30 seconds
    const interval = setInterval(getRandomQuote, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="text-center p-2">
      <p className="text-white text-lg italic mb-4">"{quote.text}"</p>
      <div className="flex items-center justify-between">
        <p className="text-gray-300 text-sm">— {quote.author}</p>
        <button 
          onClick={getRandomQuote} 
          className="text-gray-300 hover:text-white transition-colors"
          title="Get a new quote"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuoteWidget;
