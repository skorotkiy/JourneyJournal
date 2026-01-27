import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import { Box, Stack, TextField, Button, FormControlLabel, Checkbox, Typography } from '@mui/material';
import {
  textFieldSx,
  dateFieldSx,
  amountFieldSx,
  currencyFieldSx,
  notesFieldSx,
  buttonOutlinedSx,
  buttonContainedSx,
  buttonDeleteSx,
} from '../styles/formStyles';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Trip } from '../types/trip';

export interface TripFormProps {
  initialData?: Partial<Trip>;
  loading?: boolean;
  errors?: Record<string, string>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onDelete?: () => void;
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
  onDelete,
}) => {
  const [formData, setFormData] = useState({ ...defaultFormData, ...initialData });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [defaultCheckboxClicked, setDefaultCheckboxClicked] = useState(false);

  // Update formData when initialData changes (for edit mode)
  React.useEffect(() => {
    setFormData({ ...defaultFormData, ...initialData });
    setDefaultCheckboxClicked(false);
  }, [JSON.stringify(initialData)]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'isDefault' && checked) {
      setDefaultCheckboxClicked(true);
    }
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
        <Box sx={{ mt: -1, display: 'flex', gap: 2 }}>
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
          <FormControlLabel
            control={
              <Checkbox
                name="isCompleted"
                checked={!!formData.isCompleted}
                onChange={handleChange}
                size="small"
              />
            }
            label="Completed"
            sx={{
              '.MuiFormControlLabel-label': { fontSize: '0.85rem' },
              alignItems: 'center',
            }}
            componentsProps={{ typography: { variant: 'body2' } }}
          />
        </Box>
        <Box sx={{ m: 0, p: 0, display: 'block', lineHeight: 1, mt: '0 !important' }}>
          {formData.isDefault && defaultCheckboxClicked && (
            <Typography
              variant="body2"
              color="warning.main"
              sx={{ mt: 0, mb: 0, pt: 0, pb: 0, lineHeight: 1, display: 'block', m: 0 }}>
              If another trip is currently set as default, it will be replaced by this one.
            </Typography>
          )}
        </Box>
        {errors.submit && <Typography color="error">{errors.submit}</Typography>}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 0.5, alignItems: 'center' }}>
          {onDelete && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setShowDeleteDialog(true)}
                disabled={loading}
                size="small"
                sx={buttonDeleteSx}
              >
                Delete
              </Button>
              <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700, pb: 1 }}>
                  Delete this trip?
                </DialogTitle>
                <DialogActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={deleting}
                    sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={async () => {
                      setDeleting(true);
                      try {
                        await onDelete?.();
                        setShowDeleteDialog(false);
                      } finally {
                        setDeleting(false);
                      }
                    }}
                    disabled={deleting}
                    sx={{ fontSize: '0.75rem', py: 0.4, px: 1.4 }}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
          <Box sx={{ flexGrow: 1 }} />
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
