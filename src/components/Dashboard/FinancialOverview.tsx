import React from 'react';
import { useFinanceStore } from '../../store/financeStore';
import { formatCurrency } from '../../lib/utils';
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

interface FinancialOverviewProps {
  currentMonth: Date;
}

export function FinancialOverview({ currentMonth }: FinancialOverviewProps) {
  const { getEntriesForMonth } = useFinanceStore();
  const entries = getEntriesForMonth(currentMonth);

  const totalInvestment = entries.reduce((sum, entry) => sum + entry.investment, 0);
  const totalEarnings = entries.reduce((sum, entry) => sum + entry.earnings, 0);
  const remaining = totalEarnings - totalInvestment;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(remaining)}</h3>
          </div>
          <div className="h-12 w-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <ArrowUpRight className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-500 ml-1">Monthly Balance</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Income</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalEarnings)}</h3>
          </div>
          <div className="h-12 w-12 flex items-center justify-center bg-green-100 dark:bg-green-900/20 rounded-full">
            <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <ArrowUpRight className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-500 ml-1">Monthly Earnings</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Expenses</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalInvestment)}</h3>
          </div>
          <div className="h-12 w-12 flex items-center justify-center bg-red-100 dark:bg-red-900/20 rounded-full">
            <CreditCard className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <ArrowDownRight className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-500 ml-1">Monthly Investment</span>
        </div>
      </div>
    </div>
  );
}