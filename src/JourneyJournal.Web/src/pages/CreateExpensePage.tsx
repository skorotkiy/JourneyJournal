
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { tripService } from '../services/tripService';
import ExpenseForm from '../components/ExpenseForm';
import type { Trip } from '../types/trip';

const CreateExpensePage = () => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentTrip = async () => {
      try {
        const trips = await tripService.getAll();
        const defaultTrip = trips.find(t => !t.isCompleted) || trips[0];
        if (defaultTrip) {
          const fullTrip = await tripService.getById(defaultTrip.tripId.toString());
          setCurrentTrip(fullTrip);
        }
      } catch (err) {
        setError('Failed to load trip data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentTrip();
  }, []);

  const handleCreate = async (_expense: any) => {
    navigate('/');
  };

  const handleCancel = () => navigate('/');

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
      <Paper elevation={3} sx={{ px: 4, pt: 2, pb: 2, mt: 2 }}>
        <Typography
          variant="subtitle1"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: '#1976d2', mb: 1, fontSize: '1.05rem' }}
        >
          {currentTrip ? `Add expense to ${currentTrip.name}` : 'Add Expense'}
        </Typography>
        <ExpenseForm
          tripId={currentTrip.tripId}
          onSuccess={handleCreate}
          onCancel={handleCancel}
        />
      </Paper>
    </Box>
  );
};

export default CreateExpensePage;
