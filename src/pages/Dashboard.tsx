import React, { useState } from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { FinanceCalendar } from '../components/Calendar/FinanceCalendar';
import { EntryForm } from '../components/EntryForm/EntryForm';
import { FinanceChart } from '../components/Analytics/FinanceChart';
import { YearlyAnalysis } from '../components/Analytics/YearlyAnalysis';
import { MonthlyOverview } from '../components/Analytics/MonthlyOverview';
import { FinancialOverview } from '../components/Dashboard/FinancialOverview';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AccountMenu } from '../components/ui/AccountMenu';
import { Footer } from '../components/Layout/Footer';
import { FinanceBot } from '../components/Chat/FinanceBot';
import { useAuthStore } from '../store/authStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { profile } = useAuthStore();

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => new Date(2000, i).toLocaleString('default', { month: 'long' }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Financial Dashboard</h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AccountMenu />
            </div>
          </div>
          <div className="text-2xl font-light">
            Welcome Back, <span className="font-medium">{profile.name}</span>.
            <br />
            <span className="text-lg text-gray-600 dark:text-gray-400">This is your Financial Report.</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-8">
        <FinancialOverview currentMonth={currentMonth} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
              <div className="flex items-center justify-between">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={currentMonth.getFullYear()}
                    onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth()))}
                    className="p-2 rounded-lg border dark:bg-gray-700"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={currentMonth.getMonth()}
                    onChange={(e) => setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value)))}
                    className="p-2 rounded-lg border dark:bg-gray-700"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <FinanceCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              currentMonth={currentMonth}
            />

            <MonthlyOverview />

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
              <FinanceChart currentMonth={currentMonth} />
            </div>

            <YearlyAnalysis />
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <EntryForm selectedDate={selectedDate} currentMonth={currentMonth} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FinanceBot />
    </div>
  );
}