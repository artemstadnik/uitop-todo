import { createTheme } from '@mui/material/styles';

const INDIGO = '#4f46e5';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: INDIGO },
    background: { default: '#f4f4f7', paper: '#ffffff' },
    text: { primary: '#1e1b2e', secondary: '#6b7280' },
    divider: 'rgba(30, 27, 46, 0.08)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    h4: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(30, 27, 46, 0.06)',
          boxShadow: '0 1px 2px rgba(16, 12, 40, 0.04), 0 12px 32px rgba(16, 12, 40, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 22, boxShadow: 'none' },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
            '&:hover': { background: 'linear-gradient(180deg, #5b5bf0 0%, #4338ca 100%)' },
          },
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          '& fieldset': { borderColor: 'rgba(30, 27, 46, 0.12)' },
          '&:hover fieldset': { borderColor: 'rgba(79, 70, 229, 0.4)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(79, 70, 229, 0.25)',
          color: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.06)',
          fontWeight: 600,
        },
      },
    },
  },
});
