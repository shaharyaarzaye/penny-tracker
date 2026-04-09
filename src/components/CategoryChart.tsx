'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useExpenseStore } from '@/store/expenseStore';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-black px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-none shadow-xl shadow-neutral-200/20 dark:shadow-none">
        <p className="text-xs font-bold tracking-widest uppercase text-neutral-900 dark:text-white">
          {payload[0].name}
        </p>
        <p className="text-sm font-light tracking-tight text-neutral-500 mt-1">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart() {
  const getCategoryBreakdown = useExpenseStore((s) => s.getCategoryBreakdown);
  const data = getCategoryBreakdown();
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

  // Uniform mid-tone monochrome palette visible in both themes
  const lightColors = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8'];
  const darkColors = ['#fafafa', '#e4e4e7', '#a1a1aa', '#71717a', '#3f3f46'];
  const colors = mounted && theme === 'dark' ? darkColors : lightColors;
  const textColor = mounted && theme === 'dark' ? '#a1a1aa' : '#71717a';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span style={{ color: textColor, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
