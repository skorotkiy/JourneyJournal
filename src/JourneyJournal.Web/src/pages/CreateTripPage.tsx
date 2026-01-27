import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';
import { tripService } from '../services/tripService';
import TripForm from '../components/TripForm';

function CreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [createdTrip, setCreatedTrip] = useState<Trip | null>(null);

  const handleCreate = async (formData: any) => {
    setErrors({});
    setLoading(true);
    try {
      const tripData = {
        ...formData,
        plannedCost: formData.plannedCost ? parseFloat(formData.plannedCost) : undefined,
        totalCost: formData.totalCost ? parseFloat(formData.totalCost) : undefined,
      };
      await tripService.create(tripData);
      navigate('/trips');
    } catch (error) {
      setErrors({ submit: 'Failed to create trip. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/');

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ px: 4, pt: 2, pb: 2, mt: 2 }}>
        <Typography
          variant="subtitle1"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: '#1976d2', mb: 1, fontSize: '1.05rem' }}
        >
          Start the Journey
        </Typography>
        <TripForm
          loading={loading}
          errors={errors}
          onSubmit={handleCreate}
          onCancel={handleCancel}
        />
      </Paper>
    </Box>
  );
}

export default CreateTripPage;
