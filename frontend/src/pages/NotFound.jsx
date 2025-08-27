import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const navigate = useNavigate();


  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.background.default
    }}>
      <Container maxWidth="md">
        <Box sx={{
          textAlign: 'center',
          py: { xs: 6, md: 8 }
        }}>
          <Typography 
            variant="h1" 
            sx={{
              color: theme.palette.primary.main,
              mb: 2
            }}
          >
            404
          </Typography>
          <Typography 
            variant="h4" 
            sx={{
              color: theme.palette.text.primary,
              mb: 3
            }}
          >
            {t('notFound.title')}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              maxWidth: 500,
              mx: 'auto'
            }}
          >
            {t('notFound.message')}
          </Typography>
          <Button 
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5
            }}
          >
            {t('notFound.backHome')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
} 