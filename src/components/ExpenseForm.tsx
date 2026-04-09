'use client';
import { useState, useEffect } from 'react';
import { useExpenseStore, Expense } from '@/store/expenseStore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
  const { addExpense, updateExpense, categories, isLoadingCategories, fetchCategories, addCategory } = useExpenseStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: expense ? expense.amount.toString() : '',
    category: expense ? expense.category : '',
    date: expense ? format(new Date(expense.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    note: expense ? expense.note : '',
    customCategory: ''
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categories.length > 0 && !formData.category && !expense) {
      setFormData(prev => ({ ...prev, category: categories[0] }));
    }
  }, [categories, formData.category, expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      toast.error('Amount and Category are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        note: formData.note
      };

      let success = false;
      if (expense) {
        success = await updateExpense(expense._id, payload);
        if (success) toast.success('Record updated');
      } else {
        success = await addExpense(payload);
        if (success) {
          toast.success('Record added');
          setFormData({
            amount: '',
            category: categories.length > 0 ? categories[0] : '',
            date: format(new Date(), 'yyyy-MM-dd'),
            note: '',
            customCategory: ''
          });
        }
      }

      if (success && onSuccess) onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    if (!formData.customCategory.trim()) return;
    setIsSubmitting(true);
    const success = await addCategory(formData.customCategory.trim());
    if (success) {
      setFormData(prev => ({ ...prev, category: formData.customCategory.trim(), customCategory: '' }));
      setIsAddingCategory(false);
      toast.success('Category saved to your space');
    } else {
      toast.error('Failed to save category');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Amount (₹)</label>
        <input
          type="number"
          min="1"
          step="1"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl text-neutral-900 dark:text-white transition-all shadow-sm"
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">Category</label>
          <button
            type="button"
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="text-xs font-bold text-neutral-900 dark:text-white hover:opacity-70 transition"
          >
            {isAddingCategory ? 'Cancel' : '+ NEW'}
          </button>
        </div>

        {isAddingCategory ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.customCategory}
              onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl text-neutral-900 dark:text-white transition-all shadow-sm"
              placeholder="E.g. Subscriptions"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={isSubmitting || !formData.customCategory.trim()}
              className="px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              Add
            </button>
          </div>
        ) : (
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl text-neutral-900 dark:text-white transition-all shadow-sm"
            required
            disabled={isLoadingCategories}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl text-neutral-900 dark:text-white transition-all shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">Note (Optional)</label>
        <input
          type="text"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl text-neutral-900 dark:text-white transition-all shadow-sm"
          placeholder="Lunch at..."
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : expense ? 'Update' : 'Add Record'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all shadow-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
