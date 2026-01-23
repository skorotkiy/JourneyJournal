import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { tripService } from '../services/tripService';
import type { Trip } from '../types/trip';

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    plannedCost: '',
    totalCost: '',
    currency: 'EUR',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdTrip, setCreatedTrip] = useState<Trip | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      newErrors.name = 'Trip name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
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
      const tripData = {
        ...formData,
        plannedCost: formData.plannedCost ? parseFloat(formData.plannedCost) : undefined,
        totalCost: formData.totalCost ? parseFloat(formData.totalCost) : undefined,
      };
      const trip = await tripService.create(tripData);
      setCreatedTrip(trip);
    } catch (error) {
      console.error('Failed to create trip:', error);
      setErrors({ submit: 'Failed to create trip. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

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

  if (createdTrip) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="success.main">
            Trip Created Successfully! ✓
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Trip Name
              </Typography>
              <Typography variant="h5">
                {createdTrip.name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="overline" color="text.secondary">
                Dates
              </Typography>
              <Typography variant="body1">
                {formatDateRange(createdTrip.startDate, createdTrip.endDate)}
              </Typography>
            </Box>

            {createdTrip.description && (
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {createdTrip.description}
                </Typography>
              </Box>
            )}

            {createdTrip.plannedCost && (
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Planned Budget
                </Typography>
                <Typography variant="h6">
                  {createdTrip.plannedCost.toLocaleString()} {createdTrip.currency || 'EUR'}
                </Typography>
              </Box>
            )}

            {createdTrip.totalCost && (
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Spent
                </Typography>
                <Typography variant="h6">
                  {createdTrip.totalCost.toLocaleString()} {createdTrip.currency || 'EUR'}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="overline" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body2">
                {formatDate(createdTrip.createdAt)}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                size="small"
                sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}
              >
                Back to Home
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/trips')}
                size="small"
                sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}
              >
                View All Trips
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Start the Journey
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              label="Trip Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              inputProps={{ maxLength: 200 }}
              size="small"
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                '& .MuiFormHelperText-root': { fontSize: '0.7rem' }
              }}
            />

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                required
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': { fontSize: '0.8rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  '& .MuiFormHelperText-root': { fontSize: '0.7rem' }
                }}
              />

              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': { fontSize: '0.8rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem' },
                  '& .MuiFormHelperText-root': { fontSize: '0.7rem' }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                label="Budget"
                name="plannedCost"
                type="number"
                value={formData.plannedCost}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
                placeholder="Budget"
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': { fontSize: '0.8rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                }}
              />

              <TextField
                label="Spent"
                name="totalCost"
                type="number"
                value={formData.totalCost}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
                placeholder="Actual"
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': { fontSize: '0.8rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                }}
              />

              <TextField
                label="Currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                inputProps={{ maxLength: 3 }}
                placeholder="EUR"
                size="small"
                sx={{
                  width: '90px',
                  '& .MuiInputBase-root': { fontSize: '0.8rem' },
                  '& .MuiInputLabel-root': { fontSize: '0.8rem' }
                }}
              />
            </Box>

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Describe your trip..."
              size="small"
              sx={{
                '& .MuiInputBase-root': { fontSize: '0.8rem' },
                '& .MuiInputLabel-root': { fontSize: '0.8rem' }
              }}
            />

            <Box sx={{ mt: -1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                }
                label="Default"
              />
            </Box>

            {errors.submit && (
              <Typography color="error">{errors.submit}</Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 0.5 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
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
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateTripPage;
