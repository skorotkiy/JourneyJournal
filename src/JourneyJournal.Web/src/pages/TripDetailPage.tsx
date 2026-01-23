import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { tripService } from '../services/tripService';
import type { Trip, TripPoint } from '../types/trip';
import type { Expense } from '../types/expense';
import TripPointForm from '../components/TripPointForm';
import TripPointSummary from '../components/TripPointSummary';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseView from '../components/ExpenseView';

const TripDetailPage = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const [searchParams] = useSearchParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    plannedCost: '',
    totalCost: '',
    currency: 'EUR',
    isCompleted: false,
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showTripPointForm, setShowTripPointForm] = useState(false);
  const [createdTripPoints, setCreatedTripPoints] = useState<TripPoint[]>([]);
  const [addAfterPointId, setAddAfterPointId] = useState<number | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseSuccess, setExpenseSuccess] = useState(false);
  const [newExpense, setNewExpense] = useState<Expense | null>(null);
  const [showDefaultWarningDialog, setShowDefaultWarningDialog] = useState(false);
  const [existingDefaultTrip, setExistingDefaultTrip] = useState<Trip | null>(null);
  const [defaultValueSnapshot, setDefaultValueSnapshot] = useState(false);

  // Helper function to transform trip points for backend
  const transformTripPointsForBackend = (tripPoints: TripPoint[]) => {
    return tripPoints.map(tp => ({
      name: tp.name,
      order: tp.order,
      arrivalDate: tp.arrivalDate.split('T')[0],
      departureDate: tp.departureDate.split('T')[0],
      notes: tp.notes,
      accommodations: (tp.accommodations || []).map(acc => ({
        name: acc.name,
        accommodationType: acc.accommodationType,
        address: acc.address,
        checkInDate: acc.checkInDate.split('T')[0],
        checkOutDate: acc.checkOutDate.split('T')[0],
        websiteUrl: acc.websiteUrl,
        cost: acc.cost,
        status: acc.status,
        notes: acc.notes,
      })),
      routes: (tp.routesFrom || []).map(route => {
        const toPoint = tripPoints.find(p => p.tripPointId === route.toPointId);
        return {
          fromPointOrder: tp.order,
          toPointOrder: toPoint?.order || tp.order + 1,
          name: route.name,
          transportationType: route.transportationType,
          carrier: route.carrier,
          departureTime: route.departureTime ? new Date(route.departureTime).toISOString() : undefined,
          arrivalTime: route.arrivalTime ? new Date(route.arrivalTime).toISOString() : undefined,
          durationMinutes: route.durationMinutes,
          cost: route.cost,
          isSelected: route.isSelected,
          notes: route.notes,
        };
      }),
      placesToVisit: [],
    }));
  };

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) {
        setError('Trip ID is required');
        setLoading(false);
        return;
      }

      try {
        const data = await tripService.getById(tripId);
        setTrip(data);
        setFormData({
          name: data.name,
          description: data.description || '',
          startDate: data.startDate.split('T')[0],
          endDate: data.endDate ? data.endDate.split('T')[0] : '',
          plannedCost: data.plannedCost?.toString() || '',
          totalCost: data.totalCost?.toString() || '',
          currency: data.currency || 'EUR',
          isCompleted: data.isCompleted,
          isDefault: data.isDefault,
        });
        setDefaultValueSnapshot(data.isDefault);
        
        // Check if we should show the expense form
        if (searchParams.get('showExpense') === 'true') {
          setShowExpenseForm(true);
        }
      } catch (err) {
        console.error('Failed to fetch trip:', err);
        setError('Failed to load trip. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, searchParams]);

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
    const { name, value, type, checked } = e.target;

    // Handle completion toggle: disable default and clear it, but keep original to restore
    if (name === 'isCompleted' && type === 'checkbox') {
      if (checked) {
        setDefaultValueSnapshot(formData.isDefault);
        setFormData((prev) => ({
          ...prev,
          isCompleted: true,
          isDefault: false,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          isCompleted: false,
          isDefault: defaultValueSnapshot,
        }));
      }
      return;
    }
    
    // Handle default checkbox specially
    if (name === 'isDefault' && type === 'checkbox' && checked) {
      handleDefaultCheckboxChange();
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDefaultCheckboxChange = async () => {
    try {
      const allTrips = await tripService.getAll();
      const currentDefault = allTrips.find(t => t.isDefault && t.tripId !== trip?.tripId);
      
      if (currentDefault) {
        setExistingDefaultTrip(currentDefault);
        setShowDefaultWarningDialog(true);
      } else {
        // No existing default trip, can proceed
        setFormData((prev) => ({
          ...prev,
          isDefault: true,
        }));
      }
    } catch (err) {
      console.error('Failed to check default trips:', err);
      setFormErrors({ submit: 'Failed to verify default trip. Please try again.' });
    }
  };

  const handleConfirmDefaultChange = () => {
    setFormData((prev) => ({
      ...prev,
      isDefault: true,
    }));
    setShowDefaultWarningDialog(false);
    setExistingDefaultTrip(null);
  };

  const handleCancelDefaultChange = () => {
    setShowDefaultWarningDialog(false);
    setExistingDefaultTrip(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Trip name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (
      formData.endDate &&
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = 'End date must be after start date';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !trip) {
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        plannedCost: formData.plannedCost ? parseFloat(formData.plannedCost) : undefined,
        totalCost: formData.totalCost ? parseFloat(formData.totalCost) : undefined,
        isDefault: formData.isDefault,
        tripPoints: transformTripPointsForBackend(trip.tripPoints || []), // Transform trip points
      };
      const updatedTrip = await tripService.update(trip.tripId.toString(), updateData);
      setTrip(updatedTrip);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Failed to update trip:', err);
      setFormErrors({ submit: 'Failed to update trip. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (trip) {
      setFormData({
        name: trip.name,
        description: trip.description || '',
        startDate: trip.startDate.split('T')[0],
        endDate: trip.endDate ? trip.endDate.split('T')[0] : '',
        plannedCost: trip.plannedCost?.toString() || '',
        totalCost: trip.totalCost?.toString() || '',
        currency: trip.currency || 'EUR',
        isCompleted: trip.isCompleted,
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
        <Button variant="contained" onClick={() => navigate('/trips')} size="small" sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}>
          Back to Trips
        </Button>
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Trip not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/trips')} size="small" sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}>
          Back to Trips
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
      {isEditing ? (
        <>
          <Paper elevation={3} sx={{ p: 3 }}>
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
                  disabled={formData.isCompleted}
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
                    sx={{ flex: 1 }}
                    disabled={formData.isCompleted}
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
                    sx={{ flex: 1 }}
                    disabled={formData.isCompleted}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Budget"
                    name="plannedCost"
                    type="number"
                    value={formData.plannedCost}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 0.01 }}
                    placeholder="Optional"
                    sx={{ flex: 1 }}
                    disabled={formData.isCompleted}
                  />

                  <TextField
                    label="Spent"
                    name="totalCost"
                    type="number"
                    value={formData.totalCost}
                    onChange={handleChange}
                    inputProps={{ min: 0, step: 0.01 }}
                    placeholder="Optional"
                    sx={{ flex: 1 }}
                    disabled={formData.isCompleted}
                  />

                  <TextField
                    label="Currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    inputProps={{ maxLength: 3 }}
                    placeholder="EUR"
                    sx={{ width: '90px' }}
                    disabled={formData.isCompleted}
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
                  disabled={formData.isCompleted}
                />

                <Box sx={{ mt: -1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isCompleted"
                        checked={formData.isCompleted}
                        onChange={handleChange}
                      />
                    }
                    label="Complete"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        disabled={formData.isCompleted}
                      />
                    }
                    label="Default"
                  />
                </Box>

                {formErrors.submit && <Alert severity="error">{formErrors.submit}</Alert>}

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    pt: 1,
                    borderTop: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Button variant="outlined" onClick={handleCancelEdit} disabled={saving} size="small" sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}>
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
          </Paper>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" component="h1">
                {trip.name}
              </Typography>
              {trip.isDefault && (
                <Chip
                  icon={<StarIcon />}
                  label="Default"
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 'medium' }}
                />
              )}
            </Box>
            <Button variant="text" size="small" onClick={() => navigate('/trips')} sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}>
              Back to Trips
            </Button>
          </Box>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Dates
                  </Typography>
                  <Typography variant="body2">
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Budget
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {trip.plannedCost ? `${trip.plannedCost.toLocaleString()} ${trip.currency || 'EUR'}` : '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Spent
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {trip.totalCost ? `${trip.totalCost.toLocaleString()} ${trip.currency || 'EUR'}` : '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Status
                  </Typography>
                  <Chip
                    size="small"
                    label={trip.isCompleted ? 'Completed' : 'In Progress'}
                    color={trip.isCompleted ? 'success' : 'default'}
                    sx={{ borderRadius: 1, fontWeight: 600 }}
                  />
                </Box>
              </Box>

              {trip.description && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Description
                  </Typography>
                  <Typography variant="body2">{trip.description}</Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'space-between',
                  pt: 1,
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setShowTripPointForm(!showTripPointForm)}
                  disabled={trip.isCompleted}
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
                  {showTripPointForm ? 'Cancel' : '+ Add Trip Point'}
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setShowExpenseForm(!showExpenseForm)}
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
                  {showExpenseForm ? 'Cancel' : '+ Add Expense'}
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setIsEditing(true)}
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
                  Edit Trip
                </Button>
              </Box>
            </Stack>
          </Paper>
        </>
      )}

      {!isEditing && showTripPointForm && trip && (
        <TripPointForm
          tripId={trip.tripId}
          nextOrder={(trip.tripPoints?.length || 0) + createdTripPoints.length}
          onCancel={() => setShowTripPointForm(false)}
          onSuccess={async (newTripPoint) => {
            try {
              // Update trip with new trip point
              const updatedTripData = {
                name: trip.name,
                description: trip.description,
                startDate: trip.startDate.split('T')[0],
                endDate: trip.endDate ? trip.endDate.split('T')[0] : undefined,
                plannedCost: trip.plannedCost,
                totalCost: trip.totalCost,
                currency: trip.currency,
                isCompleted: trip.isCompleted,
                isDefault: trip.isDefault,
                tripPoints: [...(trip.tripPoints || []), newTripPoint],
              };
              const updatedTrip = await tripService.update(trip.tripId.toString(), updatedTripData);
              setTrip(updatedTrip);
              setCreatedTripPoints([]);
              setShowTripPointForm(false);
            } catch (err) {
              console.error('Failed to save trip point:', err);
              setError('Failed to save trip point. Please try again.');
            }
          }}
        />
      )}

      {!isEditing && showExpenseForm && !expenseSuccess && trip && (
        <>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, mt: 3 }}>
            Add expense to "{trip.name}" trip
          </Typography>
          <Paper elevation={3} sx={{ p: 3 }}>
            <ExpenseForm
              tripId={trip.tripId}
              tripName={trip.name}
              onCancel={() => setShowExpenseForm(false)}
              onSuccess={(expense) => {
                setNewExpense(expense);
                setExpenseSuccess(true);
                setShowExpenseForm(false);
              }}
            />
          </Paper>
        </>
      )}

      {!isEditing && expenseSuccess && newExpense && trip && (
        <Paper elevation={3} sx={{ p: 3, mt: 3, bgcolor: 'success.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <CheckCircleIcon color="success" sx={{ mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="success.dark" gutterBottom>
                Expense Added Successfully!
              </Typography>
              <Typography variant="body2" color="success.dark" sx={{ mb: 2 }}>
                Your expense "{newExpense.description}" has been added to the trip.
              </Typography>
              <ExpenseView expense={newExpense} currency={trip.currency} />
            </Box>
            <IconButton
              size="small"
              onClick={() => {
                setExpenseSuccess(false);
                setNewExpense(null);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {!isEditing && trip.tripPoints && trip.tripPoints.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {trip.tripPoints.map((tripPoint, index) => (
            <Box key={tripPoint.tripPointId}>
              <TripPointSummary
                tripPoint={tripPoint}
                onEdit={async (updatedTripPoint) => {
                  try {
                    const updatedTripPoints = (trip.tripPoints || []).map((tp) =>
                      tp.tripPointId === updatedTripPoint.tripPointId ? updatedTripPoint : tp
                    );

                    const updatedTripData = {
                      name: trip.name,
                      description: trip.description,
                      startDate: trip.startDate.split('T')[0],
                      endDate: trip.endDate ? trip.endDate.split('T')[0] : undefined,
                      plannedCost: trip.plannedCost,
                      totalCost: trip.totalCost,
                      currency: trip.currency,
                      isCompleted: trip.isCompleted,
                      isDefault: trip.isDefault,
                      tripPoints: transformTripPointsForBackend(updatedTripPoints),
                    };
                    const updatedTrip = await tripService.update(trip.tripId.toString(), updatedTripData);
                    setTrip(updatedTrip);
                  } catch (err) {
                    console.error('Failed to update trip point:', err);
                    setError('Failed to update trip point. Please try again.');
                  }
                }}
                onRemove={async () => {
                  try {
                    // Filter out the deleted trip point
                    const filteredTripPoints = (trip.tripPoints || [])
                      .filter((tp) => tp.tripPointId !== tripPoint.tripPointId)
                      .map((tp, index) => ({
                        ...tp,
                        order: index, // Reorder remaining points
                        // Remove routes that reference the deleted trip point
                        routesFrom: (tp.routesFrom || []).filter(
                          (route) => route.toPointId !== tripPoint.tripPointId
                        ),
                      }));
                    
                    const updatedTripData = {
                      name: trip.name,
                      description: trip.description,
                      startDate: trip.startDate.split('T')[0],
                      endDate: trip.endDate ? trip.endDate.split('T')[0] : undefined,
                      plannedCost: trip.plannedCost,
                      totalCost: trip.totalCost,
                      currency: trip.currency,
                      isCompleted: trip.isCompleted,
                      isDefault: trip.isDefault,
                      tripPoints: transformTripPointsForBackend(filteredTripPoints),
                    };
                    const updatedTrip = await tripService.update(trip.tripId.toString(), updatedTripData);
                    setTrip(updatedTrip);
                  } catch (err) {
                    console.error('Failed to remove trip point:', err);
                    setError('Failed to remove trip point. Please try again.');
                  }
                }}
                onAddRoute={() => console.log('Add route for:', tripPoint.tripPointId)}
                onAddNextPoint={() => {
                  setAddAfterPointId(tripPoint.tripPointId);
                  setShowTripPointForm(false);
                }}
                hasNextPoint={index < (trip.tripPoints || []).length - 1}
                nextPointId={
                  index < (trip.tripPoints || []).length - 1 ? (trip.tripPoints || [])[index + 1].tripPointId : undefined
                }
                nextPointName={
                  index < (trip.tripPoints || []).length - 1 ? (trip.tripPoints || [])[index + 1].name : ''
                }
                nextPointArrivalDate={
                  index < (trip.tripPoints || []).length - 1 ? (trip.tripPoints || [])[index + 1].arrivalDate : undefined
                }
              />
              {addAfterPointId === tripPoint.tripPointId && trip && (
                <TripPointForm
                  tripId={trip.tripId}
                  nextOrder={tripPoint.order + 1}
                  onCancel={() => setAddAfterPointId(null)}
                  onSuccess={async (newTripPoint) => {
                    try {
                      // Insert new trip point and reorder
                      const updatedTripPoints = [...(trip.tripPoints || [])];
                      const insertIndex = updatedTripPoints.findIndex(tp => tp.tripPointId === tripPoint.tripPointId) + 1;
                      updatedTripPoints.splice(insertIndex, 0, newTripPoint);
                      
                      // Reorder all points
                      updatedTripPoints.forEach((tp, idx) => {
                        tp.order = idx;
                      });

                      const updatedTripData = {
                        name: trip.name,
                        description: trip.description,
                        startDate: trip.startDate.split('T')[0],
                        endDate: trip.endDate ? trip.endDate.split('T')[0] : undefined,
                        plannedCost: trip.plannedCost,
                        totalCost: trip.totalCost,
                        currency: trip.currency,
                        isCompleted: trip.isCompleted,
                        isDefault: trip.isDefault,
                        tripPoints: updatedTripPoints,
                      };
                      const updatedTrip = await tripService.update(trip.tripId.toString(), updatedTripData);
                      setTrip(updatedTrip);
                      setAddAfterPointId(null);
                    } catch (err) {
                      console.error('Failed to add trip point:', err);
                      setError('Failed to add trip point. Please try again.');
                    }
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}

      {!isEditing && createdTripPoints.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {createdTripPoints.map((tripPoint, index) => (
            <Box key={tripPoint.tripPointId}>
              <TripPointSummary
                tripPoint={tripPoint}
                onEdit={(updatedTripPoint) => {
                  setCreatedTripPoints((prev) =>
                    prev.map((tp) =>
                      tp.tripPointId === updatedTripPoint.tripPointId ? updatedTripPoint : tp
                    )
                  );
                }}
                onRemove={() => {
                  setCreatedTripPoints((prev) =>
                    prev.filter((tp) => tp.tripPointId !== tripPoint.tripPointId)
                  );
                }}
                onAddRoute={() => console.log('Add route for:', tripPoint.tripPointId)}
                onAddNextPoint={() => {
                  setAddAfterPointId(tripPoint.tripPointId);
                  setShowTripPointForm(false);
                }}
                hasNextPoint={index < createdTripPoints.length - 1}
                nextPointId={
                  index < createdTripPoints.length - 1 ? createdTripPoints[index + 1].tripPointId : undefined
                }
                nextPointName={
                  index < createdTripPoints.length - 1 ? createdTripPoints[index + 1].name : ''
                }
                nextPointArrivalDate={
                  index < createdTripPoints.length - 1 ? createdTripPoints[index + 1].arrivalDate : undefined
                }
              />
              {addAfterPointId === tripPoint.tripPointId && trip && (
                <TripPointForm
                  tripId={trip.tripId}
                  nextOrder={(trip.tripPoints?.length || 0) + createdTripPoints.length}
                  onCancel={() => setAddAfterPointId(null)}
                  onSuccess={(newTripPoint) => {
                    setCreatedTripPoints((prev) => [...prev, newTripPoint]);
                    setAddAfterPointId(null);
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Default Trip Warning Dialog */}
      <Dialog open={showDefaultWarningDialog} onClose={handleCancelDefaultChange} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Change Default Trip?</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2">
            Setting this trip as default will remove the default status from the {existingDefaultTrip?.name ?? 'current default'} trip.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={handleCancelDefaultChange} size="small" sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={handleConfirmDefaultChange} size="small" sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}>
            Set
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TripDetailPage;
