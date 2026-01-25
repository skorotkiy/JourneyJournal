import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import TripListPage from './pages/TripListPage';
import TripsPage from './pages/TripsPage';
import TripDetailPage from './pages/TripDetailPage';
import ExpensesPage from './pages/ExpensesPage';
import EditExpensePage from './pages/EditExpensePage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="trips" element={<TripListPage />} />
            <Route path="trips/view" element={<TripsPage />} />
            <Route path="trips/:tripId" element={<TripDetailPage />} />
            <Route path="trips/create" element={<TripsPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="expenses/create" element={<ExpensesPage />} />
            <Route path="trips/:tripId/expenses/:expenseId/edit" element={<EditExpensePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
