import React, { useState } from 'react';
import { format, subYears, addYears, startOfYear, endOfYear } from 'date-fns';
import { useFinanceStore } from '../../store/financeStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function MonthlyOverview() {
  const [selectedYear, setSelectedYear] = useState(new Date());
  const { getAllEntries } = useFinanceStore();
  const { profile } = useAuthStore();
  const entries = getAllEntries();

  const monthlyData = entries.reduce((acc, entry) => {
    const month = format(new Date(entry.date), 'yyyy-MM');
    if (!acc[month]) {
      acc[month] = {
        investment: 0,
        earnings: 0,
        spending: 0
      };
    }
    acc[month].investment += entry.investment;
    acc[month].earnings += entry.earnings;
    acc[month].spending += entry.spending;
    return acc;
  }, {} as Record<string, { investment: number; earnings: number; spending: number }>);

  const yearStart = startOfYear(selectedYear);
  const yearEnd = endOfYear(selectedYear);
  const monthsInYear = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(selectedYear.getFullYear(), i, 1);
    return format(date, 'yyyy-MM');
  });

  const totals = {
    investment: 0,
    earnings: 0,
    spending: 0
  };

  const handlePrevYear = () => setSelectedYear(subYears(selectedYear, 1));
  const handleNextYear = () => setSelectedYear(addYears(selectedYear, 1));

  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg  text-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Monthly Overview</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevYear}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-medium">{selectedYear.getFullYear()}</span>
          <button
            onClick={handleNextYear}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4">Month</th>
              <th className="text-right py-3 px-4">Investment</th>
              <th className="text-right py-3 px-4">Sales</th>
              <th className="text-right py-3 px-4">Spending</th>
            </tr>
          </thead>
          <tbody>
            {monthsInYear.map(month => {
              const data = monthlyData[month] || { investment: 0, earnings: 0, spending: 0 };
              totals.investment += data.investment;
              totals.earnings += data.earnings;
              totals.spending += data.spending;

              return (
                <tr key={month} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">{format(new Date(month), 'MMMM yyyy')}</td>
                  <td className="text-right py-3 px-4 text-red-600 dark:text-red-400">
                    {formatCurrency(data.investment, profile.currency)}
                  </td>
                  <td className="text-right py-3 px-4 text-green-600 dark:text-green-400">
                    {formatCurrency(data.earnings, profile.currency)}
                  </td>
                  <td className="text-right py-3 px-4 text-orange-600 dark:text-orange-400">
                    {formatCurrency(data.spending, profile.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 dark:bg-gray-700 font-semibold">
              <td className="py-3 px-4">Total</td>
              <td className="text-right py-3 px-4 text-red-600 dark:text-red-400">
                {formatCurrency(totals.investment, profile.currency)}
              </td>
              <td className="text-right py-3 px-4 text-green-600 dark:text-green-400">
                {formatCurrency(totals.earnings, profile.currency)}
              </td>
              <td className="text-right py-3 px-4 text-orange-600 dark:text-orange-400">
                {formatCurrency(totals.spending, profile.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}