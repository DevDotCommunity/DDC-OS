
import React, { useRef } from 'react';
import { Upload, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface WallpaperSelectorProps {
  isVisible: boolean;
  wallpapers: string[];
  onSelect: (wallpaper: string) => void;
  onAddWallpaper?: (wallpaper: string) => void;
}

const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({ 
  isVisible, 
  wallpapers, 
  onSelect,
  onAddWallpaper 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!isVisible) return null;
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        // Add wallpaper to list
        if (onAddWallpaper) {
          onAddWallpaper(result);
        }
        
        // Select the newly uploaded wallpaper
        onSelect(result);
        
        toast({
          description: "Wallpaper uploaded successfully",
          duration: 2000
        });
      }
    };
    
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="fixed bottom-20 right-6 glass p-4 rounded-xl grid grid-cols-3 gap-3 border border-white/15 animate-fade-in">
      <div className="col-span-3 mb-1">
        <h3 className="text-white text-sm font-medium mb-1">Select Wallpaper</h3>
      </div>
      
      {wallpapers.map((wallpaper, index) => (
        <button 
          key={index}
          className="w-16 h-10 rounded-md overflow-hidden border border-white/20 hover:border-white/50 transition-all duration-200 hover:scale-105"
          style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          onClick={() => onSelect(wallpaper)}
          title="Select this wallpaper"
        />
      ))}
      
      <label 
        className="w-16 h-10 rounded-md overflow-hidden border border-white/20 hover:border-white/50 transition-all duration-200 hover:scale-105 bg-white/10 flex items-center justify-center cursor-pointer"
        title="Upload your own wallpaper"
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload} 
        />
        <Upload size={16} className="text-white" />
      </label>
    </div>
  );
};

export default WallpaperSelector;
