import React, { useState, useRef } from 'react';
import { Command, Sparkles } from 'lucide-react';

interface AITextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function AITextEditor({ 
  value, 
  onChange,
  placeholder = "Add details... Type / for AI assistance",
  minHeight = "200px",
  className = ""
}: AITextEditorProps) {
  const [slashCommandStart, setSlashCommandStart] = useState<number | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && slashCommandStart !== null) {
      e.preventDefault();
      setIsProcessingAI(true);
      
      try {
        // Get the complete command text
        const commandText = value.slice(slashCommandStart + 1, cursorPosition);
        
        // Example: Add a workout plan
        if (commandText.toLowerCase().includes('workout')) {
          const workoutPlan = `Today's Workout:
1. Warm-up (10 mins)
   - Light jogging
   - Dynamic stretches
2. Main Workout (40 mins)
   - Squats: 3 sets x 12 reps
   - Bench Press: 3 sets x 10 reps
   - Deadlifts: 3 sets x 8 reps
   - Pull-ups: 3 sets x failure
3. Cool-down (10 mins)
   - Static stretches
   - Light walking`;
          
          // Replace the command with the generated content
          const newValue = value.slice(0, slashCommandStart) + workoutPlan + value.slice(cursorPosition);
          onChange(newValue);
        }
      } finally {
        setIsProcessingAI(false);
        setAiPrompt('');
        setSlashCommandStart(null);
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const currentCursorPosition = e.target.selectionStart;
    onChange(newValue);
    setCursorPosition(currentCursorPosition);

    // Find the last slash before the cursor
    const textBeforeCursor = newValue.slice(0, currentCursorPosition);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');
    
    if (lastSlashIndex !== -1) {
      // Get all text from slash to cursor
      const textAfterSlash = textBeforeCursor.slice(lastSlashIndex + 1);
      
      // If we have a slash and haven't hit enter yet
      if (!textAfterSlash.includes('\n')) {
        setSlashCommandStart(lastSlashIndex);
        setAiPrompt(textAfterSlash);
      } else {
        setSlashCommandStart(null);
        setAiPrompt('');
      }
    } else {
      setSlashCommandStart(null);
      setAiPrompt('');
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        rows={6}
        className={`w-full rounded-md border shadow-sm p-3 text-gray-700 resize-none font-mono text-sm leading-relaxed ${
          aiPrompt 
            ? 'border-indigo-300 ring-2 ring-indigo-200 ring-opacity-50' 
            : 'border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        } ${className}`}
        placeholder={placeholder}
        style={{ minHeight }}
      />
      {!aiPrompt && (
        <div className="absolute bottom-3 right-3 flex items-center space-x-1 text-xs text-gray-400">
          <Command className="h-3 w-3" />
          <span>Type / for AI assistance</span>
        </div>
      )}
      {aiPrompt && (
        <div className="absolute left-0 right-0 bottom-full mb-2">
          <div className="bg-white rounded-lg shadow-lg border border-indigo-200 overflow-hidden">
            <div className="p-3 bg-indigo-50 border-b border-indigo-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-900">
                    AI Assistant
                  </span>
                </div>
                <span className="text-xs text-indigo-600 font-medium">
                  Press Enter to apply
                </span>
              </div>
            </div>
            <div className="p-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {aiPrompt ? `"${aiPrompt}"` : 'Type a command...'}
                </span>
                {isProcessingAI && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}