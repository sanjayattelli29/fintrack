import React, { useState } from 'react';
import { Calculator, Camera, FileText, Settings, X } from 'lucide-react';
import { Calculator as CalculatorTool } from './Calculator';
import { Notepad } from './Notepad';

export function FloatingTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'calculator' | 'notepad' | null>(null);

  const handleScreenshot = () => {
    html2canvas(document.body).then(canvas => {
      const link = document.createElement('a');
      link.download = `screenshot-${new Date().toISOString()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleCalculator = () => {
    setActiveModal('calculator');
  };

  const handleNotepad = () => {
    setActiveModal('notepad');
  };

  return (
    <>
      <div className="fixed bottom-8 left-8 z-50">
        {/* Tools */}
        <div className={`absolute bottom-16 left-0 space-y-4 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button
            onClick={handleNotepad}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors transform hover:scale-110"
            title="Notepad"
          >
            <FileText className="h-5 w-5" />
          </button>
          <button
            onClick={handleCalculator}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors transform hover:scale-110"
            title="Calculator"
          >
            <Calculator className="h-5 w-5" />
          </button>
          <button
            onClick={handleScreenshot}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-110"
            title="Screenshot"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors transform hover:scale-110"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Settings className="h-6 w-6 animate-spin-slow" />
          )}
        </button>
      </div>

      {/* Modals */}
      {activeModal === 'calculator' && (
        <CalculatorTool onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'notepad' && (
        <Notepad onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}