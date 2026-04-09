'use client';
import { useEffect } from 'react';
import Header from '@/components/Header';
import PeriodFilterBar from '@/components/PeriodFilter';
import ExpenseTable from '@/components/ExpenseTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppLayout from '@/components/AppLayout';
import { useExpenseStore } from '@/store/expenseStore';

export default function ExpensesPage() {
  const { expenses, isLoading, fetchExpenses } = useExpenseStore();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <AppLayout>
      <Header title="History" />
      
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4">
          <PeriodFilterBar />
        </div>

        {isLoading && expenses.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <ExpenseTable />
        )}
      </div>
    </AppLayout>
  );
}
