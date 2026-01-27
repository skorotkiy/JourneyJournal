import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { tripService } from '../services/tripService';
import type { Trip } from '../types/trip';
import { DateHelper } from '../utils/DateHelper';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        // Try to fetch trips to check if API is available
        await tripService.getAll();
        setApiAvailable(true);
        return true;
      } catch (error) {
        setApiAvailable(false);
        setLoading(false);
        return false;
      }
    };

    const fetchCurrentTrip = async () => {
      const isApiAvailable = await checkApiAvailability();
      if (!isApiAvailable) return;

      try {
        const trips = await tripService.getAll();
        // Get the default trip (IsDefault=true) or most recent incomplete trip
        const defaultTrip = trips.find(t => t.isDefault) || trips.find(t => !t.isCompleted) || trips[0];
        if (defaultTrip) {
          setCurrentTrip(defaultTrip);
        }
      } catch (error) {
        setApiAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTrip();
  }, []);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = DateHelper.formatDate(startDate);
    const end = DateHelper.formatDate(endDate);
    return `${start} - ${end}`;
  };

  const getTripTitle = () => {
    if (loading) return 'Loading...';
    if (currentTrip) {
      return `Manage your trip to ${currentTrip.name}`;
    }
    return 'Plan your journey';
  };

  const getTripDateRange = () => {
    if (!currentTrip) return '';
    const endDate = currentTrip.endDate || currentTrip.startDate;
    return formatDateRange(currentTrip.startDate, endDate);
  };

  const getTripButtonText = () => {
    return currentTrip ? 'VIEW TRIP' : 'CREATE TRIP';
  };

  const handleTripButtonClick = () => {
    if (currentTrip) {
      navigate(`/trips/${currentTrip.tripId}`);
    } else {
      navigate('/trips/create');
    }
  };

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      {!apiAvailable ? (
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Service Unavailable
          </Typography>
          <Typography variant="body2">
            Unable to connect to the service. Please check your connection and try again.
          </Typography>
        </Alert>
      ) : (
        <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, maxWidth: 300, width: '100%' }}>
            <FlightTakeoffIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {getTripTitle()}
            </Typography>
            {currentTrip && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {getTripDateRange()}
              </Typography>
            )}
            <Button variant="contained" onClick={handleTripButtonClick}>
              {getTripButtonText()}
            </Button>
          </Paper>

          <Paper elevation={3} sx={{ p: 4, maxWidth: 300, width: '100%' }}>
            <ReceiptIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {currentTrip ? `Add expense to ${currentTrip.name}` : 'Add Expense'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/expenses/create')}
              disabled={!currentTrip || currentTrip.isCompleted}
            >
              Add Expense
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
