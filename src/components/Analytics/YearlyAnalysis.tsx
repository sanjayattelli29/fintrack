import React from 'react';
import { useFinanceStore } from '../../store/financeStore';
import { formatCurrency } from '../../lib/utils';
import { Download, TrendingUp, TrendingDown, DollarSign, Award, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function YearlyAnalysis() {
  const { getAllEntries, getBestMonth, getWorstMonth } = useFinanceStore();
  const { profile } = useAuthStore();
  const entries = getAllEntries();

  const totalInvestment = entries.reduce((sum, entry) => sum + entry.investment, 0);
  const totalEarnings = entries.reduce((sum, entry) => sum + entry.earnings, 0);
  const netProfitLoss = totalEarnings - totalInvestment;
  const roi = totalInvestment > 0 ? (netProfitLoss / totalInvestment) * 100 : 0;

  const bestMonth = getBestMonth();
  const worstMonth = getWorstMonth();

  const exportToCSV = () => {
    const headers = ['Date', 'Investment', 'Earnings', 'Profit/Loss', 'ROI (%)', 'Spending'];
    const csvData = entries.map(entry => {
      const profit = entry.earnings - entry.investment;
      const entryRoi = entry.investment > 0 ? (profit / entry.investment) * 100 : 0;
      return [
        entry.date,
        entry.investment,
        entry.earnings,
        profit,
        entryRoi.toFixed(2),
        entry.spending
      ].join(',');
    });

    const csvContent = [
      headers.join(','),
      ...csvData
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'financial_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Yearly Analysis</h3>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <Award className="h-5 w-5" />
            <span className="font-medium">Best Performing Month</span>
          </div>
          {bestMonth ? (
            <div className="mt-2">
              <p className="text-lg font-semibold">{bestMonth.month}</p>
              <p className="text-sm">ROI: {bestMonth.roi.toFixed(2)}%</p>
            </div>
          ) : (
            <p className="text-sm mt-2">No data available</p>
          )}
        </div>

        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Challenging Month</span>
          </div>
          {worstMonth ? (
            <div className="mt-2">
              <p className="text-lg font-semibold">{worstMonth.month}</p>
              <p className="text-sm">ROI: {worstMonth.roi.toFixed(2)}%</p>
            </div>
          ) : (
            <p className="text-sm mt-2">No data available</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <DollarSign className="h-5 w-5" />
            <span className="font-medium">Total Investment</span>
          </div>
          <p className="text-2xl font-bold mt-2">{formatCurrency(totalInvestment, profile.currency)}</p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold mt-2">{formatCurrency(totalEarnings, profile.currency)}</p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
            <TrendingDown className="h-5 w-5" />
            <span className="font-medium">Net Profit/Loss</span>
          </div>
          <p className={`text-2xl font-bold mt-2 ${netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfitLoss, profile.currency)}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400">
            <TrendingUp className="h-5 w-5" />
            <span className="font-medium">ROI</span>
          </div>
          <p className={`text-2xl font-bold mt-2 ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {roi.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}