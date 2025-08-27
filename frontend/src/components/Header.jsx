import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { Menu, MenuItem, Avatar, Button, Typography, Box, IconButton, AppBar, Toolbar, Divider, Tooltip } from "@mui/material";
import { Menu as MenuIcon, Dashboard as DashboardIcon, Logout as LogoutIcon, FontDownload as FontDownloadIcon, DarkMode as DarkModeIcon, Lock as LockIcon, LightMode as LightModeIcon, Language as LanguageIcon } from '@mui/icons-material';
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
  const { t } = useTranslation();
  const { currentLanguage, toggleLanguage, toggleTheme, userSettings, changeFontScale, theme, getSiteConfig, screenSize } = useAppTheme();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // انتخاب نام کاربر برای نمایش
  const displayName = user?.usrName || user?.usrUsername || '';

  // منوی کاربری
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutClick = () => {
    try {
      logout();
      handleMenuClose();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  // منوی موبایل
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);
  const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  // منوی فونت
  const [fontMenuAnchor, setFontMenuAnchor] = useState(null);
  const fontMenuOpen = Boolean(fontMenuAnchor);
  const handleFontMenuOpen = (event) => setFontMenuAnchor(event.currentTarget);
  const handleFontMenuClose = () => setFontMenuAnchor(null);

  // تنظیم gradient هدر بر اساس زبان و تم
  useEffect(() => {
    const updateHeaderGradient = () => {
      const header = document.querySelector('.MuiAppBar-root');
      if (header) {
        header.style.background = theme.palette.components.gradients.primary;
      }
    };

    // اجرای فوری
    updateHeaderGradient();

    // اجرا بعد از رندر کامل
    const timer = setTimeout(updateHeaderGradient, 100);

    return () => clearTimeout(timer);
  }, [theme.palette.components.gradients.primary]);

  const headerMenuItems = [
    { label: t('navigation.home'), href: '/' },
    { label: t('navigation.news'), href: '#' },
    { label: t('navigation.rules'), href: '#' },
    { label: t('navigation.about'), href: '#' },
    { label: t('navigation.contact'), href: '#' }
  ];

  const fontScales = [
    { value: 'small', label: t('settings.fontSize.small') },
    { value: 'normal', label: t('settings.fontSize.normal') },
    { value: 'large', label: t('settings.fontSize.large') },
    { value: 'xlarge', label: t('settings.fontSize.xlarge') }
  ];

  return (
    <AppBar position='static' sx={{borderRadius:0}}>
      <Toolbar>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          gap: { xs: 1, sm: 2, md: 4 }
        }}>
          {/* لوگو و نام سایت */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0
          }}>
            <RouterLink
              to="/"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                transition: 'all 0.3s ease',
                borderRadius: theme.shape.borderRadius,
                padding: '8px 12px',
                color: 'white'
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: { xs: '200px', sm: '250px', md: '300px' },

                }}
              >
                {getSiteConfig(currentLanguage).logo ? (
                  <Box
                    component="img"
                    src={getSiteConfig(currentLanguage).logo}
                    alt={getSiteConfig(currentLanguage).title}
                    sx={{
                      height: { xs: 24, sm: 28, md: 32 },
                      width: 'auto',
                      mr: 1,
                      filter: 'brightness(0) invert(1)', // سفید کردن لوگو
                    }}
                  />
                ) : (
                  <Box component="span" sx={{ mr: 1, fontSize: { xs: 20, sm: 24, md: 28 } }}>
                    🌍
                  </Box>
                )}
                <Box component="span" sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {getSiteConfig(currentLanguage).title}
                </Box>
              </Typography>
            </RouterLink>
          </Box>

          {/* منوی ناوبری - وسط */}
          <Box sx={{
            display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' },
            alignItems: 'center',
            gap: 0,
            flex: 1,
            justifyContent: 'center',
            mx: 4
          }}>
            {headerMenuItems.map((item, index) => (
              <Tooltip key={index} title={item.label} arrow>
                <RouterLink
                  to={item.href}
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: theme.shape.borderRadius,
                    transition: 'all 0.3s ease',
                    opacity: 0.9,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.textShadow = `0 0 10px ${theme.palette.transparent.white}, 0 0 20px ${theme.palette.transparent.iconButton}`;
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textShadow = 'none';
                    e.target.style.opacity = '0.9';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {item.label}
                </RouterLink>
              </Tooltip>
            ))}
          </Box>

          {/* دکمه‌های آیکونی و ورود */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0
          }}>
            {/* دکمه‌های آیکونی - فقط در دسکتاپ */}
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'none' , lg: 'flex' }, alignItems: 'center', gap: 1 }}>
              <Tooltip title={t('settings.fontSize.title')} arrow>
                <IconButton
                  onClick={handleFontMenuOpen}
                  sx={{
                    backgroundColor: theme.palette.transparent.iconButton,
                    borderRadius: theme.shape.borderRadius,
                    color: theme.palette.neutral.white,
                    padding: 1,
                  }}
                >
                  <FontDownloadIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={t(theme.palette.components.themeToggle.tooltip)} arrow>
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    bgcolor: theme.palette.transparent.iconButton, 
                    borderRadius: theme.shape.borderRadius,
                    color: theme.palette.neutral.white,
                    padding: 1,
                  }}
                >
                  {theme.palette.components.themeToggle.icon === 'LightMode' ?
                    <LightModeIcon /> :
                    <DarkModeIcon />
                  }
                </IconButton>
              </Tooltip>

              <Tooltip title={t('settings.language.title')} arrow>
                <IconButton
                  onClick={toggleLanguage}
                  sx={{
                    bgcolor: theme.palette.transparent.iconButton, 
                    borderRadius: theme.shape.borderRadius,
                    color: theme.palette.neutral.white,
                    padding: 1,
                  }}
                >
                  <LanguageIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* دکمه منوی موبایل - قبل از دکمه ورود/ثبت‌نام */}
            {(screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md') && (
              <Tooltip title={t('navigation.menu')} arrow>
                <IconButton
                  onClick={handleMobileMenuOpen}
                  sx={{
                    bgcolor: theme.palette.transparent.iconButton, 
                    borderRadius: theme.shape.borderRadius,
                    color: theme.palette.neutral.white,
                    padding: 1,
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* دکمه ورود/ثبت نام */}
            {!user ? (
              <Tooltip title={t('auth.loginRegister')} arrow>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    backgroundColor: theme.palette.neutral.white,
                    color: theme.palette.primary.main,
                    padding: '8px 20px',
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: `0 2px 8px ${theme.palette.transparent.overlay}`,
                    transition: 'all 0.3s ease',
                    minWidth: '90px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    '&:hover': {
                      backgroundColor: theme.palette.transparent.white,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 12px ${theme.palette.transparent.overlay}`
                    }
                  }}
                >
                  {t('auth.loginRegister')}
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title={displayName} arrow>
                <Button
                  onClick={handleMenu}
                  sx={{
                    backgroundColor: theme.palette.neutral.white,
                    color: theme.palette.primary.main,
                    padding: '8px 20px',
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: `0 2px 8px ${theme.palette.transparent.overlay}`,
                    transition: 'all 0.3s ease',
                    minWidth: '90px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    '&:hover': {
                      backgroundColor: theme.palette.transparent.white,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 12px ${theme.palette.transparent.overlay}`
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.neutral.white,
                      mr: 1
                    }}
                  >
                    {displayName ? displayName[0].toUpperCase() : 'U'}
                  </Avatar>
                  <Box
                    component="span"
                    sx={{
                      display: { xs: 'none', sm: 'inline' },
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {displayName}
                  </Box>
                </Button>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Toolbar>

      {/* منوی کاربری */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 8px 32px ${theme.palette.transparent.overlay}`,
              borderRadius: theme.shape.borderRadius
            }
          }
        }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>
          <DashboardIcon sx={{ mr: 2 }} />
          {t('navigation.dashboard')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings/security'); }}>
          <LockIcon sx={{ mr: 2 }} />
          {t('auth.changePassword')}
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          <LogoutIcon sx={{ mr: 2 }} />
          {t('auth.logout')}
        </MenuItem>
      </Menu>

      {/* منوی فونت */}
      <Menu
        anchorEl={fontMenuAnchor}
        open={fontMenuOpen}
        onClose={handleFontMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 150,
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 8px 32px ${theme.palette.transparent.overlay}`,
              borderRadius: theme.shape.borderRadius
            }
          }
        }}
      >
        {fontScales.map((scale) => (
          <MenuItem
            key={scale.value}
            onClick={() => {
              changeFontScale(scale.value);
              handleFontMenuClose();
            }}
            selected={userSettings.fontScale === scale.value}
          >
            {scale.label}
          </MenuItem>
        ))}
      </Menu>

      {/* منوی موبایل */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 250,
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 8px 32px ${theme.palette.transparent.overlay}`,
              borderRadius: theme.shape.borderRadius
            }
          }
        }}
      >
        {headerMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              navigate(item.href);
              handleMobileMenuClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
        <Divider />

        <MenuItem onClick={handleFontMenuOpen}>
          <FontDownloadIcon sx={{ mr: 2 }} />
          {t('settings.fontSize.title')}
        </MenuItem>
        <MenuItem onClick={toggleTheme}>
          {theme.palette.components.themeToggle.icon === 'LightMode' ?
            <LightModeIcon sx={{ mr: 2 }} /> :
            <DarkModeIcon sx={{ mr: 2 }} />
          }
          {t(theme.palette.components.themeToggle.tooltip)}
        </MenuItem>
        <MenuItem onClick={toggleLanguage}>
          <LanguageIcon sx={{ mr: 2 }} />
          {currentLanguage === 'fa' ? 'English' : 'فارسی'}
        </MenuItem>
      </Menu>
    </AppBar>
  );
}