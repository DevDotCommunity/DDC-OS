import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlidingSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlidingSearch: React.FC<SlidingSearchProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
      setSearchTerm('');
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('search-input');
      if (input) {
        input.focus();
      }
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-20 left-0 right-0 p-4 z-50"
        >
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <div className="glass-input flex items-center rounded-full px-4 py-3 bg-black/50 backdrop-blur-lg border border-white/10">
              <Search size={20} className="text-gray-400 mr-3" />
              <input
                id="search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full text-lg"
                placeholder="Search anything..."
              />
              <button
                type="button"
                onClick={onClose}
                className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlidingSearch; 