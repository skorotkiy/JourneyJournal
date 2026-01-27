import { useState, useEffect } from 'react';
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
import type { Accommodation } from '../types/accommodation';
import { accommodationService } from '../services/accommodationService';
import { AccommodationType, AccommodationStatus } from '../types/accommodation';


interface AccommodationFormProps {
  tripPointId: number;
  tripPointArrivalDate?: string;
  tripPointDepartureDate?: string;
  onCancel: () => void;
  onSuccess: (accommodation: Accommodation) => void;
  label?: string;
  initialData?: Partial<Accommodation>;
}

import { DateHelper } from '../utils/DateHelper';
const AccommodationForm = ({ tripPointId, tripPointArrivalDate, tripPointDepartureDate, onCancel, onSuccess, label, initialData }: AccommodationFormProps) => {
  const getInitialFormData = () => ({
    name: initialData?.name ?? '',
    accommodationType: initialData?.accommodationType ?? AccommodationType.Hotel,
    address: initialData?.address ?? '',
    checkInDate: initialData?.checkInDate ? DateHelper.formatDateShort(initialData.checkInDate) : (tripPointArrivalDate ? DateHelper.formatDateShort(tripPointArrivalDate) : ''),
    checkOutDate: initialData?.checkOutDate ? DateHelper.formatDateShort(initialData.checkOutDate) : (tripPointDepartureDate ? DateHelper.formatDateShort(tripPointDepartureDate) : ''),
    websiteUrl: initialData?.websiteUrl ?? '',
    cost: initialData?.cost !== undefined ? initialData.cost.toString() : '',
    status: initialData?.status ?? AccommodationStatus.Planned,
    notes: initialData?.notes ?? '',
  });
  const [formData, setFormData] = useState(getInitialFormData);
  useEffect(() => {
    setFormData(getInitialFormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, tripPointArrivalDate, tripPointDepartureDate]);
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
      const payload = {
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
      let result: Accommodation;
      if (initialData && initialData.accommodationId && initialData.accommodationId > 0) {
        // Edit mode
        result = await accommodationService.update(initialData.accommodationId, payload);
      } else {
        // Create mode
        result = await accommodationService.create(tripPointId, payload);
      }
      onSuccess(result);
    } catch (error) {
      setErrors({ submit: 'Failed to save accommodation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={1} sx={{ ...formPaperSx, mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        {label || 'Add Accommodation'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={ELEMENT_GAP}>
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
              sx={textFieldSx}
              size="small"
            />

            <TextField
              select
              label="Type"
              name="accommodationType"
              value={formData.accommodationType}
              onChange={handleChange}
              sx={selectFieldSx}
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
              sx={dateFieldSx}
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
              sx={dateFieldSx}
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
              sx={amountFieldSx}
              size="small"
            />

            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              sx={selectFieldSx}
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
            sx={textFieldSx}
            size="small"
          />

          <TextField
            fullWidth
            label="Website URL"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://..."
            sx={textFieldSx}
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
            sx={notesFieldSx}
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

export default AccommodationForm;
