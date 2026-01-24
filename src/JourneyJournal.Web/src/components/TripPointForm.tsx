import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from '@mui/material';

interface TripPointFormProps {
  tripId: number;
  tripStartDate?: string;
  tripEndDate?: string;
  prevTripPointDepartureDate?: string;
  onCancel: () => void;
  onSuccess: (tripPoint: any) => void;
}

const TripPointForm = ({ tripId: _tripId, tripStartDate, tripEndDate, prevTripPointDepartureDate, onCancel, onSuccess }: TripPointFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    arrivalDate: prevTripPointDepartureDate || tripStartDate || '',
    departureDate: tripEndDate || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      // TODO: Implement API call to create trip point
      // Simulate success for now
      setTimeout(() => {
        setLoading(false);
        onSuccess({ ...formData });
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setErrors({ submit: err.message || 'Failed to add trip point' });
    }
  };

  return (
    <Paper elevation={3} sx={{ px: 4, pt: 2, pb: 2, mt: 2 }}>
      <Typography variant="subtitle1" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2', mb: 1, fontSize: '1.05rem' }}>
        Add Trip Point
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
}

export default TripPointForm;
