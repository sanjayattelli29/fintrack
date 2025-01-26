import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CalculatorProps {
  onClose: () => void;
}

export function Calculator({ onClose }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const handleEqual = () => {
    try {
      const result = eval(equation + display);
      setDisplay(result.toString());
      setEquation('');
      setIsNewNumber(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold">Calculator</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 h-6">{equation}</div>
            <div className="text-2xl font-bold">{display}</div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <button onClick={handleClear} className="col-span-2 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded hover:bg-red-200">C</button>
            <button onClick={() => handleOperator('/')} className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded hover:bg-blue-200">÷</button>
            <button onClick={() => handleOperator('*')} className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded hover:bg-blue-200">×</button>
            
            {[7, 8, 9].map(num => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{num}</button>
            ))}
            <button onClick={() => handleOperator('-')} className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded hover:bg-blue-200">-</button>
            
            {[4, 5, 6].map(num => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{num}</button>
            ))}
            <button onClick={() => handleOperator('+')} className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded hover:bg-blue-200">+</button>
            
            {[1, 2, 3].map(num => (
              <button key={num} onClick={() => handleNumber(num.toString())} className="p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">{num}</button>
            ))}
            <button onClick={handleEqual} className="row-span-2 p-3 bg-blue-600 text-white rounded hover:bg-blue-700">=</button>
            
            <button onClick={() => handleNumber('0')} className="col-span-2 p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">0</button>
            <button onClick={() => handleNumber('.')} className="p-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">.</button>
          </div>
        </div>
      </div>
    </div>
  );
}