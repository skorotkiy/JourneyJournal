import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import {
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  EventOutlined as EventIcon,
  AccessTime as DurationIcon,
  MonetizationOnOutlined as MoneyIcon,
} from '@mui/icons-material';
import type { Route } from '../types/trip';
import { TransportationType } from '../types/trip';

interface RouteSummaryProps {
  route: Route;
  fromPointName: string;
  toPointName: string;
  onEdit: (updatedRoute: Route) => void;
  onRemove: () => void;
}

const RouteSummary = ({ route, fromPointName, toPointName, onEdit, onRemove }: RouteSummaryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    transportationType: route.transportationType,
    carrier: route.carrier || '',
    departureTime: route.departureTime ? route.departureTime.slice(0, 16) : '',
    arrivalTime: route.arrivalTime ? route.arrivalTime.slice(0, 16) : '',
    durationMinutes: route.durationMinutes?.toString() || '',
    cost: route.cost?.toString() || '',
    isSelected: route.isSelected,
    notes: route.notes || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getTransportTypeName = (type: TransportationType): string => {
    switch (type) {
      case TransportationType.Flight: return '✈️ Flight';
      case TransportationType.Train: return '🚂 Train';
      case TransportationType.Bus: return '🚌 Bus';
      case TransportationType.Car: return '🚗 Car';
      case TransportationType.Walking: return '🚶 Walking';
      case TransportationType.Other: return 'Other';
      default: return 'Unknown';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleRemoveClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      // TODO: Implement API call to delete route
      console.log('Deleting route:', route.routeId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShowDeleteConfirm(false);
      onRemove();
    } catch (error) {
      console.error('Failed to delete route:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      transportationType: route.transportationType,
      carrier: route.carrier || '',
      departureTime: route.departureTime ? route.departureTime.slice(0, 16) : '',
      arrivalTime: route.arrivalTime ? route.arrivalTime.slice(0, 16) : '',
      durationMinutes: route.durationMinutes?.toString() || '',
      cost: route.cost?.toString() || '',
      isSelected: route.isSelected,
      notes: route.notes || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'transportationType' ? parseInt(value) : value),
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.arrivalTime && formData.departureTime && 
        new Date(formData.arrivalTime) < new Date(formData.departureTime)) {
      newErrors.arrivalTime = 'Arrival time must be after departure time';
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
      // TODO: Implement API call to update route
      const updatedRoute: Route = {
        ...route,
        transportationType: formData.transportationType,
        carrier: formData.carrier || undefined,
        departureTime: formData.departureTime || undefined,
        arrivalTime: formData.arrivalTime || undefined,
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        isSelected: formData.isSelected,
        notes: formData.notes || undefined,
      };
      console.log('Updating route:', updatedRoute);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onEdit(updatedRoute);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update route:', error);
      setErrors({ submit: 'Failed to update route. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <Paper elevation={1} sx={{ p: 2.5, mb: 1.5, backgroundColor: 'background.paper', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {fromPointName} → {toPointName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isSelected}
                  onChange={handleChange}
                  name="isSelected"
                  size="small"
                />
              }
              label="Selected"
            />
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                select
                label="Transport Type"
                name="transportationType"
                value={formData.transportationType}
                onChange={handleChange}
                sx={{ width: '150px' }}
                size="small"
              >
                <MenuItem value={TransportationType.Flight}>Flight</MenuItem>
                <MenuItem value={TransportationType.Train}>Train</MenuItem>
                <MenuItem value={TransportationType.Bus}>Bus</MenuItem>
                <MenuItem value={TransportationType.Car}>Car</MenuItem>
                <MenuItem value={TransportationType.Walking}>Walking</MenuItem>
                <MenuItem value={TransportationType.Other}>Other</MenuItem>
              </TextField>

              <TextField
                label="Carrier"
                name="carrier"
                value={formData.carrier}
                onChange={handleChange}
                sx={{ flex: 1, minWidth: '200px' }}
                size="small"
              />

              <TextField
                label="Cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ width: '120px' }}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Departure Time"
                name="departureTime"
                type="datetime-local"
                value={formData.departureTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '200px' }}
                size="small"
              />

              <TextField
                label="Arrival Time"
                name="arrivalTime"
                type="datetime-local"
                value={formData.arrivalTime}
                onChange={handleChange}
                error={!!errors.arrivalTime}
                helperText={errors.arrivalTime}
                InputLabelProps={{ shrink: true }}
                sx={{ width: '200px' }}
                size="small"
              />

              <TextField
                label="Duration (min)"
                name="durationMinutes"
                type="number"
                value={formData.durationMinutes}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                sx={{ width: '120px' }}
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
              size="small"
            />

            {errors.submit && (
              <Alert severity="error">{errors.submit}</Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
      </Paper>
    );
  }

  return (
    <>
      <Dialog open={showDeleteConfirm} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700, pb: 1 }}>
          Delete route from "{fromPointName}" to "{toPointName}"?
        </DialogTitle>
        <DialogActions sx={{ px: 2, pb: 2 }}>
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

      <Paper elevation={1} sx={{ p: 2.5, mb: 1.5, backgroundColor: 'background.paper', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {fromPointName} → {toPointName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getTransportTypeName(route.transportationType)}{route.carrier ? ` • ${route.carrier}` : ''}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={route.isSelected ? 'Selected' : 'Not Selected'}
            color={route.isSelected ? 'success' : 'default'}
            sx={{ borderRadius: 999, fontWeight: 600 }}
          />
        </Box>

        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          {(route.departureTime || route.arrivalTime) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">
                {route.departureTime && formatDateTime(route.departureTime)}
                {route.departureTime && route.arrivalTime && ' - '}
                {route.arrivalTime && formatDateTime(route.arrivalTime)}
              </Typography>
            </Box>
          )}
          {route.durationMinutes && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DurationIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatDuration(route.durationMinutes)}
              </Typography>
            </Box>
          )}
          {typeof route.cost === 'number' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                €{route.cost.toFixed(0)}
              </Typography>
            </Box>
          )}
          {route.notes && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              {route.notes}
            </Typography>
          )}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<DeleteIcon />}
            onClick={handleRemoveClick}
            size="small"
            sx={{ fontSize: '0.75rem', py: 0.4, px: 1.4 }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<EditIcon />}
            onClick={handleEditClick}
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
      </Paper>
    </>
  );
};

export default RouteSummary;
