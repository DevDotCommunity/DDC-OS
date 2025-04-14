
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoWidget = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  
  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('dashy-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);
  
  // Save todos to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dashy-todos', JSON.stringify(todos));
  }, [todos]);
  
  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false
    };
    
    setTodos([...todos, todo]);
    setNewTodo('');
  };
  
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex mb-3">
        <input
          type="text"
          className="glass-input flex-1 mr-2"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="glass-button" onClick={addTodo}>Add</button>
      </div>
      
      <div className="overflow-y-auto max-h-40 pr-1">
        {todos.length === 0 && (
          <div className="text-gray-400 text-center py-2">No tasks yet</div>
        )}
        
        {todos.map(todo => (
          <div 
            key={todo.id} 
            className="flex items-center py-2 border-b border-white/5 last:border-0"
          >
            <div 
              className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 cursor-pointer
                ${todo.completed ? 'bg-blue-500 border-blue-500' : 'border-white/30'}`}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.completed && <Check size={12} className="text-white" />}
            </div>
            <div 
              className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-white'}`}
            >
              {todo.text}
            </div>
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="ml-2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoWidget;
