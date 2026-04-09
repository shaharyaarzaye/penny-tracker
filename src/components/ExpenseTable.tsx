'use client';
import { useState } from 'react';
import { useExpenseStore, Expense } from '@/store/expenseStore';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ExpenseForm from './ExpenseForm';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

export default function ExpenseTable() {
  const { expenses, isLoading, deleteExpense } = useExpenseStore();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleDelete = async (id: string) => {
    const success = await deleteExpense(id);
    if (success) toast.success('Deleted successfully');
  };

  if (isLoading && expenses.length === 0) {
    return <div className="text-sm font-medium text-neutral-500 p-8 text-center bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">Loading data...</div>;
  }

  if (expenses.length === 0) {
    return <div className="text-sm font-medium text-neutral-500 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-12 text-center rounded-2xl shadow-sm">No expenses traced yet.</div>;
  }

  return (
    <>
      {editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-white">Edit Record</h3>
            <ExpenseForm
              expense={editingExpense}
              onSuccess={() => setEditingExpense(null)}
              onCancel={() => setEditingExpense(null)}
            />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-neutral-100 dark:border-neutral-800/80 text-xs text-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/50 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-neutral-700 dark:text-neutral-300">
              {expenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{format(new Date(expense.date), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-semibold">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">₹{expense.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-neutral-500 overflow-hidden text-ellipsis max-w-xs">{expense.note || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      <button onClick={() => setEditingExpense(expense)} className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all">
                        <HiOutlinePencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(expense._id)} className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all">
                         <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
