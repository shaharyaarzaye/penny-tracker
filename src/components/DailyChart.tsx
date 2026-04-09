'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpenseStore } from '@/store/expenseStore';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-black px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-none shadow-xl shadow-neutral-200/20 dark:shadow-none">
        <p className="text-xs font-bold tracking-widest uppercase text-neutral-500">{label}</p>
        <p className="text-sm font-light tracking-tight text-neutral-900 dark:text-white mt-1">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

export default function DailyChart() {
  const getDailySpending = useExpenseStore((s) => s.getDailySpending);
  const data = getDailySpending();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-neutral-400 text-xs tracking-widest uppercase">
        No Data to Display
      </div>
    );
  }

  const isDark = mounted && theme === 'dark';
  const barColor = isDark ? '#ffffff' : '#000000';
  const gridColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#a1a1aa' : '#71717a';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap="25%" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: textColor }}
          tickLine={false}
          axisLine={false}
          tickMargin={12}
        />
        <YAxis
          tick={{ fontSize: 10, fill: textColor }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => `₹${val}`}
          tickMargin={12}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#18181b' : '#f4f4f5' }} />
        <Bar dataKey="amount" fill={barColor} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
