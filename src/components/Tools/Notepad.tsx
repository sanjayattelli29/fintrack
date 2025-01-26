import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface NotepadProps {
  onClose: () => void;
}

export function Notepad({ onClose }: NotepadProps) {
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    const savedNotes = localStorage.getItem('fintrack-notes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('fintrack-notes', notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Notepad</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="p-2 bg-green-100 dark:bg-green-900/20 text-green-600 rounded hover:bg-green-200 flex items-center space-x-1"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-96 p-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Start typing your notes here..."
          />
        </div>
      </div>
    </div>
  );
}