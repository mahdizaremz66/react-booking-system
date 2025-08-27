import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Menu as MenuIcon, ChevronRight, ChevronLeft } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function DashboardLayout({ children }) {
  const { t } = useTranslation();
  const { direction, currentLanguage, screenSize, theme } = useAppTheme();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarPinned, setSidebarPinned] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarPinned');
      return saved === 'true';
    }
    return false;
  });
  const [expandedMenus, setExpandedMenus] = useState({});

  // منوی داشبورد
  const menuItems = [
    {
      title: t('navigation.accounting'),
      icon: 'AccountBalance',
      children: [
        {
          title: t('accounting.accountList'),
          path: '/accounting/accounts',
          icon: 'AccountTree'
        },
        {
          title: t('accounting.journalList'),
          path: '/accounting/journals',
          icon: 'Receipt'
        }
      ]
    },
    {
      title: t('navigation.booking'),
      icon: 'Book',
      children: [
        {
          title: t('booking.bookingList'),
          path: '/booking/list',
          icon: 'Assignment'
        },
        {
          title: t('booking.newBooking'),
          path: '/booking/new',
          icon: 'Book'
        }
      ]
    },
    {
      title: t('navigation.hotels'),
      icon: 'Hotel',
      children: [
        {
          title: t('hotels.hotelList'),
          path: '/hotels/list',
          icon: 'Apartment'
        },
        {
          title: t('hotels.addHotel'),
          path: '/hotels/add',
          icon: 'Hotel'
        }
      ]
    },
    {
      title: t('navigation.users'),
      icon: 'People',
      children: [
        {
          title: t('users.userList'),
          path: '/users/list',
          icon: 'Person'
        },
        {
          title: t('users.addUser'),
          path: '/users/add',
          icon: 'AccountCircle'
        }
      ]
    },
    {
      title: t('navigation.settings'),
      icon: 'Settings',
      children: [
        {
          title: t('settings.theme.title'),
          path: '/settings/theme',
          icon: 'Palette'
        },

        {
          title: t('settings.general'),
          path: '/settings/general',
          icon: 'Settings'
        },
        {
          title: t('settings.security'),
          path: '/settings/security',
          icon: 'Lock'
        }
      ]
    }
  ];

  const handleSidebarOpen = () => {
    if (!sidebarPinned) setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (!sidebarPinned) setSidebarOpen(false);
  };

  const handleSidebarPin = () => {
    // در موبایل امکان پین کردن وجود ندارد
    if (screenSize === 'xs' || screenSize === 'sm') return;
    
    const newPinned = !sidebarPinned;
    setSidebarPinned(newPinned);
    localStorage.setItem('sidebarPinned', newPinned.toString());
  };

  const handleBackdropClick = () => {
    if (!sidebarPinned) {
      setSidebarOpen(false);
    }
  };

  const handleMenuToggle = (menuTitle) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuTitle]: !prev[menuTitle]
    }));
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (!sidebarPinned) setSidebarOpen(false);
  };

  // تنظیم gradient محتوای اصلی بر اساس زبان و تم
  useEffect(() => {
    const updateMainContentGradient = () => {
      const mainContent = document.querySelector('.main-content-area');
      if (mainContent) {
        mainContent.style.background = theme.palette.components.gradients.secondary;
      }
    };

    // اجرای فوری
    updateMainContentGradient();

    // اجرا بعد از رندر کامل
    const timer = setTimeout(updateMainContentGradient, 100);

    return () => clearTimeout(timer);
  }, [theme.palette.components.gradients.secondary]);

  // آنپین کردن سایدبار در موبایل
  useEffect(() => {
    if (screenSize === 'xs' || screenSize === 'sm') {
      if (sidebarPinned) {
        setSidebarPinned(false);
        setSidebarOpen(false);
        localStorage.setItem('sidebarPinned', 'false');
      }
    }
  }, [screenSize, sidebarPinned]);

  // دکمه کوچک کنار صفحه برای باز کردن سایدبار
  const sidebarButton = (
    <Box
      onClick={handleSidebarOpen}
      sx={{
        position: 'fixed',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2000,
        width: 48,
        height: 48,
        bgcolor: 'primary.main',
        opacity: 0.8,
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: theme.shadows[8],
        transition: theme.transitions.create(['all'], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.standard,
        }),
        '&:hover': {
          bgcolor: 'primary.dark',
          opacity: 1,
          boxShadow: theme.shadows[12],
          transform: 'translateY(-50%) scale(1.1)',
        },
      }}
    >
      {sidebarOpen ? 
        (direction === 'rtl' ? 
          <ChevronRight sx={{ color: theme.palette.neutral.white }} /> : 
          <ChevronLeft sx={{ color: theme.palette.neutral.white }} />
        ) : 
        <MenuIcon sx={{ color: theme.palette.neutral.white }} />
      }
    </Box>
  );

  if (!user) return null;
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Header />
      
      {/* دکمه سایدبار */}
      {!sidebarPinned && sidebarButton}
      
      {/* Main Content Area with Sidebar */}
      <Box sx={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 0, // مهم: برای flexbox
      }}>
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          pinned={sidebarPinned}
          expandedMenus={expandedMenus}
          handlePin={handleSidebarPin}
          handleMenuToggle={handleMenuToggle}
          handleSidebarClose={handleSidebarClose}
          handleMenuClick={handleMenuClick}
          menuItems={menuItems}
          user={user}
        />
        
        {/* Main Content */}
        <Box
          component="main"
          className="main-content-area"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            minHeight: 0, // مهم: برای flexbox
            boxShadow: theme.shadows[1],
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.components.gradients.secondary,
            transition: theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          }}
        >
          {/* Content Container */}
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: { xs: 0.5, sm: 1, md: 1.5 },
            minHeight: 0, // مهم: برای flexbox
            display: 'flex',
            flexDirection: 'column',
          }}>
              {children}
          </Box>
        </Box>
      </Box>
      
      {/* Footer */}
      <Footer forceMobile={true} />
    </Box>
  );
}
