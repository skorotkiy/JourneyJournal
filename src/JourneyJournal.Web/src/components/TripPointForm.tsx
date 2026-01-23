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
  nextOrder: number;
  onCancel: () => void;
  onSuccess: (tripPoint: any) => void;
}

const TripPointForm = ({ tripId: _tripId, nextOrder, onCancel, onSuccess }: TripPointFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    arrivalDate: '',
    departureDate: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // Create trip point data
      const tripPointData = {
        name: formData.name,
        order: nextOrder,
        arrivalDate: formData.arrivalDate,
        departureDate: formData.departureDate,
        notes: formData.notes || undefined,
        accommodations: [],
        placesToVisit: [],
        routes: [],
      };
      
      onSuccess(tripPointData);
    } catch (error) {
      console.error('Failed to create trip point:', error);
      setErrors({ submit: 'Failed to create trip point. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
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

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
              sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}
            >
              {loading ? 'Adding...' : 'Add Trip Point'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TripPointForm;
