import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { useFinanceStore } from '../../store/financeStore';
import { cn, formatCurrency } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';
import { Trash2 } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  currentMonth: Date;
}

export function FinanceCalendar({ selectedDate, onDateSelect, currentMonth }: CalendarProps) {
  const { getEntriesForMonth, deleteEntry } = useFinanceStore();
  const { profile } = useAuthStore();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const entries = getEntriesForMonth(currentMonth);

  const handleDelete = (date: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(date);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-2 text-center font-semibold bg-gray-100 dark:bg-gray-800"
          >
            {day}
          </div>
        ))}
        
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const entry = entries.find(e => e.date === dateStr);
          const hasInvestment = entry && entry.investment > 0;
          const hasEarnings = entry && entry.earnings > 0;
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <div key={dateStr} className="relative">
              <button
                onClick={() => onDateSelect(day)}
                className={cn(
                  'w-full p-2 min-h-[80px] text-left border rounded-lg transition-colors',
                  hasInvestment && 'bg-red-50 dark:bg-red-900/20',
                  hasEarnings && 'bg-green-50 dark:bg-green-900/20',
                  isSelected && 'ring-2 ring-blue-500',
                  'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <div className="font-medium">{format(day, 'd')}</div>
                {entry && (
                  <div className="text-xs space-y-1">
                    {hasInvestment && (
                      <div className="text-red-600 dark:text-red-400">
                        {formatCurrency(entry.investment, profile.currency)}
                      </div>
                    )}
                    {hasEarnings && (
                      <div className="text-green-600 dark:text-green-400">
                        {formatCurrency(entry.earnings, profile.currency)}
                      </div>
                    )}
                    {entry.spending > 0 && (
                      <div className="text-orange-600 dark:text-orange-400">
                        {formatCurrency(entry.spending, profile.currency)}
                      </div>
                    )}
                  </div>
                )}
              </button>
              {entry && isSelected && (
                <button
                  onClick={() => handleDelete(dateStr)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}