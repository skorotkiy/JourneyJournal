import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  MenuItem,
} from '@mui/material';
import type { Accommodation } from '../types/trip';
import { AccommodationType, AccommodationStatus } from '../types/trip';


interface AccommodationFormProps {
  tripPointId: number;
  tripPointArrivalDate?: string;
  tripPointDepartureDate?: string;
  onCancel: () => void;
  onSuccess: (accommodation: Accommodation) => void;
}

const AccommodationForm = ({ tripPointId, tripPointArrivalDate, tripPointDepartureDate, onCancel, onSuccess }: AccommodationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    accommodationType: AccommodationType.Hotel,
    address: '',
    checkInDate: tripPointArrivalDate ? tripPointArrivalDate.split('T')[0] : '',
    checkOutDate: tripPointDepartureDate ? tripPointDepartureDate.split('T')[0] : '',
    websiteUrl: '',
    cost: '',
    status: AccommodationStatus.Planned,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Cost is required and must be greater than 0';
    }

    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
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

    setLoading(true);
    try {
      // TODO: Implement API call to create accommodation
      const accommodationData = {
        ...formData,
        tripPointId,
        cost: parseFloat(formData.cost),
      };
      console.log('Creating accommodation:', accommodationData);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const createdAccommodation: Accommodation = {
        accommodationId: Date.now(),
        tripPointId,
        name: formData.name,
        accommodationType: formData.accommodationType,
        address: formData.address || undefined,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        websiteUrl: formData.websiteUrl || undefined,
        cost: parseFloat(formData.cost),
        status: formData.status,
        notes: formData.notes || undefined,
        createdAt: new Date().toISOString(),
      };
      
      onSuccess(createdAccommodation);
    } catch (error) {
      console.error('Failed to create accommodation:', error);
      setErrors({ submit: 'Failed to create accommodation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2, backgroundColor: 'background.paper' }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Add Accommodation
      </Typography>
      
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
              error={!!errors.checkInDate}
              helperText={errors.checkInDate}
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
              error={!!errors.cost}
              helperText={errors.cost}
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
            placeholder="https://..."
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
            minRows={1}
            maxRows={2}
            placeholder="Additional notes..."
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

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              size="small"
              sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
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
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default AccommodationForm;
