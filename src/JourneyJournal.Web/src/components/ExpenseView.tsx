import { Box, Typography, Chip, IconButton, Button, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Expense } from '../types/expense';
import { ExpenseCategory, PaymentMethod } from '../types/expense';

interface ExpenseViewProps {
  expense: Expense;
  currency?: string;
  tripId?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
  hideCategory?: boolean;
}

const ExpenseView = ({ expense, currency = 'EUR', onEdit, onDelete, compact = false, hideCategory = false }: ExpenseViewProps) => {
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

  const getCategoryColor = (category: ExpenseCategory): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (category) {
      case ExpenseCategory.Transportation: return 'info';
      case ExpenseCategory.Restaurant: return 'error';
      case ExpenseCategory.Food: return 'warning';
      case ExpenseCategory.Entertainment: return 'secondary';
      case ExpenseCategory.Shopping: return 'success';
      case ExpenseCategory.Fee: return 'default';
      case ExpenseCategory.Living: return 'primary';
      default: return 'default';
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    return method === PaymentMethod.Cash ? 'Cash' : 'Card';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 1,
        borderRadius: 1,
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: compact ? 'center' : 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          {compact ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', minWidth: '90px', flexShrink: 0 }}>
                {formatDate(expense.expenseDate)}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem', minWidth: '200px', flexShrink: 0 }}>
                {expense.description}
              </Typography>
              {!hideCategory && (
                <Chip
                  label={getCategoryLabel(expense.category)}
                  color={getCategoryColor(expense.category)}
                  size="small"
                  sx={{ fontSize: '0.65rem', height: '20px', flexShrink: 0 }}
                />
              )}
              <Typography variant="h6" color="primary" sx={{ fontSize: '1rem', fontWeight: 700, minWidth: '120px', flexShrink: 0 }}>
                {expense.amount.toFixed(2)} ({getPaymentMethodLabel(expense.paymentMethod)})
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {expense.description}
                </Typography>
                {!hideCategory && (
                  <Chip
                    label={getCategoryLabel(expense.category)}
                    color={getCategoryColor(expense.category)}
                    size="small"
                    sx={{ fontSize: '0.65rem', height: '20px' }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="h6" color="primary" sx={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {expense.amount.toFixed(2)} ({getPaymentMethodLabel(expense.paymentMethod)})
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  {formatDate(expense.expenseDate)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onEdit && (
            <IconButton size="small" onClick={onEdit} sx={{ padding: '4px' }}>
              <EditIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          )}
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              sx={{ fontSize: '0.75rem', py: 0.4, px: 1.4, minWidth: 0 }}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ExpenseView;
