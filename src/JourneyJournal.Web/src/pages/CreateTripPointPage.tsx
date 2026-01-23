import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from '@mui/material';

const CreateTripPointPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('tripId');
  
  const [formData, setFormData] = useState({
    name: '',
    order: '',
    arrivalDate: '',
    departureDate: '',
    address: '',
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

    if (!formData.order || isNaN(Number(formData.order))) {
      newErrors.order = 'Valid order is required';
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
      // TODO: Implement API call to create trip point
      console.log('Creating trip point:', {
        ...formData,
        order: Number(formData.order),
        tripId: Number(tripId),
      });
      
      // After successful creation, navigate back to trips page
      setTimeout(() => {
        navigate('/trips');
      }, 500);
    } catch (error) {
      console.error('Failed to create trip point:', error);
      setErrors({ submit: 'Failed to create trip point. Please try again.' });
      setLoading(false);
    }
  };

  if (!tripId) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
        <Alert severity="error">
          Trip ID is missing. Please navigate from the trip details page.
        </Alert>
        <Button sx={{ mt: 2, fontSize: '0.7rem', py: 0.4, px: 1.2 }} variant="contained" onClick={() => navigate('/trips')} size="small">
          Back to Trips
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Trip Point
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Stack spacing={1.5}>
            <TextField
              required
              fullWidth
              label="Location Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name || 'Enter the city or location name'}
              inputProps={{ maxLength: 200 }}
              size="small"
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                '& .MuiFormHelperText-root': { fontSize: '0.7rem' }
              }}
            />

            <TextField
              required
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              error={!!errors.order}
              helperText={errors.order || 'Sequential order (0 for first, 1 for second, etc.)'}
              inputProps={{ min: 0, step: 1 }}
              sx={{ 
                width: '200px',
                '& .MuiInputBase-root': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                '& .MuiFormHelperText-root': { fontSize: '0.7rem' }
              }}
              size="small"
            />

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                label="Arrival Date"
                name="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                helperText="When you arrive at this location"
                sx={{ 
                  width: '230px',
                  '& .MuiInputBase-root': { fontSize: '0.8rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  '& .MuiFormHelperText-root': { fontSize: '0.7rem' }
                }}
                size="small"
              />

              <TextField
                label="Departure Date"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
                error={!!errors.departureDate}
                helperText={errors.departureDate || 'When you leave this location'}
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  width: '230px',
                  '& .MuiInputBase-root': { fontSize: '0.8rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  '& .MuiFormHelperText-root': { fontSize: '0.7rem' }
                }}
                size="small"
              />
            </Box>

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              inputProps={{ maxLength: 500 }}
              placeholder="Full address or location details"
              size="small"
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' }
              }}
            />

            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={2}
              placeholder="Additional notes about this location..."
              size="small"
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' }
              }}
            />

            {errors.submit && (
              <Alert severity="error">{errors.submit}</Alert>
            )}

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 0.5 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/trips')}
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
    </Box>
  );
};

export default CreateTripPointPage;
