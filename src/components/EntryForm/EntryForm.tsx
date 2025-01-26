import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useFinanceStore } from '../../store/financeStore';
import { useAuthStore } from '../../store/authStore';
import { Trash2, Save, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface EntryFormProps {
  selectedDate: Date;
  currentMonth: Date;
}

export function EntryForm({ selectedDate, currentMonth }: EntryFormProps) {
  const { addEntry, getEntriesForMonth, deleteEntry } = useFinanceStore();
  const { profile, updateDefaultRates } = useAuthStore();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const entries = getEntriesForMonth(currentMonth);
  const entry = entries.find(e => e.date === dateStr);

  // Initialize state with default values
  const [investment, setInvestment] = useState('0');
  const [earnings, setEarnings] = useState('0');
  const [spending, setSpending] = useState('0');
  const [commission, setCommission] = useState('0');
  const [tax, setTax] = useState('0');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    // Set initial values based on profile defaults
    if (!entry) {
      setInvestment('0');
      setEarnings('0');
      setSpending('0');
      setCommission(profile?.defaultCommission?.toString() || '0');
      setTax(profile?.defaultTax?.toString() || '0');
    } else {
      // Set values from existing entry
      setInvestment(entry.investment?.toString() || '0');
      setEarnings(entry.earnings?.toString() || '0');
      setSpending(entry.spending?.toString() || '0');
      setCommission(entry.commission?.toString() || profile?.defaultCommission?.toString() || '0');
      setTax(entry.tax?.toString() || profile?.defaultTax?.toString() || '0');
    }
  }, [entry, profile?.defaultCommission, profile?.defaultTax]);

  const calculateNetEarnings = (gross: number, commission: number, tax: number) => {
    const commissionAmount = (gross * commission) / 100;
    const taxAmount = (gross * tax) / 100;
    return gross - commissionAmount - taxAmount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grossEarnings = Number(earnings) || 0;
    const commissionPercent = Number(commission) || 0;
    const taxPercent = Number(tax) || 0;
    const netEarnings = calculateNetEarnings(grossEarnings, commissionPercent, taxPercent);

    addEntry(
      dateStr,
      Number(investment) || 0,
      netEarnings,
      Number(spending) || 0,
      commissionPercent,
      taxPercent
    );
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(dateStr);
      setInvestment('0');
      setEarnings('0');
      setSpending('0');
      setCommission(profile?.defaultCommission?.toString() || '0');
      setTax(profile?.defaultTax?.toString() || '0');
    }
  };

  const handleSaveDefaults = () => {
    updateDefaultRates(Number(commission) || 0, Number(tax) || 0);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Entry for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        {entry && (
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-600 dark:text-blue-400">Default Rates</h4>
            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
              Set your default commission and tax rates. These will be applied to new entries automatically.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Commission (%)</label>
              <input
                type="number"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
                step="0.01"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tax (%)</label>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleSaveDefaults}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save as Default Rates</span>
            </button>

            {showSaveSuccess && (
              <span className="text-green-600 dark:text-green-400 text-sm">
                Default rates saved successfully!
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Investment ({profile?.currency || 'USD'})</label>
        <input
          type="number"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
          step="0.01"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gross Earnings ({profile?.currency || 'USD'})</label>
        <input
          type="number"
          value={earnings}
          onChange={(e) => setEarnings(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
          step="0.01"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Spending ({profile?.currency || 'USD'})</label>
        <input
          type="number"
          value={spending}
          onChange={(e) => setSpending(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
          step="0.01"
          min="0"
        />
      </div>

      {Number(earnings) > 0 && (Number(commission) > 0 || Number(tax) > 0) && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm font-medium">Net Earnings after deductions:</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrency(
              calculateNetEarnings(
                Number(earnings),
                Number(commission),
                Number(tax)
              ),
              profile?.currency || 'USD'
            )}
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Entry
      </button>
    </form>
  );
}