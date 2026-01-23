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
  MonetizationOnOutlined as MoneyIcon,
} from '@mui/icons-material';
import type { Accommodation } from '../types/trip';
import { AccommodationType, AccommodationStatus } from '../types/trip';

interface AccommodationSummaryProps {
  accommodation: Accommodation;
  onEdit: (updatedAccommodation: Accommodation) => void;
  onRemove: () => void;
}

const AccommodationSummary = ({ accommodation, onEdit, onRemove }: AccommodationSummaryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: accommodation.name,
    accommodationType: accommodation.accommodationType,
    address: accommodation.address || '',
    checkInDate: accommodation.checkInDate ? accommodation.checkInDate.split('T')[0] : '',
    checkOutDate: accommodation.checkOutDate ? accommodation.checkOutDate.split('T')[0] : '',
    websiteUrl: accommodation.websiteUrl || '',
    cost: accommodation.cost?.toString() || '',
    status: accommodation.status,
    notes: accommodation.notes || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getAccommodationTypeName = (type: AccommodationType): string => {
    switch (type) {
      case AccommodationType.Booking: return 'Booking';
      case AccommodationType.Hotel: return 'Hotel';
      case AccommodationType.Apartment: return 'Apartment';
      case AccommodationType.Airbnb: return 'Airbnb';
      case AccommodationType.Other: return 'Other';
      default: return 'Unknown';
    }
  };

  const getStatusName = (status: AccommodationStatus): string => {
    switch (status) {
      case AccommodationStatus.Planned: return 'Planned';
      case AccommodationStatus.Confirmed: return 'Confirmed';
      case AccommodationStatus.PaymentRequired: return 'Payment Required';
      case AccommodationStatus.Paid: return 'Paid';
      case AccommodationStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusChipProps = (
    status: AccommodationStatus
  ): { label: string; color: 'default' | 'success' | 'warning' | 'error' } => {
    if (status === AccommodationStatus.Confirmed || status === AccommodationStatus.Paid) {
      return { label: getStatusName(status), color: 'success' };
    }
    if (status === AccommodationStatus.PaymentRequired) {
      return { label: getStatusName(status), color: 'warning' };
    }
    if (status === AccommodationStatus.Cancelled) {
      return { label: getStatusName(status), color: 'error' };
    }
    return { label: getStatusName(status), color: 'default' };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateNights = (): number | null => {
    if (!accommodation.checkInDate || !accommodation.checkOutDate) return null;
    const checkIn = new Date(accommodation.checkInDate);
    const checkOut = new Date(accommodation.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      // TODO: Implement API call to delete accommodation
      console.log('Deleting accommodation:', accommodation.accommodationId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShowDeleteConfirm(false);
      onRemove();
    } catch (error) {
      console.error('Failed to delete accommodation:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: accommodation.name,
      accommodationType: accommodation.accommodationType,
      address: accommodation.address || '',
      checkInDate: accommodation.checkInDate ? accommodation.checkInDate.split('T')[0] : '',
      checkOutDate: accommodation.checkOutDate ? accommodation.checkOutDate.split('T')[0] : '',
      websiteUrl: accommodation.websiteUrl || '',
      cost: accommodation.cost?.toString() || '',
      status: accommodation.status,
      notes: accommodation.notes || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'accommodationType' || name === 'status' ? parseInt(value) : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Accommodation name is required';
    }

    if (formData.checkOutDate && formData.checkInDate && 
        new Date(formData.checkOutDate) < new Date(formData.checkInDate)) {
      newErrors.checkOutDate = 'Check-out date must be after check-in date';
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
      // TODO: Implement API call to update accommodation
      const updatedAccommodation: Accommodation = {
        ...accommodation,
        name: formData.name,
        accommodationType: formData.accommodationType,
        address: formData.address || undefined,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        websiteUrl: formData.websiteUrl || undefined,
        cost: parseFloat(formData.cost),
        status: formData.status,
        notes: formData.notes || undefined,
      };
      console.log('Updating accommodation:', updatedAccommodation);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onEdit(updatedAccommodation);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update accommodation:', error);
      setErrors({ submit: 'Failed to update accommodation. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <Paper elevation={1} sx={{ p: 2.5, mb: 1.5, backgroundColor: 'background.paper', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Edit Accommodation
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                required
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                inputProps={{ maxLength: 200 }}
                sx={{ 
                  flex: 1, 
                  minWidth: '200px',
                  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { padding: '4px 10px' },
                  '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
                }}
                size="small"
              />

              <TextField
                select
                label="Type"
                name="accommodationType"
                value={formData.accommodationType}
                onChange={handleChange}
                sx={{ 
                  width: '150px',
                  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiSelect-select': { padding: '4px 10px' }
                }}
                size="small"
              >
                <MenuItem value={AccommodationType.Booking}>Booking</MenuItem>
                <MenuItem value={AccommodationType.Hotel}>Hotel</MenuItem>
                <MenuItem value={AccommodationType.Apartment}>Apartment</MenuItem>
                <MenuItem value={AccommodationType.Airbnb}>Airbnb</MenuItem>
                <MenuItem value={AccommodationType.Other}>Other</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                required
                label="Check-in Date"
                name="checkInDate"
                type="date"
                value={formData.checkInDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  width: '180px',
                  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { padding: '4px 10px' },
                  '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
                }}
                size="small"
              />

              <TextField
                required
                label="Check-out Date"
                name="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                onChange={handleChange}
                error={!!errors.checkOutDate}
                helperText={errors.checkOutDate}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  width: '180px',
                  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { padding: '4px 10px' },
                  '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
                }}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                required
                label="Cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ 
                  width: '120px',
                  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiInputBase-input': { padding: '4px 10px' },
                  '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
                }}
                size="small"
              />

              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                sx={{ 
                  width: '150px',
                  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                  '& .MuiSelect-select': { padding: '4px 10px' }
                }}
                size="small"
              >
                <MenuItem value={AccommodationStatus.Planned}>Planned</MenuItem>
                <MenuItem value={AccommodationStatus.Confirmed}>Confirmed</MenuItem>
                <MenuItem value={AccommodationStatus.PaymentRequired}>Payment Required</MenuItem>
                <MenuItem value={AccommodationStatus.Paid}>Paid</MenuItem>
                <MenuItem value={AccommodationStatus.Cancelled}>Cancelled</MenuItem>
              </TextField>
            </Box>

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              inputProps={{ maxLength: 500 }}
              placeholder="Full address"
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.75rem', minHeight: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' }
              }}
              size="small"
            />

            <TextField
              fullWidth
              label="Website URL"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.75rem', minHeight: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' }
              }}
              size="small"
            />

            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={2}
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.75rem' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' }
              }}
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
          Delete accommodation "{accommodation.name}"?
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
              {accommodation.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                {getAccommodationTypeName(accommodation.accommodationType)}
              </Typography>
              {accommodation.address && (
                <>
                  <Typography variant="body2" color="text.secondary">•</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {accommodation.address}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          <Chip
            size="small"
            label={getStatusChipProps(accommodation.status).label}
            color={getStatusChipProps(accommodation.status).color}
            sx={{ borderRadius: 999, fontWeight: 600 }}
          />
        </Box>

        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          {(accommodation.checkInDate || accommodation.checkOutDate) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">
                {formatDate(accommodation.checkInDate || '')} - {formatDate(accommodation.checkOutDate || '')}
                {calculateNights() && ` (${calculateNights()} night${calculateNights() === 1 ? '' : 's'})`}
              </Typography>
            </Box>
          )}

          {typeof accommodation.cost === 'number' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                €{accommodation.cost.toFixed(0)}
              </Typography>
            </Box>
          )}

          {accommodation.websiteUrl && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              🌐{' '}
              <a href={accommodation.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                {accommodation.websiteUrl}
              </a>
            </Typography>
          )}

          {accommodation.notes && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              {accommodation.notes}
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

export default AccommodationSummary;
