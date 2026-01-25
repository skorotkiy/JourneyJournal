import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { tripService } from '../services/tripService';
import type { Trip } from '../types/trip';
import type { Expense } from '../types/expense';
import ExpenseForm from '../components/ExpenseForm';

const EditExpensePage = () => {
  const navigate = useNavigate();
  const { tripId, expenseId } = useParams<{ tripId: string; expenseId: string }>();
  const [searchParams] = useSearchParams();
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabParam = searchParams.get('tab') || '0';

  useEffect(() => {
    const fetchData = async () => {
      if (!tripId || !expenseId) {
        setError('Invalid trip or expense ID');
        setLoading(false);
        return;
      }

      try {
        const trip = await tripService.getById(tripId);
        setCurrentTrip(trip);

        const expenseData = trip.expenses?.find(e => e.expenseId.toString() === expenseId);
        if (!expenseData) {
          setError('Expense not found');
          return;
        }
        setExpense(expenseData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load expense data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, expenseId]);

  const handleEditSuccess = (_updatedExpense: Expense) => {
    // Navigate back to expenses page with the correct tab
    navigate(`/expenses?tab=${tabParam}`);
  };

  const handleCancel = () => {
    navigate(`/expenses?tab=${tabParam}`);
  };

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
        <Button variant="contained" onClick={() => navigate('/expenses')}>
          Back to Expenses
        </Button>
      </Box>
    );
  }

  if (!currentTrip || !expense) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Expense data not available.
        </Alert>
        <Button variant="contained" onClick={() => navigate(`/expenses?tab=${tabParam}`)}>
          Back to Expenses
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
      <Typography
        variant="subtitle1"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 600, color: '#1976d2', mb: 1, fontSize: '1.05rem' }}
      >
        Edit expense in "{currentTrip.name}" trip
      </Typography>
      <Paper elevation={3} sx={{ px: 4, pt: 2, pb: 2, mt: 2 }}>
        <ExpenseForm
          tripId={currentTrip.tripId}
          initialData={expense}
          onSuccess={handleEditSuccess}
          onCancel={handleCancel}
        />
      </Paper>
    </Box>
  );
};

export default EditExpensePage;