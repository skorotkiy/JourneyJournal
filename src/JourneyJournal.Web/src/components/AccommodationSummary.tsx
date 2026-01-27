import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import AccommodationForm from './AccommodationForm';
import { accommodationService } from '../services/accommodationService';
import {
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  EventOutlined as EventIcon,
  MonetizationOnOutlined as MoneyIcon,
} from '@mui/icons-material';
import type { Accommodation } from '../types/accommodation';
import { AccommodationType, AccommodationStatus } from '../types/accommodation';
import { DateHelper } from '../utils/DateHelper';
import { summaryPaperSx } from '../styles/formStyles';

interface AccommodationSummaryProps {
  accommodation: Accommodation;
  onEdit: (updatedAccommodation: Accommodation) => void;
  onRemove: () => void;
}

const AccommodationSummary = ({ accommodation, onEdit, onRemove }: AccommodationSummaryProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getAccommodationTypeName = (type: AccommodationType): string => {
    switch (type) {
      case AccommodationType.Booking: return 'Booking';
      case AccommodationType.Hotel: return 'Hotel';
      case AccommodationType.Apartment: return 'Apartment';
      case AccommodationType.Airbnb: return 'Airbnb';
      case AccommodationType.Other: return 'Other';
      default: return 'Unknown';
    }
  };

  const getStatusName = (status: AccommodationStatus): string => {
    switch (status) {
      case AccommodationStatus.Planned: return 'Planned';
      case AccommodationStatus.Confirmed: return 'Confirmed';
      case AccommodationStatus.PaymentRequired: return 'Payment Required';
      case AccommodationStatus.Paid: return 'Paid';
      case AccommodationStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusChipProps = (
    status: AccommodationStatus
  ): { label: string; color: 'default' | 'success' | 'warning' | 'error' } => {
    if (status === AccommodationStatus.Confirmed || status === AccommodationStatus.Paid) {
      return { label: getStatusName(status), color: 'success' };
    }
    if (status === AccommodationStatus.PaymentRequired) {
      return { label: getStatusName(status), color: 'warning' };
    }
    if (status === AccommodationStatus.Cancelled) {
      return { label: getStatusName(status), color: 'error' };
    }
    return { label: getStatusName(status), color: 'default' };
  };

  // Use DateHelper for formatting and calculations
  const nights = DateHelper.calculateNights(accommodation.checkInDate, accommodation.checkOutDate);

  const handleRemoveClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await accommodationService.delete(accommodation.accommodationId);
      
      setShowDeleteConfirm(false);
      onRemove();
    } catch (error) {
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);
  const handleSuccessEdit = (updatedAccommodation: Accommodation) => {
    onEdit(updatedAccommodation);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <AccommodationForm
        tripPointId={accommodation.tripPointId!}
        tripPointArrivalDate={accommodation.checkInDate}
        tripPointDepartureDate={accommodation.checkOutDate}
        onCancel={handleCancelEdit}
        onSuccess={handleSuccessEdit}
        label="Edit accommodation"
        initialData={accommodation}
      />
    );
  }

  return (
    <>
      <Dialog open={showDeleteConfirm} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: '1rem', fontWeight: 700, pb: 1 }}>
          Delete accommodation "{accommodation.name}"?
        </DialogTitle>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCancelDelete}
            disabled={deleting}
            sx={{ fontSize: '0.7rem', py: 0.4, px: 1.2 }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleConfirmDelete}
            disabled={deleting}
            sx={{ fontSize: '0.75rem', py: 0.4, px: 1.4 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Paper sx={summaryPaperSx}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {accommodation.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                {getAccommodationTypeName(accommodation.accommodationType)}
              </Typography>
              {accommodation.address && (
                <>
                  <Typography variant="body2" color="text.secondary">•</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {accommodation.address}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          <Chip
            size="small"
            label={getStatusChipProps(accommodation.status).label}
            color={getStatusChipProps(accommodation.status).color}
            sx={{ borderRadius: 999, fontWeight: 600 }}
          />
        </Box>

        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
          {(accommodation.checkInDate || accommodation.checkOutDate) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">
                {DateHelper.formatDate(accommodation.checkInDate || '')} - {DateHelper.formatDate(accommodation.checkOutDate || '')}
                {nights && ` (${nights} night${nights === 1 ? '' : 's'})`}
              </Typography>
            </Box>
          )}

          {typeof accommodation.cost === 'number' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                €{accommodation.cost.toFixed(0)}
              </Typography>
            </Box>
          )}

          {accommodation.websiteUrl && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              🌐{' '}
              <a href={accommodation.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                {accommodation.websiteUrl}
              </a>
            </Typography>
          )}

          {accommodation.notes && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              {accommodation.notes}
            </Typography>
          )}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<DeleteIcon />}
            onClick={handleRemoveClick}
            size="small"
            sx={{ fontSize: '0.75rem', py: 0.4, px: 1.4 }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<EditIcon />}
            onClick={handleEditClick}
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
            Edit
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default AccommodationSummary;
