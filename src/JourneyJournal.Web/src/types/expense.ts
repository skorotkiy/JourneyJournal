export interface Expense {
  expenseId: number;
  tripId: number;
  description: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateExpenseRequest {
  description: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface UpdateExpenseRequest {
  description: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export const ExpenseCategory = {
  Transportation: 1,
  Restaurant: 2,
  Food: 3,
  Entertainment: 4,
  Shopping: 5,
  Fee: 6,
  Living: 7,
  Other: 8
} as const;

export type ExpenseCategory = typeof ExpenseCategory[keyof typeof ExpenseCategory];

export const PaymentMethod = {
  Cash: 1,
  CreditCard: 2
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];
