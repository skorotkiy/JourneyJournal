import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { EditOutlined as EditIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';
import type { TripPoint, Accommodation, Route } from '../types/trip';
import AccommodationForm from './AccommodationForm';
import AccommodationSummary from './AccommodationSummary';
import RouteForm from './RouteForm';
import RouteSummary from './RouteSummary';

interface TripPointSummaryProps {
  tripPoint: TripPoint;
  onEdit: (updatedTripPoint: TripPoint) => void;
  onRemove: () => void;
  onAddRoute: () => void;
  onAddNextPoint: () => void;
  hasNextPoint?: boolean;
  nextPointId?: number;
  nextPointName?: string;
  nextPointArrivalDate?: string;
  renderAddNextPointButton?: () => React.ReactNode;
}

const TripPointSummary = ({ tripPoint, onEdit, onRemove, onAddNextPoint, hasNextPoint = false, nextPointId, nextPointName = '', nextPointArrivalDate, renderAddNextPointButton }: TripPointSummaryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRouteWarning, setShowRouteWarning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAccommodationForm, setShowAccommodationForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [accommodations, setAccommodations] = useState<Accommodation[]>(tripPoint.accommodations || []);
  const [routes, setRoutes] = useState<Route[]>(tripPoint.routesFrom || []);
  const [formData, setFormData] = useState({
    name: tripPoint.name,
    arrivalDate: tripPoint.arrivalDate.split('T')[0],
    departureDate: tripPoint.departureDate.split('T')[0],
    notes: tripPoint.notes || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const accommodationFormRef = useRef<HTMLDivElement>(null);

  // Sync local state with prop changes
  useEffect(() => {
    setAccommodations(tripPoint.accommodations || []);
    setRoutes(tripPoint.routesFrom || []);
  }, [tripPoint]);

  // Scroll to accommodation form when it's shown
  useEffect(() => {
    if (showAccommodationForm && accommodationFormRef.current) {
      accommodationFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAccommodationForm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateRange = () => {
    const arrival = formatDate(tripPoint.arrivalDate);
    const departure = formatDate(tripPoint.departureDate);
    
    return ` (${arrival} - ${departure})`;
  };

  const handleRemoveClick = () => {
    // TODO: Check if there are routes linked to this trip point
    const hasRoutes = false; // Replace with actual check
    
    if (hasRoutes) {
      setShowRouteWarning(true);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setShowRouteWarning(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setShowRouteWarning(false);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      // TODO: Implement API call to delete trip point
      console.log('Deleting trip point:', tripPoint.tripPointId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShowDeleteConfirm(false);
      onRemove();
    } catch (error) {
      console.error('Failed to delete trip point:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: tripPoint.name,
      arrivalDate: tripPoint.arrivalDate.split('T')[0],
      departureDate: tripPoint.departureDate.split('T')[0],
      notes: tripPoint.notes || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Location name is required';
    }

    if (!formData.arrivalDate) {
      newErrors.arrivalDate = 'Arrival date is required';
    }

    if (!formData.departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }

    if (formData.departureDate && formData.arrivalDate && 
        new Date(formData.departureDate) < new Date(formData.arrivalDate)) {
      newErrors.departureDate = 'Departure date must be after arrival date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      // TODO: Implement API call to update trip point
      const updatedTripPoint = {
        ...tripPoint,
        ...formData,
        arrivalDate: formData.arrivalDate,
        departureDate: formData.departureDate,
      };
      console.log('Updating trip point:', updatedTripPoint);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onEdit(updatedTripPoint);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update trip point:', error);
      setErrors({ submit: 'Failed to update trip point. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <Paper elevation={3} sx={{ px: 4, pt: 2, pb: 2, mt: 2, mb: 4 }}>
        <Typography variant="subtitle1" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', mb: 1, fontSize: '1.05rem' }}>
          Edit Trip Point
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              required
              label="Location Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              inputProps={{ maxLength: 200 }}
              sx={{
                width: '100%',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
              }}
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                required
                label="Arrival Date"
                name="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={handleChange}
                error={!!errors.arrivalDate}
                helperText={errors.arrivalDate}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: '180px',
                  '& .MuiInputBase-root': { fontSize: '0.875rem', height: '36px' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                  '& .MuiInputBase-input': { padding: '6px 12px' },
                  '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
                }}
                size="small"
              />
              <TextField
                required
                label="Departure Date"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
                error={!!errors.departureDate}
                helperText={errors.departureDate}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: '180px',
                  '& .MuiInputBase-root': { fontSize: '0.875rem', height: '36px' },
                  '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                  '& .MuiInputBase-input': { padding: '6px 12px' },
                  '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
                }}
                size="small"
              />
            </Box>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={2}
              placeholder="Additional notes about this location..."
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.875rem' },
                '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                '& .MuiInputBase-input': { padding: '6px 12px' }
              }}
              size="small"
            />
            {errors.submit && (
              <Alert severity="error">{errors.submit}</Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1, mb: 0 }}>
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
                onClick={handleSubmit}
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
    );
  }

  return (
    <>
      <Dialog open={showRouteWarning} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700, pb: 1 }}>
          Cannot delete trip point
        </DialogTitle>
        <DialogActions sx={{ px: 2, pb: 2, flexDirection: 'column', alignItems: 'stretch' }}>
          <Alert severity="warning" sx={{ mb: 2, width: '100%' }}>
            This trip point has routes linked to it. Please delete the routes first before removing this trip point.
          </Alert>
          <Button
            variant="outlined"
            onClick={handleCancelDelete}
            fullWidth
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteConfirm} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700, pb: 1 }}>
          Delete "{tripPoint.name}" trip point?
        </DialogTitle>
        <DialogActions sx={{ px: 2, pb: 2, gap: 0.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCancelDelete}
            disabled={deleting}
            sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleConfirmDelete}
            disabled={deleting}
            sx={{ fontSize: '0.75rem', py: 0.4, px: 1.4 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={2} sx={{ p: 3, mb: 2, backgroundColor: '#f9f9f9' }}>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          Trip Point: {tripPoint.name}{formatDateRange()}
        </Typography>
        {tripPoint.notes && (
          <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            {tripPoint.notes}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveClick}
            fullWidth
            size="small"
            sx={{ fontSize: '0.75rem', py: 0.4, px: 1.4 }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
            fullWidth
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
            Edit
          </Button>
        </Box>

        <Stack spacing={1}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Accommodations
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="small"
              onClick={() => setShowAccommodationForm(true)}
              sx={{
                fontSize: '0.7rem',
                py: 0.4,
                px: 1.2,
                mb: 2,
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                '&:hover': { backgroundColor: '#bbdefb' },
                border: '1px solid #90caf9',
              }}
            >
              Add Accommodation
            </Button>
            {accommodations.map((accommodation) => (
              <AccommodationSummary
                key={accommodation.accommodationId}
                accommodation={accommodation}
                onEdit={(updatedAccommodation) => {
                  setAccommodations(prev => 
                    prev.map(a => a.accommodationId === updatedAccommodation.accommodationId ? updatedAccommodation : a)
                  );
                }}
                onRemove={() => {
                  setAccommodations(prev => 
                    prev.filter(a => a.accommodationId !== accommodation.accommodationId)
                  );
                }}
              />
            ))}

            {showAccommodationForm && (
              <Box ref={accommodationFormRef} sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                {(() => {
                  // Find the latest accommodation by checkOutDate (ISO string)
                  let latestCheckOut = undefined;
                  if (accommodations.length > 0) {
                    latestCheckOut = accommodations
                      .filter(a => a.checkOutDate)
                      .sort((a, b) => new Date(b.checkOutDate).getTime() - new Date(a.checkOutDate).getTime())[0]?.checkOutDate;
                  }
                  return (
                    <AccommodationForm
                      tripPointId={tripPoint.tripPointId}
                      tripPointArrivalDate={latestCheckOut || tripPoint.arrivalDate}
                      tripPointDepartureDate={tripPoint.departureDate}
                      onCancel={() => setShowAccommodationForm(false)}
                      onSuccess={(newAccommodation) => {
                        const updatedAccommodations = [...accommodations, newAccommodation];
                        setAccommodations(updatedAccommodations);
                        // Update trip point with new accommodation
                        const updatedTripPoint = {
                          ...tripPoint,
                          accommodations: updatedAccommodations,
                        };
                        onEdit(updatedTripPoint);
                        setShowAccommodationForm(false);
                      }}
                    />
                  );
                })()}
              </Box>
            )}
          </Box>

          {routes.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Routes
              </Typography>
              {hasNextPoint && !showRouteForm && (
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={() => setShowRouteForm(true)}
                  sx={{
                    fontSize: '0.7rem',
                    py: 0.4,
                    px: 1.2,
                    mb: 2,
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    '&:hover': { backgroundColor: '#bbdefb' },
                    border: '1px solid #90caf9',
                  }}
                >
                  Add Route
                </Button>
              )}
              {routes.map((route) => (
                <RouteSummary
                  key={route.routeId}
                  route={route}
                  fromPointName={tripPoint.name}
                  toPointName={nextPointName}
                  onEdit={(updatedRoute) => {
                    setRoutes(prev => 
                      prev.map(r => r.routeId === updatedRoute.routeId ? updatedRoute : r)
                    );
                  }}
                  onRemove={() => {
                    setRoutes(prev => 
                      prev.filter(r => r.routeId !== route.routeId)
                    );
                  }}
                />
              ))}
            </Box>
          )}
        </Stack>

        {showRouteForm && hasNextPoint && nextPointId && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <RouteForm
              fromPointId={tripPoint.tripPointId}
              toPointId={nextPointId}
              fromPointName={tripPoint.name}
              toPointName={nextPointName}
              defaultDepartureDate={tripPoint.departureDate ? tripPoint.departureDate.slice(0, 16) : undefined}
              defaultArrivalDate={nextPointArrivalDate ? nextPointArrivalDate.slice(0, 16) : undefined}
              onCancel={() => setShowRouteForm(false)}
              onSuccess={(newRoute) => {
                const updatedRoutes = [...routes, newRoute];
                setRoutes(updatedRoutes);
                
                // Update trip point with new route
                const updatedTripPoint = {
                  ...tripPoint,
                  routesFrom: updatedRoutes,
                };
                onEdit(updatedTripPoint);
                
                setShowRouteForm(false);
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          {renderAddNextPointButton ? (
            renderAddNextPointButton()
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={onAddNextPoint}
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
          )}
        </Box>
      </Paper>
    </>
  );
};

export default TripPointSummary;
