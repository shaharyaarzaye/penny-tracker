import { create } from 'zustand';
import { format } from 'date-fns';

export interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseInput {
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export type PeriodFilter = 'all' | 'today' | 'week' | 'month' | 'custom';

interface ExpenseState {
  expenses: Expense[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  periodFilter: PeriodFilter;
  categoryFilter: string;
  customStartDate: string;
  customEndDate: string;
  isDarkMode: boolean;
  
  fetchExpenses: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<boolean>;
  addExpense: (expense: ExpenseInput) => Promise<boolean>;
  updateExpense: (id: string, expense: ExpenseInput) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  setPeriodFilter: (period: PeriodFilter) => void;
  setCategoryFilter: (category: string) => void;
  setCustomDateRange: (start: string, end: string) => void;
  toggleDarkMode: () => void;
  
  getTotalSpending: () => number;
  getCategoryBreakdown: () => { name: string; value: number; color: string }[];
  getDailySpending: () => { date: string; amount: number }[];
}


export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  categories: [],
  isLoading: false,
  error: null,
  periodFilter: 'month',
  categoryFilter: 'All',
  customStartDate: '',
  customEndDate: '',
  isDarkMode: typeof window !== 'undefined'
    ? localStorage.getItem('penny-tracker-dark') === 'true'
    : false,

  fetchCategories: async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) set({ categories: data.data });
    } catch (e) {
      console.error(e);
    }
  },

  addCategory: async (name: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: name }),
      });
      const data = await res.json();
      if (data.success) {
        set({ categories: data.data });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { periodFilter, categoryFilter, customStartDate, customEndDate } = get();
      
      const params = new URLSearchParams();
      if (periodFilter !== 'all' && periodFilter !== 'custom') {
        params.set('period', periodFilter);
      }
      if (periodFilter === 'custom') {
        if (customStartDate) params.set('startDate', customStartDate);
        if (customEndDate) params.set('endDate', customEndDate);
      }
      if (categoryFilter && categoryFilter !== 'All') {
        params.set('category', categoryFilter);
      }

      const response = await fetch(`/api/expenses?${params.toString()}`);
      if (response.status === 401) {
         if (typeof window !== 'undefined') window.location.href = '/login';
         return;
      }
      const data = await response.json();

      if (data.success) {
        set({ expenses: data.data, isLoading: false });
      } else {
        set({ error: data.error, isLoading: false });
      }
    } catch {
      set({ error: 'Failed to fetch expenses', isLoading: false });
    }
  },

  addExpense: async (expense: ExpenseInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      const data = await response.json();
      if (data.success) {
        await get().fetchExpenses();
        return true;
      }
      set({ error: data.error, isLoading: false });
      return false;
    } catch {
      set({ error: 'Failed to add', isLoading: false });
      return false;
    }
  },

  updateExpense: async (id: string, expense: ExpenseInput) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });
      const data = await response.json();
      if (data.success) {
        await get().fetchExpenses();
        return true;
      }
      set({ error: data.error, isLoading: false });
      return false;
    } catch {
      set({ error: 'Failed to update', isLoading: false });
      return false;
    }
  },

  deleteExpense: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        await get().fetchExpenses();
        return true;
      }
      set({ error: data.error, isLoading: false });
      return false;
    } catch {
      set({ error: 'Failed to delete', isLoading: false });
      return false;
    }
  },

  setPeriodFilter: (period: PeriodFilter) => set({ periodFilter: period }),
  setCategoryFilter: (category: string) => set({ categoryFilter: category }),
  setCustomDateRange: (start: string, end: string) => set({ customStartDate: start, customEndDate: end }),

  toggleDarkMode: () => {
    const newMode = !get().isDarkMode;
    set({ isDarkMode: newMode });
    if (typeof window !== 'undefined') {
      localStorage.setItem('penny-tracker-dark', String(newMode));
      document.documentElement.classList.toggle('dark', newMode);
    }
  },

  getTotalSpending: () => get().expenses.reduce((sum, exp) => sum + exp.amount, 0),

  getCategoryBreakdown: () => {
    const breakdown: Record<string, number> = {};
    get().expenses.forEach((exp) => {
      breakdown[exp.category] = (breakdown[exp.category] || 0) + exp.amount;
    });
    return Object.entries(breakdown).map(([name, value]) => ({
      name,
      value
    }));
  },

  getDailySpending: () => {
    const daily: Record<string, number> = {};
    get().expenses.forEach((exp) => {
      const day = format(new Date(exp.date), 'MMM dd');
      daily[day] = (daily[day] || 0) + exp.amount;
    });
    return Object.entries(daily)
      .map(([date, amount]) => ({ date, amount }))
      .reverse();
  },
}));
