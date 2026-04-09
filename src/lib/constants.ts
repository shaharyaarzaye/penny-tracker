export const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Others'] as const;
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
