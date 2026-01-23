import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
} from '@mui/material';
import type { Route } from '../types/trip';
import { TransportationType } from '../types/trip';

interface RouteFormProps {
  fromPointId: number;
  toPointId: number;
  fromPointName: string;
  toPointName: string;
  defaultDepartureDate?: string;
  defaultArrivalDate?: string;
  onCancel: () => void;
  onSuccess: (route: Route) => void;
}

const RouteForm = ({ fromPointId, toPointId, fromPointName, toPointName, defaultDepartureDate, defaultArrivalDate, onCancel, onSuccess }: RouteFormProps) => {
  const routeName = `${fromPointName} → ${toPointName}`;
  const [formData, setFormData] = useState({
    transportationType: TransportationType.Flight,
    carrier: '',
    departureTime: defaultDepartureDate || '',
    arrivalTime: defaultArrivalDate || '',
    durationMinutes: '',
    cost: '',
    isSelected: false,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    setLoading(true);
    try {
      // TODO: Implement API call to create route
      const routeData = {
        ...formData,
        fromPointId,
        toPointId,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : undefined,
      };
      console.log('Creating route:', routeData);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const createdRoute: Route = {
        routeId: Date.now(),
        fromPointId,
        toPointId,
        name: routeName,
        transportationType: formData.transportationType,
        carrier: formData.carrier || undefined,
        departureTime: formData.departureTime || undefined,
        arrivalTime: formData.arrivalTime || undefined,
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        isSelected: formData.isSelected,
        notes: formData.notes || undefined,
        createdAt: new Date().toISOString(),
      };
      
      onSuccess(createdRoute);
    } catch (error) {
      console.error('Failed to create route:', error);
      setErrors({ submit: 'Failed to create route. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2.5, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {routeName}
        </Typography>
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
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Transport Type"
              name="transportationType"
              value={formData.transportationType}
              onChange={handleChange}
              sx={{ 
                width: '150px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiSelect-select': { padding: '4px 10px' }
              }}
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
              placeholder="Airline, train company, etc."
              sx={{ 
                flex: 1, 
                minWidth: '200px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' }
              }}
              size="small"
            />

            <TextField
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
                '& .MuiInputBase-input': { padding: '4px 10px' }
              }}
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
              sx={{ 
                width: '200px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' }
              }}
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
              sx={{ 
                width: '200px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' },
                '& .MuiFormHelperText-root': { fontSize: '0.65rem' }
              }}
              size="small"
            />

            <TextField
              label="Duration (min)"
              name="durationMinutes"
              type="number"
              value={formData.durationMinutes}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              sx={{ 
                width: '120px',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
                '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                '& .MuiInputBase-input': { padding: '4px 10px' }
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
            minRows={1}
            maxRows={2}
            placeholder="Additional route details..."
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

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
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
              {loading ? 'Adding...' : 'Add Route'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RouteForm;
