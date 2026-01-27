import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { tripService } from '../services/tripService';
import type { Trip, TripPoint } from '../types/trip';
import TripForm from '../components/TripForm';
import TripPointForm from '../components/TripPointForm';
import TripPointSummary from '../components/TripPointSummary';
import { DateHelper } from '../utils/DateHelper';

const TripsPage = () => {
  const navigate = useNavigate();
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
    plannedCost: 0,
    totalCost: 0,
    currency: 'EUR',
    isDefault: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showTripPointForm, setShowTripPointForm] = useState(false);
  const [createdTripPoints, setCreatedTripPoints] = useState<TripPoint[]>([]);
  const [addAfterPointId, setAddAfterPointId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const trips = await tripService.getAll();
        if (trips.length > 0) {
          // Find the default trip, otherwise use the first trip
          const currentTrip = trips.find(t => t.isDefault) || trips[0];
          setTrip(currentTrip);
          setFormData({
            name: currentTrip.name,
            description: currentTrip.description || '',
            startDate: DateHelper.formatDateShort(currentTrip.startDate),
            endDate: currentTrip.endDate ? DateHelper.formatDateShort(currentTrip.endDate) : '',
            plannedCost: currentTrip.plannedCost || 0,
            totalCost: currentTrip.totalCost || 0,
            currency: currentTrip.currency || 'EUR',
            isDefault: currentTrip.isDefault || false,
          });
        }
      } catch (err) {
        setError('Failed to load trip. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Refetch when the route is focused (componentDidMount + visibility)
    fetchTrip();
    
    // Set up interval to refresh the trip data when returning to this page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTrip();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const formatDateRange = (startDate: string, endDate?: string) => {
    if (!endDate) {
      return `Starting ${DateHelper.formatDate(startDate)}`;
    }
    return `${DateHelper.formatDate(startDate)} - ${DateHelper.formatDate(endDate)}`;
  };

  const handleEdit = async (data: any) => {
    if (!trip) return;
    setSaving(true);
    setFormErrors({});
    try {
      const transformTripPointsForBackend = (tripPoints: any[]) => {
        if (!tripPoints) return [];
        const sorted = [...tripPoints].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const idToOrder = new Map<number, number>();
        sorted.forEach((tp, idx) => idToOrder.set(tp.tripPointId, idx));
        return sorted.map((tp: any, idx: number) => ({
          name: tp.name || '',
          order: idx,
          arrivalDate: tp.arrivalDate || tp.arrival || null,
          departureDate: tp.departureDate || tp.departure || null,
          notes: tp.notes || undefined,
          accommodations: (tp.accommodations || []).map((a: any) => ({
            name: a.name || '',
            accommodationType: a.accommodationType,
            address: a.address || undefined,
            checkInDate: a.checkInDate || a.checkIn || null,
            checkOutDate: a.checkOutDate || a.checkOut || null,
            websiteUrl: a.websiteUrl || a.website || undefined,
            cost: a.cost !== undefined && a.cost !== null ? parseFloat(String(a.cost)) : undefined,
            status: a.status ?? 1,
            notes: a.notes || undefined,
          })),
          placesToVisit: (tp.placesToVisit || []).map((p: any, i: number) => ({
            name: p.name || '',
            category: p.category ?? 8,
            address: p.address || undefined,
            description: p.description || undefined,
            price: p.price ?? undefined,
            websiteUrl: p.websiteUrl || undefined,
            usefulLinks: p.usefulLinks || undefined,
            order: p.order ?? i,
            rating: p.rating ?? undefined,
            visitDate: p.visitDate || undefined,
            visitStatus: p.visitStatus ?? 1,
            afterVisitNotes: p.afterVisitNotes || undefined,
          })),
          routes: (tp.routesFrom || []).map((r: any) => ({
            fromPointOrder: idToOrder.get(r.fromPointId) ?? idToOrder.get(tp.tripPointId) ?? 0,
            toPointOrder: idToOrder.get(r.toPointId) ?? 0,
            name: r.name || '',
            transportationType: r.transportationType ?? r.transportationTypeId ?? 1,
            carrier: r.carrier || undefined,
            departureTime: r.departureTime || undefined,
            arrivalTime: r.arrivalTime || undefined,
            durationMinutes: r.durationMinutes !== undefined && r.durationMinutes !== null ? parseInt(String(r.durationMinutes), 10) : undefined,
            cost: r.cost !== undefined && r.cost !== null ? parseFloat(String(r.cost)) : undefined,
            isSelected: !!r.isSelected,
            notes: r.notes || undefined,
          })),
        }));
      };

      const updateData = {
        ...data,
        plannedCost: data.plannedCost ? parseFloat(data.plannedCost) : undefined,
        totalCost: data.totalCost ? parseFloat(data.totalCost) : undefined,
      };
      if (data && Array.isArray(data.tripPoints)) {
        updateData.tripPoints = transformTripPointsForBackend(data.tripPoints);
      }
      const updatedTrip = await tripService.update(trip.tripId.toString(), updateData);
      setTrip(updatedTrip);
      setFormData({
        name: updatedTrip.name,
        description: updatedTrip.description || '',
        startDate: DateHelper.formatDateShort(updatedTrip.startDate),
        endDate: updatedTrip.endDate ? DateHelper.formatDateShort(updatedTrip.endDate) : '',
        plannedCost: updatedTrip.plannedCost || 0,
        totalCost: updatedTrip.totalCost || 0,
        currency: updatedTrip.currency || 'EUR',
        isDefault: updatedTrip.isDefault || false,
      });
      setIsEditing(false);
      setError(null);
    } catch (err) {
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
        startDate: DateHelper.formatDateShort(trip.startDate),
        endDate: trip.endDate ? DateHelper.formatDateShort(trip.endDate) : '',
        plannedCost: trip.plannedCost || 0,
        totalCost: trip.totalCost || 0,
        currency: trip.currency || 'EUR',
        isDefault: trip.isDefault || false,
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

  if (!trip) {
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
      <Paper elevation={3} sx={{ p: 4 }}>
        {isEditing ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h1">Edit Trip</Typography>
              <Button
                variant="text"
                size="small"
                onClick={handleCancelEdit}
                sx={{ textTransform: 'none', fontWeight: 500, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
              >Cancel</Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TripForm
              initialData={formData}
              loading={saving}
              errors={formErrors}
              onSubmit={handleEdit}
              onCancel={handleCancelEdit}
            />
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h1">
                {trip.name}
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
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </Typography>
                </Box>

                {trip.totalCost && (
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
                    {trip.isCompleted ? '✓ Completed' : '○ In Progress'}
                  </Typography>
                </Box>
              </Box>

              {trip.description && (
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
                {((trip.tripPoints?.length || 0) + createdTripPoints.length) === 0 && (
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
                onAddRoute={() => {}}
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
