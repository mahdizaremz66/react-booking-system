import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { Box, Drawer, List, Typography, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Avatar } from '@mui/material';
import { ExpandLess, ExpandMore, PushPin, Dashboard as DashboardIcon, AccountBalance as AccountBalanceIcon, Hotel as HotelIcon, People as PeopleIcon, Person as PersonIcon, Book as BookIcon, Receipt as ReceiptIcon, AccountTree as AccountTreeIcon, Settings as SettingsIcon, Apartment as ApartmentIcon, Assignment as AssignmentIcon, Lock as LockIcon, AccountCircle as AccountCircleIcon, Palette as PaletteIcon, Business as BusinessIcon } from '@mui/icons-material';

// آیکون‌های منو
const iconMap = {
  AccountBalance: AccountBalanceIcon,
  Hotel: HotelIcon,
  People: PeopleIcon,
  Person: PersonIcon,
  Book: BookIcon,
  Receipt: ReceiptIcon,
  AccountTree: AccountTreeIcon,
  Settings: SettingsIcon,
  Apartment: ApartmentIcon,
  Assignment: AssignmentIcon,
  Lock: LockIcon,
  AccountCircle: AccountCircleIcon,
  Palette: PaletteIcon,
  Business: BusinessIcon
};

export default function Sidebar({
  open,
  pinned,
  expandedMenus,
  handlePin,
  handleMenuToggle,
  handleMenuClick,
  menuItems,
  user,
  handleSidebarClose
}) {
  const { t } = useTranslation();
  const { currentLanguage, screenSize, getResponsiveValue, theme } = useAppTheme();

  // کنترل رندر سایدبار
  const [shouldRender, setShouldRender] = useState(open || pinned);

  // تنظیم background برای RTL/LTR
  useEffect(() => {
    const sidebarProfile = document.querySelector('.sidebar-profile');
    if (sidebarProfile) {
      sidebarProfile.style.background = theme.palette.components.gradients.primary;
    }
  }, [theme.palette.components.gradients.primary, open, pinned]);

  // تنظیم مجدد background با تغییر زبان
  useEffect(() => {
    const sidebarProfile = document.querySelector('.sidebar-profile');
    if (sidebarProfile) {
      // کمی تاخیر برای اطمینان از اعمال تغییرات RTL
      setTimeout(() => {
        sidebarProfile.style.background = theme.palette.components.gradients.primary;
      }, 100);
    }
  }, [currentLanguage, theme.palette.components.gradients.primary]);

  // کنترل رندر سایدبار
  useEffect(() => {
    if (open || pinned) {
      setShouldRender(true);
    } else {
      // تاخیر کوتاه برای بسته شدن
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open, pinned]);

  // حفظ gradient با interval
  useEffect(() => {
    const interval = setInterval(() => {
      const sidebarProfile = document.querySelector('.sidebar-profile');
      if (sidebarProfile) {
        const currentBackground = sidebarProfile.style.background;
        const expectedBackground = theme.palette.components.gradients.primary;

        if (currentBackground !== expectedBackground) {
          sidebarProfile.style.background = expectedBackground;
        }
      }
    }, 500); // چک هر 500ms

    return () => clearInterval(interval);
  }, [theme.palette.components.gradients.primary]);

  // نقش به فارسی/انگلیسی
  const getRoleText = (role) => {
    if (role === 'admin') return t('user.admin');
    if (role === 'viewer') return t('user.viewer');
    return role || '';
  };

  const roleText = getRoleText(user?.usrRole);

  // نام برای نمایش - استفاده از فیلد جدید usrName
  const displayName = user?.usrName || user?.usrUsername || '';
  // آواتار: اگر عکس نبود، حرف اول نام
  const avatarLetter = displayName ? displayName[0] : 'U';
  // عکس آواتار - استفاده از camelCase
  const avatarSrc = user?.usrAvatar || null;

  // تابع رندر آیکون
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    shouldRender && (
      <Drawer
        variant="permanent"
        //variant={isMobile || isSmallMobile ? "temporary" : "permanent"}
        open={open}
        onClose={handleSidebarClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: open ? theme.palette.sidebar.width.open : theme.palette.sidebar.width.closed,
          flexShrink: 0,
          zIndex: 1200,
          height: '100%',
          '& .MuiDrawer-paper': {
            width: open ? theme.palette.sidebar.width.open : theme.palette.sidebar.width.closed,
            height: '100%',
            boxSizing: 'border-box',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: open ? theme.shadows[6] : theme.shadows[1],
            '&:hover': {
              width: open ? theme.palette.sidebar.width.open : theme.palette.sidebar.width.hover,
              boxShadow: open ? theme.shadows[8] : theme.shadows[3],
            },
          },
        }}
      >
        {/* پروفایل کاربر با دکمه پین */}
        {user && (
          <Box
            className="sidebar-profile"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: getResponsiveValue('sidebar.profile.paddingY'),
              px: getResponsiveValue('sidebar.profile.paddingX'),
              color: 'white',
              borderBottom: `1px solid ${theme.palette.transparent.white}`,
              boxShadow: theme.shadows[2],
              minHeight: getResponsiveValue('sidebar.profile.height'),
              gap: 1
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 0, flex: 1, gap: 1 }}>
              <Box sx={{
                width: getResponsiveValue('sidebar.profile.avatar'),
                height: getResponsiveValue('sidebar.profile.avatar'),
                borderRadius: "50%",
                overflow: 'hidden',
                boxShadow: theme.shadows[2],
                bgcolor: theme.palette.transparent.iconButton,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {avatarSrc ? (
                  <Avatar
                    src={avatarSrc}
                    alt={displayName}
                    sx={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                ) : (
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white'
                    }}
                  >
                    {avatarLetter}
                  </Typography>
                )}
              </Box>
              {/* در موبایل فقط آواتار نمایش داده شود */}
              {screenSize !== 'xs' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', ml: 2, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      width: '100%',
                      textShadow: `0 2px 8px ${theme.palette.shadow.medium}`,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.85,
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {roleText}
                  </Typography>
                </Box>
              )}
              {/* در موبایل هم اطلاعات کامل نمایش داده شود */}
              {screenSize === 'xs' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', ml: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      width: '100%',
                      textShadow: `0 2px 8px ${theme.palette.shadow.medium}`,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.85,
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {roleText}
                  </Typography>
                </Box>
              )}
            </Box>
            {/* دکمه پین فقط در دسکتاپ نمایش داده شود */}
            {screenSize !== 'xs' && screenSize !== 'sm' && (
              <IconButton
                onClick={handlePin}
                color={pinned ? 'secondary' : 'default'}
                sx={{
                  ml: 1,
                  bgcolor: pinned ? theme.palette.neutral.white : theme.palette.transparent.iconButton,
                  color: pinned ? 'primary.main' : 'white',
                  borderRadius: theme.shape.borderRadius,
                  transition: theme.transitions.create(['background-color', 'color', 'opacity'], {
                    easing: theme.transitions.easing.easeInOut,
                    duration: theme.transitions.duration.shorter,
                  }),
                  opacity: 1,
                  '&:hover': {
                    bgcolor: theme.palette.neutral.white,
                    color: 'primary.main',
                    opacity: 0.9,
                  },
                  width: 36,
                  height: 36
                }}
              >
                <PushPin />
              </IconButton>
            )}
          </Box>
        )}

        <List sx={{ pt: 1, flex: 1, overflowY: 'auto' }}>
          {/* داشبورد */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleMenuClick('/dashboard');
                // در موبایل سایدبار بسته شود
                if (screenSize === 'xs' && !pinned) {
                  handleMenuToggle && handleMenuToggle();
                }
              }}
              sx={{
                minHeight: getResponsiveValue('sidebar.menu.itemHeight'),
              }}
            >
              <ListItemIcon sx={{
                color: 'inherit',
                minWidth: getResponsiveValue('sidebar.menu.iconSize'),
              }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary={t('navigation.dashboard')}
                sx={{}}
              />
            </ListItemButton>
          </ListItem>

          {/* منوهای اصلی */}
          {menuItems.map((menu) => (
            <Box key={menu.title}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleMenuToggle(menu.title)}
                  sx={{
                    minHeight: getResponsiveValue('sidebar.menu.itemHeight'),
                  }}
                >
                  <ListItemIcon sx={{
                    color: 'inherit',
                    minWidth: getResponsiveValue('sidebar.menu.iconSize'),
                  }}>
                    {renderIcon(menu.icon)}
                  </ListItemIcon>
                  <ListItemText
                    primary={menu.title}
                    sx={{}}
                  />
                  {(expandedMenus[menu.title] ?
                    <ExpandLess /> :
                    <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>
              <Collapse in={expandedMenus[menu.title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menu.children.map((child) => (
                    <ListItemButton
                      key={child.title}
                      sx={{
                        pl: getResponsiveValue('sidebar.menu.subItemPaddingLeft'),
                        minHeight: getResponsiveValue('sidebar.menu.subItemHeight'),
                      }}
                      onClick={() => {
                        handleMenuClick(child.path);
                        // در موبایل سایدبار بسته شود
                        if (screenSize === 'xs' && !pinned) {
                          handleMenuToggle && handleMenuToggle();
                        }
                      }}
                    >
                      <ListItemIcon sx={{
                        color: 'inherit',
                        minWidth: getResponsiveValue('sidebar.menu.subIconSize'),
                      }}>
                        {renderIcon(child.icon)}
                      </ListItemIcon>
                      <ListItemText
                        primary={child.title}
                        sx={{}}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Drawer>
    )
  );
}
