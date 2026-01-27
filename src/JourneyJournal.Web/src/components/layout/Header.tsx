import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ExploreIcon from '@mui/icons-material/Explore';
import { tripService } from '../../services/tripService';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  const open = Boolean(anchorEl);

  // Only check API availability on the home page
  const shouldCheckApi = location.pathname === '/';

  useEffect(() => {
    if (!shouldCheckApi) {
      setApiAvailable(true);
      return;
    }

    const checkApiAvailability = async () => {
      try {
        await tripService.getAll();
        setApiAvailable(true);
      } catch (error) {
        setApiAvailable(false);
      }
    };

    checkApiAvailability();
  }, [shouldCheckApi]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <ExploreIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Journey Journal
        </Typography>
        {apiAvailable && (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenuClick}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => handleMenuItemClick('/expenses/create')}>
                Add Expense
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('/trips/create')}>
                Add Trip
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('/expenses')}>
                Expenses
              </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('/trips')}>
                Trips
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
