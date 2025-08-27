import React from "react";
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Stack, useTheme } from "@mui/material";
import { Speed as SpeedIcon, Security as SecurityIcon, Payment as PaymentIcon, Support as SupportIcon, Star as StarIcon, LocationOn as LocationIcon, Phone as PhoneIcon, Email as EmailIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import BannerSlider from "../components/BannerSlider";

export default function Home() {
  const { t } = useTranslation();
  const { currentLanguage, direction, screenSize } = useAppTheme();
  const theme = useTheme();

  const features = [
    {
      icon: <SpeedIcon />,
      title: t('home.features.speed.title'),
      description: t('home.features.speed.description'),
      color: theme.palette.primary.main
    },
    {
      icon: <SecurityIcon />,
      title: t('home.features.security.title'),
      description: t('home.features.security.description'),
      color: theme.palette.secondary.main
    },
    {
      icon: <PaymentIcon />,
      title: t('home.features.payment.title'),
      description: t('home.features.payment.description'),
      color: theme.palette.success.main
    },
    {
      icon: <SupportIcon />,
      title: t('home.features.support.title'),
      description: t('home.features.support.description'),
      color: theme.palette.info.main
    }
  ];

  const stats = [
    { number: '10K+', label: t('home.stats.users') },
    { number: '50+', label: t('home.stats.destinations') },
    { number: '99%', label: t('home.stats.satisfaction') },
    { number: '24/7', label: t('home.stats.support') }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      {/* Hero Section with Slider */}
      <Box sx={{ 
        position: 'relative',
        height: '100vh',
        overflow: 'hidden'
      }}>
        <BannerSlider />
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: { xs: 4, md: 6 },
        backgroundColor: theme.palette.background.paper
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography 
              variant="sliderTitle" 
              //component="sliderTitle" 
              sx={{ 
                mb: 2,
                color: theme.palette.text.primary
              }}
            >
              {t('home.whyChooseUs.title')}
            </Typography>
            <Typography 
              variant="h1" 
              sx={{ 
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              {t('home.whyChooseUs.subtitle')}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card className="featureCard">
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <Box sx={{ 
                        color: feature.color,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <Box className="featureIcon">
                          {feature.icon}
                        </Box>
                      </Box>
                    </Box>
                    <Typography 
                      variant="h3" 
                      component="h3" 
                      sx={{ 
                        mb: 2, 
                        color: theme.palette.text.primary,
                        textAlign: 'center'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        textAlign: 'center'
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        py: { xs: 6, md: 8 },
        backgroundColor: theme.palette.background.default,
        backgroundImage: theme.palette.components.gradients.secondary
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid key={index} size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="sliderTitle" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      mb: 1
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.text.secondary
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: { xs: 6, md: 10 },
        backgroundColor: theme.palette.background.paper
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto'
          }}>
            <Typography 
              variant="sliderTitle" 
              component="h2" 
              sx={{ 
                mb: 3,
                color: theme.palette.text.primary
              }}
            >
              {t('home.cta.title')}
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 4,
                color: theme.palette.text.secondary
              }}
            >
              {t('home.cta.subtitle')}
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              <Button 
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5
                }}
              >
                {t('home.cta.primaryButton')}
              </Button>
              <Button 
                sx={{ 
                  px: 4, 
                  py: 1.5
                }}
              >
                {t('home.cta.secondaryButton')}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 