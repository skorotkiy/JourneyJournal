import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  Tabs,
  Tab,
  Chip,
  Button,
} from '@mui/material';

import { expenseService } from '../services/expenseService';
import { tripService } from '../services/tripService';
import type { Trip } from '../types/trip';
import type { Expense } from '../types/expense';
import { ExpenseCategory, PaymentMethod } from '../types/expense';
import { DateHelper } from '../utils/DateHelper';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`expense-tabpanel-${index}`}
      aria-labelledby={`expense-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ExpensesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(parseInt(searchParams.get('tab') || '0'));
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  const renderExpenseCard = (expense: Expense) => (
    <Paper
      key={expense.expenseId}
      variant="outlined"
      sx={{ p: 1.5, mb: 1.25, borderColor: 'divider' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
          {DateHelper.formatDate(expense.expenseDate)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 160 }}>
          <Typography variant="body1">{expense.description}</Typography>
          <Chip
            label={getCategoryLabel(expense.category)}
            size="small"
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>
        <Typography variant="body2" fontWeight={700} sx={{ minWidth: 150 }}>
          {expense.amount.toFixed(2)} {getPaymentMethodLabel(expense.paymentMethod)}
        </Typography>
      </Box>
      {expense.notes && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Notes: {expense.notes}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => handleDeleteClick(expense)}
          sx={{ fontSize: '0.75rem', py: 0.4, px: 1.4 }}
        >
          Delete
        </Button>
        <Button
          size="small"
          onClick={() => handleEditClick(expense)}
          sx={{
            fontSize: '0.75rem',
            py: 0.4,
            px: 1.4,
            color: '#1976d2',
            backgroundColor: '#e3f2fd',
            border: '1px solid #90caf9',
            '&:hover': { backgroundColor: '#bbdefb', borderColor: '#64b5f6' },
          }}
        >
          Edit
        </Button>
      </Box>
    </Paper>
  );

  useEffect(() => {
    const fetchCurrentTrip = async () => {
      try {
        const trips = await tripService.getAll();
        // Get trip with IsDefault=true, or most recent incomplete trip
        const defaultTrip = trips.find(t => !t.isCompleted) || trips[0];
        if (defaultTrip) {
          const fullTrip = await tripService.getById(defaultTrip.tripId.toString());
          setCurrentTrip(fullTrip);
          // Fetch expenses using expenseService.getAll
          const expensesData = await expenseService.getAll(fullTrip.tripId);
          setExpenses(expensesData);
        }
      } catch (err) {
        console.error('Failed to fetch trip:', err);
        setError('Failed to load trip data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTrip();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteSnackbarOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExpense || !currentTrip) return;

    setDeleting(true);
    try {
      await expenseService.delete(currentTrip.tripId, selectedExpense.expenseId);
      
      // Refresh expenses data
      const updatedExpenses = await expenseService.getAll(currentTrip.tripId);
      setExpenses(updatedExpenses);
      
      setDeleteSnackbarOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error('Failed to delete expense:', err);
      setError('Failed to delete expense. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteSnackbarOpen(false);
    setSelectedExpense(null);
  };

  const handleEditClick = (expense: Expense) => {
    navigate(`/trips/${currentTrip?.tripId}/expenses/${expense.expenseId}/edit?tab=${tabValue}`);
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

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    return method === PaymentMethod.Cash ? 'Cash' : 'Card';
  };

  // Using DateHelper.formatDate for date display

  // Helper to sum amounts
  const getTotalAmount = (expenseList: Expense[]) => expenseList.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate summary values for expenses
  const totalAmount = getTotalAmount(expenses);
  const totalCash = getTotalAmount(expenses.filter(e => e.paymentMethod === PaymentMethod.Cash));
  const totalCard = getTotalAmount(expenses.filter(e => e.paymentMethod === PaymentMethod.CreditCard));
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(a.expenseDate).getTime() - new Date(b.expenseDate).getTime()
  );

  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = getCategoryLabel(expense.category);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  // (removed duplicate definition)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')} size="small" sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}>
          Back to Home
        </Button>
      </Box>
    );
  }

  if (!currentTrip) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          No active trip found. Please create a trip first.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/trips/create')} size="small" sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}>
          Create Trip
        </Button>
      </Box>
    );
  }


  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteSnackbarOpen} onClose={handleDeleteCancel} PaperProps={{ sx: { minWidth: 'auto', maxWidth: '350px' } }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '0.95rem', py: 1.5, px: 2 }}>
          Delete {selectedExpense?.amount.toFixed(2)} {selectedExpense?.currency || 'EUR'} expense?
        </DialogTitle>
        <DialogActions sx={{ gap: 0.5, p: 1.5, pt: 0 }}>
          <Button onClick={handleDeleteCancel} disabled={deleting} size="small" sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="outlined"
            color="error"
            disabled={deleting}
            size="small"
            sx={{ fontSize: '0.75rem', py: 0.4, px: 1.4 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="expense tabs"
            sx={{ flex: 1 }}
          >
            <Tab label="All Expenses" />
            <Tab label="By Category" />
          </Tabs>
          <Button
            size="small"
            onClick={() => navigate(`/trips/${currentTrip.tripId}`)}
            sx={{
              mr: 2,
              fontSize: '0.75rem',
              py: 0.4,
              px: 1.4,
              color: '#1976d2',
              backgroundColor: '#e3f2fd',
              border: '1px solid #90caf9',
              '&:hover': { backgroundColor: '#bbdefb', borderColor: '#64b5f6' },
            }}
          >
            Trip
          </Button>
        </Box>

        {/* Summary */}
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body1" sx={{ mb: 0.5 }}>
            All Expenses: {totalAmount.toFixed(2)} {expenses[0]?.currency || currentTrip?.currency || 'EUR'}
          </Typography>
          <Typography variant="body1">
            Expenses by Payment Method: Cash {totalCash.toFixed(2)} + Card {totalCard.toFixed(2)}
          </Typography>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {sortedExpenses.length === 0 ? (
            <Alert severity="info">No expenses recorded for this trip yet.</Alert>
          ) : (
            <Box>
              {sortedExpenses.map(renderExpenseCard)}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {Object.keys(expensesByCategory).length === 0 ? (
            <Alert severity="info">No expenses recorded for this trip yet.</Alert>
          ) : (
            <Box>
              {Object.entries(expensesByCategory).map(([category, categoryExpenses]) => (
                <Box key={category} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 2 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                      {category}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      Total: {getTotalAmount(categoryExpenses).toFixed(2)} {expenses[0]?.currency || currentTrip?.currency || 'EUR'}
                    </Typography>
                  </Box>
                  <Box>
                    {categoryExpenses.map(renderExpenseCard)}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ExpensesPage;
