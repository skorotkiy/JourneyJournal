import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Alert,
  MenuItem,
} from '@mui/material';

import type { Expense, CreateExpenseRequest } from '../types/expense';
import { ExpenseCategory, PaymentMethod } from '../types/expense';
import { expenseService } from '../services/expenseService';

interface ExpenseFormProps {
  tripId: number;
  onCancel: () => void;
  onSuccess: (expense: Expense) => void;
  initialData?: Expense;
}

const ExpenseForm = ({ tripId, onCancel, onSuccess, initialData }: ExpenseFormProps) => {
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    category: initialData?.category || ExpenseCategory.Other,
    amount: initialData?.amount.toString() || '',
    expenseDate: initialData?.expenseDate.split('T')[0] || new Date().toISOString().split('T')[0],
    paymentMethod: initialData?.paymentMethod || PaymentMethod.Cash,
    notes: initialData?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'category' || name === 'paymentMethod' ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount is required and must be greater than 0';
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate = 'Expense date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const expenseData: CreateExpenseRequest = {
        description: formData.description,
        category: formData.category,
        amount: parseFloat(formData.amount),
        expenseDate: formData.expenseDate,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined,
      };
      
      const createdExpense = initialData
        ? await expenseService.update(tripId, initialData.expenseId, expenseData)
        : await expenseService.create(tripId, expenseData);
      
      onSuccess(createdExpense);
    } catch (error) {
      console.error('Failed to create expense:', error);
      setErrors({ submit: 'Failed to create expense. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: ExpenseCategory): string => {
    switch (category) {
      case ExpenseCategory.Transportation: return 'Transportation';
      case ExpenseCategory.Restaurant: return 'Restaurant';
      case ExpenseCategory.Food: return 'Food';
      case ExpenseCategory.Entertainment: return 'Entertainment';
      case ExpenseCategory.Shopping: return 'Shopping';
      case ExpenseCategory.Fee: return 'Fee';
      case ExpenseCategory.Living: return 'Living';
      case ExpenseCategory.Other: return 'Other';
      default: return 'Other';
    }
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              required
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              inputProps={{ maxLength: 200 }}
              sx={{ 
                flex: 1, 
                minWidth: '200px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
              }}
              size="small"
            />

            <TextField
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              sx={{ 
                width: '150px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiSelect-select': { padding: '4px 10px' }
              }}
              size="small"
            >
              {Object.values(ExpenseCategory)
                .filter(v => typeof v === 'number')
                .map(value => (
                  <MenuItem key={value} value={value}>
                    {getCategoryLabel(value as ExpenseCategory)}
                  </MenuItem>
                ))}
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <TextField
              required
              label="Date"
              name="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={handleChange}
              error={!!errors.expenseDate}
              helperText={errors.expenseDate}
              InputLabelProps={{ shrink: true }}
              sx={{ 
                width: '150px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
              }}
              size="small"
            />

            <TextField
              required
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ 
                width: '100px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
              }}
              size="small"
            />

            <TextField
              select
              label="Payment"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              sx={{ 
                width: '110px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiSelect-select': { padding: '4px 10px' }
              }}
              size="small"
            >
              <MenuItem value={PaymentMethod.Cash}>Cash</MenuItem>
              <MenuItem value={PaymentMethod.CreditCard}>Card</MenuItem>
            </TextField>
          </Box>

          <TextField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            inputProps={{ maxLength: 200 }}
            helperText={`${formData.notes.length}/200 characters`}
            sx={{ 
              '& .MuiInputBase-root': { fontSize: '0.75rem' },
              '& .MuiInputLabel-root': { fontSize: '0.75rem' },
              '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
            }}
            size="small"
          />

          {errors.submit && (
            <Alert severity="error" sx={{ fontSize: '0.75rem' }}>{errors.submit}</Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              size="small"
              sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              size="small"
              sx={{
                fontSize: '0.7rem',
                py: 0.4,
                px: 1.2,
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                '&:hover': { backgroundColor: '#bbdefb' },
                border: '1px solid #90caf9',
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ExpenseForm;
