import React, { useState } from 'react';
import { Box, Stack, TextField, Button, FormControlLabel, Checkbox, Typography } from '@mui/material';
import {
  textFieldSx,
  dateFieldSx,
  amountFieldSx,
  currencyFieldSx,
  notesFieldSx,
  buttonOutlinedSx,
  buttonContainedSx,
} from '../styles/formStyles';
import type { Trip } from '../types/trip';

export interface TripFormProps {
  initialData?: Partial<Trip>;
  loading?: boolean;
  errors?: Record<string, string>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const defaultFormData = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  plannedCost: '',
  totalCost: '',
  currency: 'EUR',
  isDefault: false,
};

const TripForm: React.FC<TripFormProps> = ({
  initialData = {},
  loading = false,
  errors = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({ ...defaultFormData, ...initialData });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
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
          sx={textFieldSx}
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
            sx={dateFieldSx}
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
            sx={dateFieldSx}
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
            sx={amountFieldSx}
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
            sx={amountFieldSx}
          />
          <TextField
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            inputProps={{ maxLength: 3 }}
            placeholder="EUR"
            size="small"
            sx={currencyFieldSx}
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
          sx={notesFieldSx}
        />
        <Box sx={{ mt: -1 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                size="small"
              />
            }
            label="Default"
            sx={{
              '.MuiFormControlLabel-label': { fontSize: '0.85rem' },
              alignItems: 'center',
            }}
            componentsProps={{ typography: { variant: 'body2' } }}
          />
        </Box>
        {errors.submit && <Typography color="error">{errors.submit}</Typography>}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 0.5 }}>
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
  );
};

export default TripForm;
