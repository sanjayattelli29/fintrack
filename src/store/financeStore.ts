import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useAuthStore } from './authStore';

interface FinanceEntry {
  date: string;
  investment: number;
  earnings: number;
  spending: number;
  commission: number;
  tax: number;
  accountId: string;
}

interface FinanceState {
  entries: Record<string, FinanceEntry>;
  addEntry: (date: string, investment: number, earnings: number, spending: number, commission: number, tax: number) => void;
  deleteEntry: (date: string) => void;
  getEntry: (date: string) => FinanceEntry | undefined;
  getAllEntries: () => FinanceEntry[];
  getEntriesForMonth: (month: Date) => FinanceEntry[];
  getBestMonth: () => { month: string; roi: number } | null;
  getWorstMonth: () => { month: string; roi: number } | null;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      entries: {},
      addEntry: (date, investment, earnings, spending, commission, tax) => {
        const currentAccountId = useAuthStore.getState().currentAccountId;
        if (!currentAccountId) return;

        set((state) => ({
          entries: {
            ...state.entries,
            [date]: { date, investment, earnings, spending, commission, tax, accountId: currentAccountId },
          },
        }));
      },
      deleteEntry: (date) =>
        set((state) => {
          const { [date]: _, ...rest } = state.entries;
          return { entries: rest };
        }),
      getEntry: (date) => get().entries[date],
      getAllEntries: () => {
        const currentAccountId = useAuthStore.getState().currentAccountId;
        return Object.values(get().entries).filter(
          (entry) => entry.accountId === currentAccountId
        );
      },
      getEntriesForMonth: (month: Date) => {
        const currentAccountId = useAuthStore.getState().currentAccountId;
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        
        return Object.values(get().entries).filter(entry => {
          const entryDate = new Date(entry.date);
          return (
            entry.accountId === currentAccountId &&
            isWithinInterval(entryDate, { start: monthStart, end: monthEnd })
          );
        });
      },
      getBestMonth: () => {
        const entries = get().getAllEntries();
        if (entries.length === 0) return null;

        const monthlyData = entries.reduce((acc, entry) => {
          const month = entry.date.substring(0, 7); // YYYY-MM
          if (!acc[month]) {
            acc[month] = { investment: 0, earnings: 0 };
          }
          acc[month].investment += entry.investment;
          acc[month].earnings += entry.earnings;
          return acc;
        }, {} as Record<string, { investment: number; earnings: number }>);

        let bestMonth = '';
        let bestRoi = -Infinity;

        Object.entries(monthlyData).forEach(([month, data]) => {
          if (data.investment > 0) {
            const roi = ((data.earnings - data.investment) / data.investment) * 100;
            if (roi > bestRoi) {
              bestRoi = roi;
              bestMonth = month;
            }
          }
        });

        return bestMonth ? { month: bestMonth, roi: bestRoi } : null;
      },
      getWorstMonth: () => {
        const entries = get().getAllEntries();
        if (entries.length === 0) return null;

        const monthlyData = entries.reduce((acc, entry) => {
          const month = entry.date.substring(0, 7); // YYYY-MM
          if (!acc[month]) {
            acc[month] = { investment: 0, earnings: 0 };
          }
          acc[month].investment += entry.investment;
          acc[month].earnings += entry.earnings;
          return acc;
        }, {} as Record<string, { investment: number; earnings: number }>);

        let worstMonth = '';
        let worstRoi = Infinity;

        Object.entries(monthlyData).forEach(([month, data]) => {
          if (data.investment > 0) {
            const roi = ((data.earnings - data.investment) / data.investment) * 100;
            if (roi < worstRoi) {
              worstRoi = roi;
              worstMonth = month;
            }
          }
        });

        return worstMonth ? { month: worstMonth, roi: worstRoi } : null;
      },
    }),
    {
      name: 'finance-storage',
    }
  )
);