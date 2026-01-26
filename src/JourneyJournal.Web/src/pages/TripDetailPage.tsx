
import TripForm from '../components/TripForm';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, Stack, CircularProgress, Alert, Chip, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TripPointForm from '../components/TripPointForm';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseView from '../components/ExpenseView';
import TripPointSummary from '../components/TripPointSummary';
import { tripService } from '../services/tripService';
import type { Trip } from '../types/trip';
import { DateHelper } from '../utils/DateHelper';



const TripDetailPage = () => {
    // State declarations for trip, error, loading, etc.
    const [trip, setTrip] = useState<Trip | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [backendUnavailable, setBackendUnavailable] = useState(false);
    const [backendErrorMessage, setBackendErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showTripPointForm, setShowTripPointForm] = useState(false);
    const [createdTripPoints, setCreatedTripPoints] = useState<any[]>([]);
    const [addAfterPointId, setAddAfterPointId] = useState<string | null>(null);
    const [newExpense, setNewExpense] = useState<any | null>(null);
    const [expenseSuccess, setExpenseSuccess] = useState(false);
    // Removed unused default trip dialog state
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const [searchParams] = useSearchParams();
  // Removed unused saving state for TripForm integration

  // Removed unused form state for TripForm integration

  // Helper function to convert frontend trip points into API CreateTripPointRequest shape,
  // ensuring routes include required fields and numeric types.
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
        // Removed setFormData and setDefaultValueSnapshot for TripForm integration
        
        // Check if we should show the expense form
        if (searchParams.get('showExpense') === 'true') {
          setShowExpenseForm(true);
        }
      } catch (err) {
        console.error('Failed to fetch trip:', err);
        // Detect network/backend connection issues (axios no response or network error)
        const anyErr = err as any;
        const isNetwork = anyErr && (anyErr.isAxiosError && !anyErr.response || (anyErr.message && /network|ECONNREFUSED|ENOTFOUND/i.test(anyErr.message)));
        if (isNetwork) {
          setBackendUnavailable(true);
          setBackendErrorMessage(anyErr.message || 'Unable to connect to backend');
        } else {
          setError('Failed to load trip. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId, searchParams]);

  const formatDateRange = (startDate: string, endDate?: string) => {
    if (!endDate) {
      return `Starting ${DateHelper.formatDate(startDate)}`;
    }
    return `${DateHelper.formatDate(startDate)} - ${DateHelper.formatDate(endDate)}`;
  };

  // Removed unused handleChange for TripForm integration

  // Removed unused handleDefaultCheckboxChange for TripForm integration

  // Removed unused handleConfirmDefaultChange for TripForm integration

  // Removed unused handleCancelDefaultChange for TripForm integration

  // Removed unused validate for TripForm integration

  // Removed unused handleSubmit for TripForm integration

  const handleCancelEdit = () => {
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

  if (backendUnavailable) {
    return (
      <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Alert severity="error">Unable to connect to the backend service. {backendErrorMessage ? `(${backendErrorMessage})` : ''}</Alert>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => { setLoading(true); setBackendUnavailable(false); setBackendErrorMessage(null); setError(null); const fetchTrip = async () => { if (!tripId) return; try { const data = await tripService.getById(tripId); setTrip(data); } catch (e) { const anyErr = e as any; const isNetwork = anyErr && (anyErr.isAxiosError && !anyErr.response || (anyErr.message && /network|ECONNREFUSED|ENOTFOUND/i.test(anyErr.message))); if (isNetwork) { setBackendUnavailable(true); setBackendErrorMessage(anyErr.message || 'Unable to connect to backend'); } else { setError('Failed to load trip. Please try again.'); } } finally { setLoading(false); } }; fetchTrip(); }}>
            Retry
          </Button>
          <Button variant="outlined" onClick={() => navigate('/trips')}>Back to Trips</Button>
        </Box>
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
        <Paper elevation={3} sx={{ px: 4, pt: 2, pb: 2, mt: 2 }}>
            <TripForm
            initialData={{
              ...trip,
              startDate: trip.startDate ? DateHelper.formatDateShort(trip.startDate) : '',
              endDate: trip.endDate ? DateHelper.formatDateShort(trip.endDate) : '',
            }}
            loading={false}
            errors={{}}
            onSubmit={async (updated: any) => {
              try {
                const payload = { ...updated };
                // Ensure tripPoints are transformed into backend shape
                if (updated && Array.isArray(updated.tripPoints)) {
                  payload.tripPoints = transformTripPointsForBackend(updated.tripPoints);
                } else {
                  payload.tripPoints = transformTripPointsForBackend(trip?.tripPoints || []);
                }
                // Log serialized payload for debugging
                // eslint-disable-next-line no-console
                console.debug('PUT /trips payload (trip edit):', JSON.stringify(payload, null, 2));
                const updatedTrip = await tripService.update(trip!.tripId.toString(), payload);
                setTrip(updatedTrip);
                setIsEditing(false);
                setError(null);
              } catch (err) {
                console.error('Failed to update trip:', err);
                setError('Failed to update trip. Please try again.');
              }
            }}
            onCancel={handleCancelEdit}
          />
        </Paper>
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

          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
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
                {showTripPointForm ? (
                  <Button
                    variant="contained"
                    fullWidth
                    disabled
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      py: 0.4,
                      px: 1.2,
                      backgroundColor: '#e3f2fd',
                      color: 'transparent',
                      border: '1px solid #90caf9',
                      visibility: 'hidden',
                    }}
                  >
                    Add Trip Point
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setShowTripPointForm(true)}
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
                    Add Trip Point
                  </Button>
                )}
                {showExpenseForm ? (
                  <Button
                    variant="contained"
                    fullWidth
                    disabled
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      py: 0.4,
                      px: 1.2,
                      backgroundColor: '#e3f2fd',
                      color: 'transparent',
                      border: '1px solid #90caf9',
                      visibility: 'hidden',
                    }}
                  >
                    Add Expense
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setShowExpenseForm(true)}
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
                    Add Expense
                  </Button>
                )}
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
          tripStartDate={trip.startDate ? DateHelper.formatDateShort(trip.startDate) : undefined}
          tripEndDate={trip.endDate ? DateHelper.formatDateShort(trip.endDate) : undefined}
          prevTripPointDepartureDate={trip.tripPoints && trip.tripPoints.length > 0 ? DateHelper.formatDateShort(trip.tripPoints[trip.tripPoints.length - 1].departureDate) : undefined}
          onCancel={() => setShowTripPointForm(false)}
          onSuccess={async (newTripPoint) => {
            try {
              // Update trip with new trip point
                      const updatedTripData = {
                        name: trip.name,
                        description: trip.description,
                        startDate: DateHelper.formatDateShort(trip.startDate),
                        endDate: trip.endDate ? DateHelper.formatDateShort(trip.endDate) : undefined,
                      plannedCost: trip.plannedCost,
                      totalCost: trip.totalCost,
                      currency: trip.currency,
                      isCompleted: trip.isCompleted,
                      isDefault: trip.isDefault,
                      tripPoints: transformTripPointsForBackend([...(trip.tripPoints || []), newTripPoint]),
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
        <Paper elevation={3} sx={{ px: 4, pt: 2, pb: 2, mt: 2 }}>
          <Typography
            variant="subtitle1"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 600, color: '#1976d2', mb: 1, fontSize: '1.05rem' }}
          >
            Add expense
          </Typography>
          <ExpenseForm
            tripId={trip.tripId}
            onCancel={() => setShowExpenseForm(false)}
            onSuccess={(expense) => {
              setNewExpense(expense);
              setExpenseSuccess(true);
              setShowExpenseForm(false);
            }}
          />
        </Paper>
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
                    // eslint-disable-next-line no-console
                    console.debug('TripDetailPage: updatedTripPoints (raw) before transform', JSON.stringify(updatedTripPoints, null, 2));
                    const updatedTripData = {
                      name: trip.name,
                      description: trip.description,
                      startDate: DateHelper.formatDateShort(trip.startDate),
                      endDate: trip.endDate ? DateHelper.formatDateShort(trip.endDate) : undefined,
                      plannedCost: trip.plannedCost,
                      totalCost: trip.totalCost,
                      currency: trip.currency,
                      isCompleted: trip.isCompleted,
                      isDefault: trip.isDefault,
                      tripPoints: transformTripPointsForBackend(updatedTripPoints),
                    };
                    // Log serialized payload for debugging
                    // eslint-disable-next-line no-console
                    console.debug('PUT /trips payload (update trip point):', JSON.stringify(updatedTripData, null, 2));
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
                      startDate: DateHelper.formatDateShort(trip.startDate),
                      endDate: trip.endDate ? DateHelper.formatDateShort(trip.endDate) : undefined,
                      plannedCost: trip.plannedCost,
                      totalCost: trip.totalCost,
                      currency: trip.currency,
                      isCompleted: trip.isCompleted,
                      isDefault: trip.isDefault,
                      tripPoints: transformTripPointsForBackend(filteredTripPoints),
                    };
                    // Log serialized payload for debugging
                    // eslint-disable-next-line no-console
                    console.debug('PUT /trips payload (remove trip point):', JSON.stringify(updatedTripData, null, 2));
                    const updatedTrip = await tripService.update(trip.tripId.toString(), updatedTripData);
                    setTrip(updatedTrip);
                  } catch (err) {
                    console.error('Failed to remove trip point:', err);
                    setError('Failed to remove trip point. Please try again.');
                  }
                }}
                onAddRoute={() => console.log('Add route for:', tripPoint.tripPointId)}
                onAddNextPoint={() => {
                  setAddAfterPointId(String(tripPoint.tripPointId));
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
                renderAddNextPointButton={() => (
                  addAfterPointId === String(tripPoint.tripPointId) || showTripPointForm ? (
                    <Button
                      variant="contained"
                      disabled
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        py: 0.4,
                        px: 1.2,
                        backgroundColor: '#e3f2fd',
                        color: 'transparent',
                        border: '1px solid #90caf9',
                        visibility: 'hidden',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setAddAfterPointId(String(tripPoint.tripPointId));
                        setShowTripPointForm(false);
                      }}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        py: 0.4,
                        px: 1.2,
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        '&:hover': { backgroundColor: '#bbdefb' },
                        border: '1px solid #90caf9',
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      Add Trip Point
                    </Button>
                  )
                )}
              />
              {addAfterPointId === String(tripPoint.tripPointId) && trip && (
                <Box sx={{ mb: 2 }}>
                  <TripPointForm
                    tripId={trip.tripId}
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
                          startDate: DateHelper.formatDateShort(trip.startDate),
                          endDate: trip.endDate ? DateHelper.formatDateShort(trip.endDate) : undefined,
                          plannedCost: trip.plannedCost,
                          totalCost: trip.totalCost,
                          currency: trip.currency,
                          isCompleted: trip.isCompleted,
                          isDefault: trip.isDefault,
                          tripPoints: transformTripPointsForBackend(updatedTripPoints),
                        };
                        // Log serialized payload for debugging
                        // eslint-disable-next-line no-console
                        console.debug('PUT /trips payload (insert trip point):', JSON.stringify(updatedTripData, null, 2));
                        const updatedTrip = await tripService.update(trip.tripId.toString(), updatedTripData);
                        setTrip(updatedTrip);
                        setAddAfterPointId(null);
                      } catch (err) {
                        console.error('Failed to add trip point:', err);
                        setError('Failed to add trip point. Please try again.');
                      }
                    }}
                  />
                </Box>
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

      {/* Removed Default Trip Warning Dialog for TripForm integration */}
    </Box>
  );
};

export default TripDetailPage;

// All code below this line is removed as unreachable/duplicate
