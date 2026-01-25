import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { tripService } from '../services/tripService';
import type { Trip, TripPoint } from '../types/trip';
import TripPointForm from '../components/TripPointForm';
import TripPointSummary from '../components/TripPointSummary';


const TripsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams<{ tripId?: string }>();
  const isCreateMode = window.location.pathname === '/trips/create';
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(isCreateMode);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    plannedCost: '',
    totalCost: '',
    currency: 'EUR',
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showTripPointForm, setShowTripPointForm] = useState(false);
  const [createdTripPoints, setCreatedTripPoints] = useState<TripPoint[]>([]);
  const [addAfterPointId, setAddAfterPointId] = useState<number | null>(null);


  useEffect(() => {
    const fetchTrip = async () => {
      if (isCreateMode) {
        setTrip(null);
        setFormData({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          plannedCost: '',
          totalCost: '',
          currency: 'EUR',
          isDefault: false,
        });
        setLoading(false);
        return;
      }
      try {
        let tripData: Trip | null = null;
        if (params.tripId) {
          tripData = await tripService.getById(params.tripId);
        } else {
          const trips = await tripService.getAll();
          if (trips.length > 0) {
            tripData = trips.find(t => t.isDefault) || trips[0];
          }
        }
        if (tripData) {
          setTrip(tripData);
          setFormData({
            name: tripData.name,
            description: tripData.description || '',
            startDate: tripData.startDate.split('T')[0],
            endDate: tripData.endDate ? tripData.endDate.split('T')[0] : '',
            plannedCost: tripData.plannedCost?.toString() || '',
            totalCost: tripData.totalCost?.toString() || '',
            currency: tripData.currency || 'EUR',
            isDefault: tripData.isDefault,
          });
        }
      } catch (err) {
        console.error('Failed to fetch trip:', err);
        setError('Failed to load trip. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
    // eslint-disable-next-line
  }, [isCreateMode, params.tripId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    if (!endDate) {
      return `Starting ${formatDate(startDate)}`;
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Trip name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setSaving(true);
    try {
      if (isCreateMode) {
        const tripData = {
          ...formData,
          plannedCost: formData.plannedCost ? parseFloat(formData.plannedCost) : undefined,
          totalCost: formData.totalCost ? parseFloat(formData.totalCost) : undefined,
        };
        const newTrip = await tripService.create(tripData);
        setTrip(newTrip);
        setIsEditing(false);
        setError(null);
        navigate('/trips');
      } else if (trip) {
        const updateData = {
          ...formData,
          plannedCost: formData.plannedCost ? parseFloat(formData.plannedCost) : undefined,
          totalCost: formData.totalCost ? parseFloat(formData.totalCost) : undefined,
        };
        const updatedTrip = await tripService.update(trip.tripId.toString(), updateData);
        setTrip(updatedTrip);
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to save trip:', err);
      setFormErrors({ submit: 'Failed to save trip. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (isCreateMode) {
      navigate('/');
      return;
    }
    if (trip) {
      setFormData({
        name: trip.name,
        description: trip.description || '',
        startDate: trip.startDate.split('T')[0],
        endDate: trip.endDate ? trip.endDate.split('T')[0] : '',
        plannedCost: trip.plannedCost?.toString() || '',
        totalCost: trip.totalCost?.toString() || '',
        currency: trip.currency || 'EUR',
        isDefault: trip.isDefault,
      });
    }
    setFormErrors({});
    setIsEditing(false);
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
        <Button 
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!trip && !isCreateMode) {
    return (
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No trips yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start planning your next adventure!
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/trips/create')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Create Your First Trip
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {isEditing ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h1">
                {isCreateMode ? 'Create Trip' : 'Edit Trip'}
              </Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={handleCancelEdit}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  required
                  fullWidth
                  label="Trip Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  inputProps={{ maxLength: 200 }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    required
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    error={!!formErrors.startDate}
                    helperText={formErrors.startDate}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: '180px' }}
                  />
                  <TextField
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    error={!!formErrors.endDate}
                    helperText={formErrors.endDate}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: '180px' }}
                  />
                  <TextField
                    label="Budget"
                    name="plannedCost"
                    type="number"
                    value={formData.plannedCost}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 0.01 }}
                    placeholder="Budget"
                    sx={{ width: '120px' }}
                  />
                  <TextField
                    label="Spent"
                    name="totalCost"
                    type="number"
                    value={formData.totalCost}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 0.01 }}
                    placeholder="Actual"
                    sx={{ width: '120px' }}
                  />
                  <TextField
                    label="Currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    inputProps={{ maxLength: 3 }}
                    placeholder="EUR"
                    sx={{ width: '100px' }}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Describe your trip..."
                />
                <Box sx={{ mt: -1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                      />
                    }
                    label="Default"
                  />
                </Box>
                {formErrors.submit && (
                  <Alert severity="error">{formErrors.submit}</Alert>
                )}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    size="small"
                    sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={saving}
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
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h1">
                {trip ? trip.name : ''}
              </Typography>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => navigate('/')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                Back
              </Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Dates
                  </Typography>
                  <Typography variant="body2">
                    {trip ? formatDateRange(trip.startDate, trip.endDate) : ''}
                  </Typography>
                </Box>

                {trip && trip.totalCost && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Budget
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {trip.totalCost.toLocaleString()} {trip.currency || 'EUR'}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Status
                  </Typography>
                  <Typography variant="body2">
                    {trip ? (trip.isCompleted ? '✓ Completed' : '○ In Progress') : ''}
                  </Typography>
                </Box>
              </Box>

              {trip && trip.description && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Description
                  </Typography>
                  <Typography variant="body2">
                    {trip.description}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                {(trip && ((trip.tripPoints?.length || 0) + createdTripPoints.length) === 0) && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowTripPointForm(!showTripPointForm)}
                  >
                    {showTripPointForm ? 'Cancel' : 'Add Trip Point'}
                  </Button>
                )}
                <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/')}
                  >
                    Home
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Trip
                  </Button>
                </Box>
              </Box>
            </Stack>
          </>
        )}
      </Paper>

      {!isEditing && showTripPointForm && trip && (
        <TripPointForm
          tripId={trip.tripId}
          onCancel={() => setShowTripPointForm(false)}
          onSuccess={(newTripPoint) => {
            setCreatedTripPoints(prev => [...prev, newTripPoint]);
            setShowTripPointForm(false);
          }}
        />
      )}

      {!isEditing && createdTripPoints.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {createdTripPoints.map((tripPoint, index) => (
            <Box key={tripPoint.tripPointId}>
              <TripPointSummary
                tripPoint={tripPoint}
                onEdit={(updatedTripPoint) => {
                  setCreatedTripPoints(prev => 
                    prev.map(tp => tp.tripPointId === updatedTripPoint.tripPointId ? updatedTripPoint : tp)
                  );
                }}
                onRemove={() => {
                  setCreatedTripPoints(prev => 
                    prev.filter(tp => tp.tripPointId !== tripPoint.tripPointId)
                  );
                }}
                onAddRoute={() => console.log('Add route for:', tripPoint.tripPointId)}
                onAddNextPoint={() => {
                  setAddAfterPointId(tripPoint.tripPointId);
                  setShowTripPointForm(false);
                }}
                hasNextPoint={index < createdTripPoints.length - 1}
                nextPointName={index < createdTripPoints.length - 1 ? createdTripPoints[index + 1].name : ''}
              />
              {addAfterPointId === tripPoint.tripPointId && trip && (
                <TripPointForm
                  tripId={trip.tripId}
                  onCancel={() => setAddAfterPointId(null)}
                  onSuccess={(newTripPoint) => {
                    setCreatedTripPoints(prev => [...prev, newTripPoint]);
                    setAddAfterPointId(null);
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TripsPage;
