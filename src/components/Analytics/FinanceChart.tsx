import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { useFinanceStore } from '../../store/financeStore';

interface ChartData {
  date: string;
  investment: number;
  earnings: number;
  roi: number;
}

interface FinanceChartProps {
  currentMonth: Date;
}

export function FinanceChart({ currentMonth }: FinanceChartProps) {
  const { getEntriesForMonth } = useFinanceStore();
  
  const data: ChartData[] = getEntriesForMonth(currentMonth)
    .map((entry) => ({
      date: format(new Date(entry.date), 'MMM d'),
      investment: entry.investment,
      earnings: entry.earnings,
      roi: ((entry.earnings - entry.investment) / entry.investment) * 100,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-[400px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="investment" fill="#ef4444" name="Investment" />
          <Bar dataKey="earnings" fill="#22c55e" name="Earnings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}