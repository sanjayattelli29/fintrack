import React, { useState, useRef, useEffect } from 'react';
import { useFinanceStore } from '../../store/financeStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../lib/utils';
import { Send, Bot, X } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export function FinanceBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getAllEntries } = useFinanceStore();
  const { profile } = useAuthStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processQuery = (query: string) => {
    const entries = getAllEntries();
    const lowerQuery = query.toLowerCase();

    // Handle earnings queries
    if (lowerQuery.includes('earn')) {
      const monthMatch = lowerQuery.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i);
      if (monthMatch) {
        const [_, month, year] = monthMatch;
        const targetDate = parse(`${month} ${year}`, 'MMMM yyyy', new Date());
        
        if (isValid(targetDate)) {
          const monthEntries = entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return format(entryDate, 'MMMM yyyy').toLowerCase() === `${month} ${year}`.toLowerCase();
          });

          const totalEarnings = monthEntries.reduce((sum, entry) => sum + entry.earnings, 0);
          const totalInvestment = monthEntries.reduce((sum, entry) => sum + entry.investment, 0);
          const roi = totalInvestment > 0 ? ((totalEarnings - totalInvestment) / totalInvestment) * 100 : 0;

          return `In ${month} ${year}, you earned ${formatCurrency(totalEarnings, profile.currency)}. 
                 Your total investment was ${formatCurrency(totalInvestment, profile.currency)}, 
                 resulting in an ROI of ${roi.toFixed(2)}%.`;
        }
      }
    }

    // Handle investment queries
    if (lowerQuery.includes('invest')) {
      const totalInvestment = entries.reduce((sum, entry) => sum + entry.investment, 0);
      return `Your total investment across all time is ${formatCurrency(totalInvestment, profile.currency)}.`;
    }

    // Handle general performance queries
    if (lowerQuery.includes('performance') || lowerQuery.includes('overview')) {
      const totalEarnings = entries.reduce((sum, entry) => sum + entry.earnings, 0);
      const totalInvestment = entries.reduce((sum, entry) => sum + entry.investment, 0);
      const totalSpending = entries.reduce((sum, entry) => sum + entry.spending, 0);
      const overallRoi = totalInvestment > 0 ? ((totalEarnings - totalInvestment) / totalInvestment) * 100 : 0;

      return `Overall Performance Summary:
              Total Earnings: ${formatCurrency(totalEarnings, profile.currency)}
              Total Investment: ${formatCurrency(totalInvestment, profile.currency)}
              Total Spending: ${formatCurrency(totalSpending, profile.currency)}
              Overall ROI: ${overallRoi.toFixed(2)}%`;
    }

    return "I'm sorry, I couldn't understand your question. Try asking about earnings in a specific month, total investments, or overall performance.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    const botMessage: Message = {
      id: crypto.randomUUID(),
      type: 'bot',
      content: processQuery(input),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[600px] flex flex-col">
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold">Finance Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {format(message.timestamp, 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your finances..."
                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}