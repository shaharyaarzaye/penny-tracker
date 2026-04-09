'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import CategoryChart from '@/components/CategoryChart';
import DailyChart from '@/components/DailyChart';
import ExpenseTable from '@/components/ExpenseTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import ExpenseForm from '@/components/ExpenseForm';
import AppLayout from '@/components/AppLayout';
import { useExpenseStore } from '@/store/expenseStore';
import { HiOutlineCurrencyRupee, HiOutlineCalendar, HiOutlineStar } from 'react-icons/hi';

export default function DashboardPage() {
  const { 
    expenses, 
    isLoading, 
    fetchExpenses, 
    getTotalSpending,
    getCategoryBreakdown 
  } = useExpenseStore();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const totalSpending = getTotalSpending();
  const categoryData = getCategoryBreakdown();
  
  let topCategory = { name: 'None', value: 0 };
  if (categoryData.length > 0) {
    topCategory = [...categoryData].sort((a, b) => b.value - a.value)[0];
  }

  return (
    <AppLayout>
      <Header title="Dashboard" subtitle="Overview your financial spectrum" />
      
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8">
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
           
           <div className="xl:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
             <h2 className="text-lg font-bold tracking-tight mb-6 text-neutral-900 dark:text-white">Quick Entry</h2>
             <ExpenseForm onSuccess={fetchExpenses} />
           </div>

           <div className="xl:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  title="Total Sum"
                  value={`₹${totalSpending.toLocaleString('en-IN')}`}
                  subtitle={`${expenses.length} records processed`}
                  icon={<HiOutlineCurrencyRupee size={24} />}
                />
                <StatCard
                  title="Daily Avg"
                  value={`₹${expenses.length > 0 ? Math.round(totalSpending / Math.max(1, expenses.length)).toLocaleString('en-IN') : '0'}`}
                  icon={<HiOutlineCalendar size={24} />}
                />
                <StatCard
                  title="Primary"
                  value={topCategory.name}
                  subtitle={topCategory.value > 0 ? `₹${topCategory.value.toLocaleString('en-IN')}` : '-'}
                  icon={<HiOutlineStar size={24} />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-6 flex items-center gap-2">Distribution map</h3>
                  <CategoryChart />
                </div>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
                   <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-6 flex items-center gap-2">Volume trend</h3>
                  <DailyChart />
                </div>
              </div>
           </div>

        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Recent Records</h3>
          </div>
          {isLoading && expenses.length === 0 ? <LoadingSpinner /> : <ExpenseTable />}
        </div>

      </div>
    </AppLayout>
  );
}
