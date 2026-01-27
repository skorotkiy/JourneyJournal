import { useState, useEffect } from 'react';
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
} from '@mui/material';
import type { Route } from '../types/route';
import { TransportationType } from '../types/route';
import { routeService } from '../services/routeService';
import {
  textFieldSx,
  selectFieldSx,
  dateFieldSx,
  amountFieldSx,
  notesFieldSx,
  buttonOutlinedSx,
  buttonContainedSx,
  ELEMENT_GAP,
  formPaperSx
} from '../styles/formStyles';

interface RouteFormProps {
  fromPointId: number;
  toPointId: number;
  fromPointName: string;
  toPointName: string;
  defaultDepartureDate?: string;
  defaultArrivalDate?: string;
  onCancel: () => void;
  onSuccess: (route: Route) => void;
  editMode?: boolean;
  initialData?: Partial<Route>;
}

const RouteForm = ({ fromPointId, toPointId, fromPointName, toPointName, defaultDepartureDate, defaultArrivalDate, onCancel, onSuccess, editMode = false, initialData }: RouteFormProps) => {
  const routeName = `${fromPointName} → ${toPointName}`;
  const getInitialFormData = () => ({
    transportationType: initialData?.transportationType ?? TransportationType.Flight,
    carrier: initialData?.carrier ?? '',
    departureTime: initialData?.departureTime ?? (defaultDepartureDate || ''),
    arrivalTime: initialData?.arrivalTime ?? (defaultArrivalDate || ''),
    durationMinutes: initialData?.durationMinutes?.toString() ?? '',
    cost: initialData?.cost?.toString() ?? '',
    isSelected: initialData?.isSelected ?? false,
    notes: initialData?.notes ?? '',
  });
  const [formData, setFormData] = useState(getInitialFormData);

  useEffect(() => {
    setFormData(getInitialFormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, editMode, defaultDepartureDate, defaultArrivalDate]);
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
      const routeData = {
        name: routeName,
        transportationType: formData.transportationType,
        carrier: formData.carrier || undefined,
        departureTime: formData.departureTime || undefined,
        arrivalTime: formData.arrivalTime || undefined,
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        isSelected: formData.isSelected,
        notes: formData.notes || undefined,
      };

      let result: Route;
      if (editMode && initialData?.routeId) {
        // Update existing route
        result = await routeService.update(initialData.routeId, routeData);
      } else {
        // Create new route
        result = await routeService.create(fromPointId, toPointId, routeData);
      }
      
      onSuccess(result);
    } catch (error) {
      setErrors({ submit: 'Failed to save route. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={1} sx={formPaperSx}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        {editMode ? 'Edit route' : 'Add route'}
      </Typography>
      
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
        <Stack spacing={ELEMENT_GAP}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
            <TextField
              select
              label="Transport Type"
              name="transportationType"
              value={formData.transportationType}
              onChange={handleChange}
              sx={selectFieldSx}
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
              sx={textFieldSx}
              size="small"
            />

            <TextField
              label="Cost"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              sx={amountFieldSx}
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
              sx={dateFieldSx}
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
              sx={dateFieldSx}
              size="small"
            />

            <TextField
              label="Duration (min)"
              name="durationMinutes"
              type="number"
              value={formData.durationMinutes}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              sx={amountFieldSx}
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
            sx={notesFieldSx}
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
              sx={buttonOutlinedSx}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              size="small"
              sx={buttonContainedSx}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default RouteForm;
