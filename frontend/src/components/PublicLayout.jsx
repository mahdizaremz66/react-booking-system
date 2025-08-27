import React from 'react';
import { useAppTheme } from '../theme';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout({ children }) {
  const { theme } = useAppTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
      <CssBaseline />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
} 