import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
} from '@mui/material';
import { tripService } from '../services/tripService';
import type { Trip } from '../types/trip';
import { DateHelper } from '../utils/DateHelper';

const TripListPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAll();
        setTrips(data);
      } catch (err) {
        console.error('Failed to fetch trips:', err);
        setError('Failed to load trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = DateHelper.formatDate(startDate);
    if (!endDate) return start || '';
    const end = DateHelper.formatDate(endDate);
    return `${start} - ${end}`;
  };

  const handleTripClick = (tripId: number) => {
    navigate(`/trips/${tripId}`);
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
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (trips.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No trips yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start planning your next adventure!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/trips/create')}>
            Create Your First Trip
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Trips
        </Typography>
      </Box>

      <Paper elevation={3}>
        <List sx={{ p: 0 }}>
          {trips.map((trip, index) => (
            <ListItem
              key={trip.tripId}
              disablePadding
              sx={{
                borderBottom: index < trips.length - 1 ? 1 : 0,
                borderColor: 'divider',
              }}
            >
              <ListItemButton
                onClick={() => handleTripClick(trip.tripId)}
                sx={{ py: 2, px: 3 }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" component="span">
                        {trip.name}
                      </Typography>
                      <Chip
                        label={trip.isCompleted ? 'Completed' : 'In Progress'}
                        size="small"
                        color={trip.isCompleted ? 'success' : 'primary'}
                        sx={{ fontSize: '0.7rem', height: '22px' }}
                      />
                      {trip.isDefault && (
                        <Chip
                          label="Default"
                          size="small"
                          color="warning"
                          icon={<span>⭐</span>}
                          sx={{ fontSize: '0.7rem', height: '22px' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TripListPage;
