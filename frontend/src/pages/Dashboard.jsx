import React from "react";
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { Box, Container, Typography, Grid, Card, CardContent, Button, IconButton, Chip, Stack, useTheme, Avatar, LinearProgress } from "@mui/material";
import { Speed as SpeedIcon, Security as SecurityIcon, Payment as PaymentIcon, Support as SupportIcon, Star as StarIcon, TrendingUp as TrendingUpIcon, AccountBalance as AccountIcon, Book as BookIcon, Person as PersonIcon, Business as ProjectIcon, Apartment as UnitIcon, Assessment as ReportIcon, Share as ShareIcon, Hotel as HotelIcon, People as PeopleIcon, Settings as SettingsIcon, Add as AddIcon, Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon, CalendarToday as CalendarIcon, AccessTime as TimeIcon, CheckCircle as CheckIcon, Warning as WarningIcon, Error as ErrorIcon } from '@mui/icons-material';

export default function Dashboard() {
  const { t } = useTranslation();
  const { direction, currentLanguage, userSettings, screenSize } = useAppTheme();
  const theme = useTheme();

  // آمار کلی
  const stats = [
    { 
      title: t('dashboard.stats.totalAccounts'), 
      value: '1,234', 
      icon: <AccountIcon />, 
      color: theme.palette.primary.main,
      change: '+12%',
      changeType: 'positive',
      progress: 75
    },
    { 
      title: t('dashboard.stats.totalJournals'), 
      value: '567', 
      icon: <BookIcon />, 
      color: theme.palette.secondary.main,
      change: '+8%',
      changeType: 'positive',
      progress: 60
    },
    { 
      title: t('dashboard.stats.totalPeople'), 
      value: '890', 
      icon: <PersonIcon />, 
      color: theme.palette.success.main,
      change: '+15%',
      changeType: 'positive',
      progress: 85
    },
    { 
      title: t('dashboard.stats.totalProjects'), 
      value: '123', 
      icon: <ProjectIcon />, 
      color: theme.palette.info.main,
      change: '+5%',
      changeType: 'positive',
      progress: 45
    }
  ];

  // عملیات سریع
  const quickActions = [
    {
      title: t('dashboard.quickActions.addProject'),
      description: t('dashboard.quickActions.addProjectDesc'),
      icon: <ProjectIcon />,
      color: theme.palette.primary.main,
      path: '/projects/add'
    },
    {
      title: t('dashboard.quickActions.addUnit'),
      description: t('dashboard.quickActions.addUnitDesc'),
      icon: <UnitIcon />,
      color: theme.palette.secondary.main,
      path: '/units/add'
    },
    {
      title: t('dashboard.quickActions.addReservation'),
      description: t('dashboard.quickActions.addReservationDesc'),
      icon: <BookIcon />,
      color: theme.palette.success.main,
      path: '/reservations/add'
    },
    {
      title: t('dashboard.quickActions.addHotel'),
      description: t('dashboard.quickActions.addHotelDesc'),
      icon: <HotelIcon />,
      color: theme.palette.info.main,
      path: '/hotels/add'
    }
  ];

  // فعالیت‌های اخیر
  const recentActivities = [
    {
      title: t('dashboard.recentActivities.newReservation'),
      description: t('dashboard.recentActivities.newReservationDesc'),
      time: t('dashboard.recentActivities.twoMinutesAgo'),
      type: 'reservation',
      icon: <BookIcon />,
      color: theme.palette.success.main
    },
    {
      title: t('dashboard.recentActivities.paymentCompleted'),
      description: t('dashboard.recentActivities.paymentCompletedDesc'),
      time: t('dashboard.recentActivities.fifteenMinutesAgo'),
      type: 'payment',
      icon: <PaymentIcon />,
      color: theme.palette.primary.main
    },
    {
      title: t('dashboard.recentActivities.userRegistered'),
      description: t('dashboard.recentActivities.userRegisteredDesc'),
      time: t('dashboard.recentActivities.oneHourAgo'),
      type: 'user',
      icon: <PersonIcon />,
      color: theme.palette.info.main
    }
  ];

  // رویدادهای آینده
  const upcomingEvents = [
    {
      title: t('dashboard.upcomingEvents.projectReviewMeeting'),
      description: t('dashboard.upcomingEvents.projectReviewMeetingDesc'),
      time: '14:00',
      date: 'امروز',
      type: 'meeting',
      icon: <CalendarIcon />,
      color: theme.palette.warning.main
    },
    {
      title: t('dashboard.upcomingEvents.nextWeekReservations'),
      description: t('dashboard.upcomingEvents.nextWeekReservationsDesc'),
      time: '09:00',
      date: 'فردا',
      type: 'task',
      icon: <CheckIcon />,
      color: theme.palette.info.main
    },
    {
      title: t('dashboard.upcomingEvents.monthlyFinancialReport'),
      description: t('dashboard.upcomingEvents.monthlyFinancialReportDesc'),
      time: '16:00',
      date: 'پس‌فردا',
      type: 'report',
      icon: <ReportIcon />,
      color: theme.palette.secondary.main
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header Section */}
      <Box maxWidth="lg" sx={{
        mx: 'auto',
        mb: { xs: 3, sm: 4, md: 5 },
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        p: { xs: 2, sm: 3, md: 4 },
        boxShadow: theme.shadows[1],
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.primary.main,
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 }
              }}
            >
                              <SpeedIcon />
            </Avatar>
            <Box>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  mb: 1,
                  color: theme.palette.text.primary
                }}
              >
                {t('dashboard.welcome')}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.text.secondary
                }}
              >
                {t('dashboard.subtitle')}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              color: theme.palette.text.primary,
              textAlign: 'left'
            }}
          >
            {t('dashboard.overview')}
          </Typography>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: theme.transitions.create(['all'], {
                      easing: theme.transitions.easing.easeInOut,
                      duration: theme.transitions.duration.standard,
                    }),
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                      borderColor: stat.color
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: theme.shape.borderRadius, 
                        backgroundColor: `${stat.color}15`,
                        color: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {stat.icon}
                      </Box>
                      <Chip 
                        label={stat.change} 
                        sx={{ 
                          backgroundColor: stat.changeType === 'positive' ? theme.palette.success.light : theme.palette.error.light,
                          color: stat.changeType === 'positive' ? theme.palette.success.dark : theme.palette.error.dark,
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 1,
                        color: theme.palette.text.primary
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        mb: 2
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={stat.progress} 
                      sx={{ 
                        height: 6, 
                        borderRadius: theme.shape.borderRadius,
                        backgroundColor: `${stat.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stat.color,
                          borderRadius: theme.shape.borderRadius
                        }
                      }} 
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Quick Actions Section */}
      <Box sx={{ 
        mb: { xs: 4, sm: 5, md: 6 },
        p: { xs: 2, sm: 3, md: 4 },
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: { xs: 3, sm: 4 },
              color: theme.palette.text.primary,
              textAlign: 'left'
            }}
          >
            {t('dashboard.quickAccess')}
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    backgroundColor: theme.palette.background.default,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: theme.transitions.create(['all'], {
                      easing: theme.transitions.easing.easeInOut,
                      duration: theme.transitions.duration.standard,
                    }),
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                      borderColor: action.color
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: theme.shape.borderRadius, 
                      backgroundColor: `${action.color}15`,
                      color: action.color,
                      mb: 2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {action.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        color: theme.palette.text.primary
                      }}
                    >
                      {action.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary
                      }}
                    >
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Recent Activities & Upcoming Events Section */}
      <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Recent Activities */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  color: theme.palette.text.primary
                }}
              >
                {t('dashboard.recentActivity')}
              </Typography>
              <Grid container spacing={2}>
                {recentActivities.map((activity, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        transition: theme.transitions.create(['all'], {
                          easing: theme.transitions.easing.easeInOut,
                          duration: theme.transitions.duration.standard,
                        }),
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4]
                        }
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ 
                            p: 1, 
                            borderRadius: theme.shape.borderRadius, 
                            backgroundColor: `${activity.color}15`,
                            color: activity.color,
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {activity.icon}
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.text.secondary
                            }}
                          >
                            {activity.time}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 1,
                            color: theme.palette.text.primary
                          }}
                        >
                          {activity.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.text.secondary,
                            lineHeight: 1.5
                          }}
                        >
                          {activity.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Upcoming Events */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  mb: { xs: 2, sm: 3 },
                  color: theme.palette.text.primary
                }}
              >
                {t('dashboard.upcomingEvents.title')}
              </Typography>
              <Stack spacing={2}>
                {upcomingEvents.map((event, index) => (
                  <Card 
                    key={index}
                    sx={{ 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: theme.transitions.create(['all'], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.standard,
                      }),
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          p: 1, 
                          borderRadius: theme.shape.borderRadius, 
                          backgroundColor: `${event.color}15`,
                          color: event.color,
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {event.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: theme.palette.text.secondary
                            }}
                          >
                            {event.date} - {event.time}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 1,
                          color: theme.palette.text.primary
                        }}
                      >
                        {event.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                                                sx={{ 
                          color: theme.palette.text.secondary
                        }}
                      >
                        {event.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
} 
