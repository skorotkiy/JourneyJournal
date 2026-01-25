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
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
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
