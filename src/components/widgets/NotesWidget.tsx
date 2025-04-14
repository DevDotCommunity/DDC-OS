
import { useState, useEffect } from 'react';

const NotesWidget = () => {
  const [notes, setNotes] = useState('');
  
  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('dashy-notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);
  
  // Save notes to localStorage when they change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNotes(value);
    localStorage.setItem('dashy-notes', value);
  };
  
  return (
    <div className="flex flex-col h-full">
      <textarea 
        className="glass-input w-full h-40 resize-none focus:outline-none"
        value={notes}
        onChange={handleChange}
        placeholder="Type your notes here..."
      />
    </div>
  );
};

export default NotesWidget;
