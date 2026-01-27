export const currencyFieldSx: SxProps<Theme> = {
  width: 70,
  minWidth: 60,
  maxWidth: 80,
  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
  '& .MuiInputBase-input': { padding: '4px 10px' },
  '& .MuiFormHelperText-root': { fontSize: '0.65rem' },
};
import type { SxProps, Theme } from '@mui/material/styles';

export const textFieldSx: SxProps<Theme> = {
  flex: 1,
  minWidth: '200px',
  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
  '& .MuiInputBase-input': { padding: '4px 10px' },
  '& .MuiFormHelperText-root': { fontSize: '0.65rem' },
};

export const selectFieldSx: SxProps<Theme> = {
  width: '150px',
  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
  '& .MuiSelect-select': { padding: '4px 10px' },
};

export const dateFieldSx: SxProps<Theme> = {
  width: '150px',
  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
  '& .MuiInputBase-input': { padding: '4px 10px' },
  '& .MuiFormHelperText-root': { fontSize: '0.65rem' },
};

export const amountFieldSx: SxProps<Theme> = {
  width: '100px',
  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
  '& .MuiInputBase-input': { padding: '4px 10px' },
  '& .MuiFormHelperText-root': { fontSize: '0.65rem' },
};

export const paymentFieldSx: SxProps<Theme> = {
  width: '110px',
  '& .MuiInputBase-root': { fontSize: '0.75rem', height: '32px' },
  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
  '& .MuiSelect-select': { padding: '4px 10px' },
};

export const notesFieldSx: SxProps<Theme> = {
  '& .MuiInputBase-root': { fontSize: '0.75rem' },
  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
  '& .MuiFormHelperText-root': { fontSize: '0.65rem' },
};

export const buttonOutlinedSx: SxProps<Theme> = {
  fontSize: '0.7rem',
  py: 0.4,
  px: 1.2,
};

export const buttonContainedSx: SxProps<Theme> = {
  fontSize: '0.7rem',
  py: 0.4,
  px: 1.2,
  backgroundColor: '#e3f2fd',
  color: '#1976d2',
  '&:hover': { backgroundColor: '#bbdefb' },
  border: '1px solid #90caf9',
};

export const buttonDeleteSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  py: 0.4,
  px: 1.4,
};

// Common spacing constants
export const FORM_SPACING = 2.5;
export const SECTION_SPACING = 1.5;
export const ELEMENT_GAP = 1.5;
export const BORDER_RADIUS = 2;

// Common component styles
export const formPaperSx: SxProps<Theme> = {
  p: FORM_SPACING,
  borderRadius: BORDER_RADIUS,
  backgroundColor: 'background.paper',
};

export const summaryPaperSx: SxProps<Theme> = {
  p: FORM_SPACING,
  mb: SECTION_SPACING,
  borderRadius: BORDER_RADIUS,
  backgroundColor: 'background.paper',
};
