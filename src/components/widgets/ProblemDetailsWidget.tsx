import React from 'react';
import { ExternalLink, CheckSquare, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface ProblemDetailsWidgetProps {
  data: {
    problemId: string;
    problemTitle: string;
    problemUrl: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
}

const ProblemDetailsWidget: React.FC<ProblemDetailsWidgetProps> = ({ data }) => {
  const { problemTitle, problemUrl, difficulty } = data;
  
  const difficultyColor = 
    difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
    difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
    'bg-red-500/20 text-red-500';
  
  const addToTasks = () => {
    // Get existing tasks from localStorage
    const savedTasks = localStorage.getItem('dashy-todos');
    let tasks = savedTasks ? JSON.parse(savedTasks) : [];
    
    // Create new task
    const newTask = {
      id: Date.now().toString(),
      text: `${problemTitle} #POTD`,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0], // Today
      priority: 'high',
      url: problemUrl
    };
    
    // Add to tasks
    tasks = [newTask, ...tasks];
    
    // Save back to localStorage
    localStorage.setItem('dashy-todos', JSON.stringify(tasks));
    
    toast({
      title: "Added to Tasks",
      description: `${problemTitle} has been added to your tasks for today.`,
      duration: 3000
    });
  };
  
  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white text-lg flex items-center">
          <Code className="mr-2 h-5 w-5 text-purple-500" />
          Problem of the Day
        </h3>
        <div className={`px-2 py-1 rounded text-xs ${difficultyColor}`}>
          {difficulty}
        </div>
      </div>
      
      <div className="flex-grow">
        <h4 className="font-medium text-white mb-1">{problemTitle}</h4>
        <p className="text-sm text-gray-300 mb-4">
          Solve this problem today to improve your coding skills.
        </p>
      </div>
      
      <div className="flex gap-2 flex-wrap justify-end">
        <Button 
          onClick={() => window.open(problemUrl, '_blank')}
          variant="outline"
          className="flex-none"
          size="sm"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Problem
        </Button>
        <Button 
          onClick={addToTasks}
          className="flex-none"
          size="sm"
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          Add to Tasks
        </Button>
      </div>
    </div>
  );
};

export default ProblemDetailsWidget;
