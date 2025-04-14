
import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
      setSearchTerm('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="glass-input flex items-center rounded-full px-3 py-2 bg-black/50 backdrop-blur-lg border border-white/10">
        <Search size={18} className="text-gray-400 mr-2" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-white w-full" 
          placeholder="Search"
        />
      </div>
    </form>
  );
};

export default SearchWidget;
