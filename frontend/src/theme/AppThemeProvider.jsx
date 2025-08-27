import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, ThemeProvider as MuiThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import { getCache } from '../utils/rtlCache';
import { themeConfig } from '../config/themeConfig';

// Context
const AppThemeContext = createContext();

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    console.warn('useAppTheme must be used within an AppThemeProvider');
    return {
      currentLanguage: 'fa',
      direction: 'rtl',
      changeLanguage: () => { },
      toggleLanguage: () => { },
      toggleTheme: () => { },
      theme: null,
      userSettings: { fontScale: 'normal' },
      updateUserSettings: () => { },
      changeFontScale: () => { },
      screenSize: 'md',
      getResponsiveValue: () => null,
      getSiteConfig: () => ({}),
      getCompanyConfig: () => ({})
    };
  }
  return context;
};

// Main Provider Component
export function AppThemeProvider({ children }) {
  const { i18n } = useTranslation();

  // Helper functions
  const getLanguageConfig = (languageCode) => {
    return themeConfig.languages[languageCode] || themeConfig.languages.fa;
  };

  const getColorPalette = (mode) => {
    return themeConfig.colorPalettes[mode] || themeConfig.colorPalettes.light;
  };

  const createGradient = (gradientType, direction, mode) => {
    const palette = getColorPalette(mode);
    const gradient = palette.gradients[gradientType];

    if (!gradient) return "transparent";

    const angle = direction === "rtl" ? "270deg" : "90deg";
    return `linear-gradient(${angle}, ${gradient.start} 0%, ${gradient.end} 100%)`;
  };



  const getSiteConfig = (languageCode) => {
    const siteConfig = {
      title: themeConfig.site.title[languageCode] || themeConfig.site.title.fa,
      description: themeConfig.site.description[languageCode] || themeConfig.site.description.fa
    };
    return siteConfig;
  };

  const getCompanyConfig = (languageCode) => {
    const companyConfig = {
      name: themeConfig.company.name[languageCode] || themeConfig.company.name.fa,
      address: themeConfig.company.address[languageCode] || themeConfig.company.address.fa,
      phone: themeConfig.company.phone,
      mobile: themeConfig.company.mobile,
      email: themeConfig.company.email,
      website: themeConfig.company.website,
      socialMedia: themeConfig.company.socialMedia,
      licenses: themeConfig.company.licenses.map(license => ({
        name: license.name[languageCode] || license.name.fa,
        number: license.number,
        url: license.url
      }))
    };
    return companyConfig;
  };

  const calculateFontSize = (baseSize, scale = 'normal') => {
    const fontScales = themeConfig.typography.fontScales;
    const scaleValue = fontScales[scale] || fontScales.normal;
    return Math.round(baseSize * scaleValue);
  };

  const getFontSize = (elementType, size, scale = 'normal') => {
    const fontSizes = themeConfig.typography.fontSizes;
    const elementSizes = fontSizes[elementType];

    if (!elementSizes) {
      console.warn(`Element type '${elementType}' not found in fontSizes`);
      return themeConfig.typography.baseFontSize;
    }

    const baseSize = elementSizes[size];
    if (baseSize === undefined) {
      console.warn(`Size '${size}' not found for element type '${elementType}'`);
      return themeConfig.typography.baseFontSize;
    }

    return calculateFontSize(baseSize, scale);
  };

  const calculateElementHeight = (elementType, size = 'medium', scale = 'normal') => {
    const baseHeights = {
      button: { small: 28, medium: 36, large: 44 },
      input: { small: 24, medium: 32, large: 40 },
      select: { small: 24, medium: 32, large: 40 }
    };

    const baseHeight = baseHeights[elementType]?.[size] || baseHeights.button.medium;
    const fontScales = themeConfig.typography.fontScales;
    const scaleValue = fontScales[scale] || fontScales.normal;

    return Math.round(baseHeight * scaleValue);
  };

  const getTypographyConfig = (scale = 'normal') => {
    const fontScales = themeConfig.typography.fontScales;
    const scaleValue = fontScales[scale] || fontScales.normal;

    return {
      baseFontSize: Math.round(themeConfig.typography.baseFontSize * scaleValue),
      fontSizes: {
        text: {
          xs: getFontSize('text', 'xs', scale),
          sm: getFontSize('text', 'sm', scale),
          base: getFontSize('text', 'base', scale),
          lg: getFontSize('text', 'lg', scale),
          xl: getFontSize('text', 'xl', scale),
          '2xl': getFontSize('text', '2xl', scale),
          '3xl': getFontSize('text', '3xl', scale)
        },
        heading: {
          h1: getFontSize('heading', 'h1', scale),
          h2: getFontSize('heading', 'h2', scale),
          h3: getFontSize('heading', 'h3', scale),
          h4: getFontSize('heading', 'h4', scale),
          h5: getFontSize('heading', 'h5', scale),
          h6: getFontSize('heading', 'h6', scale)
        },
        button: {
          small: getFontSize('button', 'small', scale),
          medium: getFontSize('button', 'medium', scale),
          large: getFontSize('button', 'large', scale)
        },
        input: {
          small: getFontSize('input', 'small', scale),
          medium: getFontSize('input', 'medium', scale),
          large: getFontSize('input', 'large', scale)
        }
      },
      elementHeights: {
        button: {
          small: calculateElementHeight('button', 'small', scale),
          medium: calculateElementHeight('button', 'medium', scale),
          large: calculateElementHeight('button', 'large', scale)
        },
        input: {
          small: calculateElementHeight('input', 'small', scale),
          medium: calculateElementHeight('input', 'medium', scale),
          large: calculateElementHeight('input', 'large', scale)
        },
      }
    };
  };
  
  // Language state
  const [currentLanguage, setCurrentLanguage] = useState('fa');
  const [direction, setDirection] = useState('rtl');
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // User settings state
  const [userSettings, setUserSettings] = useState(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      return { fontScale: 'normal', ...JSON.parse(saved) };
    }
    return { fontScale: 'normal' };
  });
  
  // Screen size detection
  const isDesktop = useMediaQuery('(min-width:1200px)');
  const isTablet = useMediaQuery('(min-width:768px) and (max-width:1199px)');
  const isMobile = useMediaQuery('(min-width:480px) and (max-width:767px)');
  const isSmallMobile = useMediaQuery('(max-width:479px)');

  // تعیین نوع سایز اسکرین بر اساس breakpoint ها
  const getScreenSize = () => {
    if (isSmallMobile) return 'xs';
    if (isMobile) return 'sm';
    if (isTablet) return 'md';
    if (isDesktop) return 'lg';
    return 'xl';
  };

  const screenSize = getScreenSize();

  // تابع helper برای دریافت مقادیر responsive بر اساس screenSize فعلی
  const getResponsiveValue = (path) => {
    const keys = path.split('.');
    let value = theme.palette.components.responsive;

    for (const key of keys) {
      if (value && value[key]) {
        value = value[key];
      } else {
        return null;
      }
    }

    // اگر مقدار responsive object باشد، بر اساس screenSize فعلی مقدار مناسب را برگردان
    if (value && typeof value === 'object' && (value.xs || value.sm || value.md || value.lg || value.xl)) {
      return value[screenSize] || value.md || value.sm || value.xs || value.lg || value.xl;
    }

    return value;
  };

  // Initialize language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || 'fa';

    const languageConfig = getLanguageConfig(savedLanguage);
    setCurrentLanguage(savedLanguage);

    setDirection(languageConfig.direction);
    document.documentElement.dir = languageConfig.direction;
    document.documentElement.lang = savedLanguage;
  }, []);

  // Language functions
  const changeLanguage = (language) => {

    const languageConfig = getLanguageConfig(language);
    i18n.changeLanguage(language);
    setCurrentLanguage(language);

    setDirection(languageConfig.direction);
    document.documentElement.dir = languageConfig.direction;
    document.documentElement.lang = language;
    localStorage.setItem('i18nextLng', language);
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'fa' ? 'en' : 'fa';
    changeLanguage(newLanguage);
  };

  // Theme functions
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // User settings functions
  const updateUserSettings = (newSettings) => {
    const updated = { ...userSettings, ...newSettings };
    setUserSettings(updated);
    localStorage.setItem('userSettings', JSON.stringify(updated));
  };

  const changeFontScale = (scale) => {
    updateUserSettings({ fontScale: scale });
  };

  // Theme effect
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    const html = document.documentElement;
    html.style.direction = direction;
    html.style.writingMode = 'horizontal-tb';
    html.style.textOrientation = 'mixed';
    
    if (isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDark, direction]);

  // Create theme
  const theme = useMemo(() => {
    const languageConfig = getLanguageConfig(currentLanguage);
    const colorPalette = getColorPalette(isDark ? 'dark' : 'light');

    const getFontFamily = (language) => {
      const langConfig = getLanguageConfig(language);
      return `${langConfig.font.primary}, ${langConfig.font.fallback}`;
    };

    return createTheme({
      direction: direction,
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: colorPalette.primary,
        secondary: colorPalette.secondary,
        background: {
          default: colorPalette.background.primary,
          paper: colorPalette.background.paper,
        },
        text: colorPalette.text,
        error: { main: colorPalette.status.error },
        warning: { main: colorPalette.status.warning },
        success: { main: colorPalette.status.success },
        info: { main: colorPalette.status.info },
        neutral: colorPalette.neutral,
        transparent: colorPalette.transparent,
        shadow: colorPalette.shadow,
        border: colorPalette.border,
        // تنظیمات ضروری برای کامپوننت‌ها
        components: {
          // گرادیانت‌های آماده
          gradients: {
            primary: createGradient('primary', direction, isDark ? 'dark' : 'light'),
            secondary: createGradient('secondary', direction, isDark ? 'dark' : 'light'),
            footer: createGradient('footer', direction, isDark ? 'dark' : 'light'),
          },
          // تنظیمات دکمه تغییر تم
          themeToggle: {
            icon: isDark ? 'LightMode' : 'DarkMode',
            tooltip: isDark ? 'settings.theme.light' : 'settings.theme.dark',
          },
          // تنظیمات responsive برای screen sizes
          responsive: {
            // مقادیر responsive برای استفاده در کامپوننت‌ها
            sidebar: {
              width: {
                open: { xs: 280, sm: 280, md: 280, lg: 280, xl: 280 },
                closed: { xs: 64, sm: 64, md: 64, lg: 64, xl: 64 },
                hover: { xs: 280, sm: 280, md: 280, lg: 280, xl: 280 },
              },
              profile: {
                height: { xs: 60, sm: 70, md: 80, lg: 80, xl: 80 },
                avatar: { xs: 32, sm: 40, md: 48, lg: 48, xl: 48 },
                paddingY: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 },
                paddingX: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 },
              },
              menu: {
                itemHeight: { xs: 40, sm: 44, md: 48, lg: 48, xl: 48 },
                subItemHeight: { xs: 32, sm: 36, md: 40, lg: 40, xl: 40 },
                iconSize: { xs: 18, sm: 20, md: 24, lg: 24, xl: 24 },
                subIconSize: { xs: 16, sm: 18, md: 20, lg: 20, xl: 20 },
                padding: { xs: 8, sm: 12, md: 16, lg: 16, xl: 16 },
                subItemPaddingLeft: { xs: 2, sm: 2, md: 4, lg: 4, xl: 4 },
              },
            },
            header: {
              height: { xs: 56, sm: 64, md: 70, lg: 70, xl: 70 },
              iconSize: { xs: 20, sm: 24, md: 28, lg: 28, xl: 28 },
              buttonPadding: { xs: '6px 12px', sm: '8px 16px', md: '10px 20px', lg: '10px 20px', xl: '10px 20px' },
            },
            content: {
              padding: { xs: 16, sm: 24, md: 32, lg: 32, xl: 32 },
              margin: { xs: 8, sm: 16, md: 24, lg: 24, xl: 24 },
            },
          },
        },
        // تنظیمات sidebar
        sidebar: {
          width: {
            open: 280,
            closed: 0,
            hover: 280,
          },
          profile: {
            height: {
              desktop: 80,
              mobile: 70,
              small: 60,
            },
            avatar: {
              desktop: 48,
              mobile: 40,
              small: 32,
            },
          },
          menu: {
            itemHeight: {
              desktop: 48,
              mobile: 44,
              small: 40,
            },
            subItemHeight: {
              desktop: 40,
              mobile: 36,
              small: 32,
            },
            iconSize: {
              desktop: 24,
              mobile: 20,
              small: 18,
            },
            subIconSize: {
              desktop: 20,
              mobile: 18,
              small: 16,
            },
            padding: {
              desktop: 16,
              mobile: 12,
              small: 8,
            },
          },
        },
      },
      typography: {
        fontFamily: getFontFamily(currentLanguage),
        // تنظیمات تایپوگرافی بر اساس مقیاس فونت
        fontSize: getTypographyConfig(userSettings.fontScale).baseFontSize,
        h1: { 
          fontSize: getFontSize('heading', 'h1', userSettings.fontScale),
          fontWeight: 400,
        },
        h2: { 
          fontSize: getFontSize('heading', 'h2', userSettings.fontScale),
          fontWeight: 400,
        },
        h3: { 
          fontSize: getFontSize('heading', 'h3', userSettings.fontScale),
          fontWeight: 400,
        },
        h4: { 
          fontSize: getFontSize('heading', 'h4', userSettings.fontScale),
          fontWeight: 400,
        },
        h5: { 
          fontSize: getFontSize('heading', 'h5', userSettings.fontScale),
          fontWeight: 400,
        },
        h6: { 
          fontSize: getFontSize('heading', 'h6', userSettings.fontScale),
          fontWeight: 400,
        },
        body1: { 
          fontSize: getFontSize('text', 'base', userSettings.fontScale),
        },
        body2: { 
          fontSize: getFontSize('text', 'sm', userSettings.fontScale),
        },
        button: { 
          fontSize: getFontSize('button', 'medium', userSettings.fontScale),
          textTransform: 'none',
        },
        caption: { 
          fontSize: getFontSize('text', 'xs', userSettings.fontScale),
        },
        overline: { 
          fontSize: getFontSize('text', 'xs', userSettings.fontScale),
        },
        // تایپوگرافی خاص برای اسلایدر
        sliderTitle: {
          fontSize: getFontSize('heading', 'h1', userSettings.fontScale) * 2.5,
          fontWeight: 700,
          lineHeight: 1.2,
          display: 'block',
        },
        sliderSubtitle: {
          fontSize: getFontSize('heading', 'h4', userSettings.fontScale) * 2,
          fontWeight: 600,
          lineHeight: 1.3,
          display: 'block',
        },
        sliderDescription: {
          fontSize: getFontSize('text', 'base', userSettings.fontScale) * 1.2,
          fontWeight: 500,
          lineHeight: 1.4,
          display: 'block',
        },
      },
      components: {
        MuiTextField: {
          defaultProps: {
            variant: 'outlined',
            size: themeConfig.componentSizes.input.default,
          },
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: themeConfig.borderRadius.standard,
                transition: themeConfig.transition.standard,
                '& fieldset': {
                  borderColor: colorPalette.border.light,
                },
                '&:hover fieldset': {
                  borderColor: colorPalette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: colorPalette.primary.main,
                },
              },
              '& .MuiFilledInput-root': {
                borderRadius: themeConfig.borderRadius.standard,
                transition: themeConfig.transition.standard,
                backgroundColor: colorPalette.background.paper,
                '&:hover': {
                  backgroundColor: colorPalette.background.default,
                },
                '&.Mui-focused': {
                  backgroundColor: colorPalette.background.default,
                },
              },
              '& .MuiInput-root': {
                transition: themeConfig.transition.standard,
                borderBottom: `1px solid ${colorPalette.border.light}`,
                '&:hover': {
                  borderBottomColor: colorPalette.primary.main,
                },
                '&.Mui-focused': {
                  borderBottomColor: colorPalette.primary.main,
                },
              },
              '& .MuiInputLabel-root': {
                color: colorPalette.text.secondary,
              },
              '& .MuiInputBase-input': {
                color: colorPalette.text.primary,
              },
            },
            // Size variants with dynamic height
            sizeSmall: {
              '& .MuiOutlinedInput-root': {

                height: calculateElementHeight('input', 'small', userSettings.fontScale),
                fontSize: getFontSize('input', 'small', userSettings.fontScale),
              },
              '& .MuiFilledInput-root': {
                height: calculateElementHeight('input', 'small', userSettings.fontScale),
                fontSize: getFontSize('input', 'small', userSettings.fontScale),
              },
              '& .MuiInput-root': {
                height: calculateElementHeight('input', 'small', userSettings.fontScale),
                fontSize: getFontSize('input', 'small', userSettings.fontScale),
              },
            },
            sizeMedium: {
              '& .MuiOutlinedInput-root': {
                height: calculateElementHeight('input', 'medium', userSettings.fontScale),
                fontSize: getFontSize('input', 'medium', userSettings.fontScale),
              },
              '& .MuiFilledInput-root': {
                height: calculateElementHeight('input', 'medium', userSettings.fontScale),
                fontSize: getFontSize('input', 'medium', userSettings.fontScale),
              },
              '& .MuiInput-root': {
                height: calculateElementHeight('input', 'medium', userSettings.fontScale),
                fontSize: getFontSize('input', 'medium', userSettings.fontScale),
              },
            },
            sizeLarge: {
              '& .MuiOutlinedInput-root': {
                height: calculateElementHeight('input', 'large', userSettings.fontScale),
                fontSize: getFontSize('input', 'large', userSettings.fontScale),
              },
              '& .MuiFilledInput-root': {
                height: calculateElementHeight('input', 'large', userSettings.fontScale),
                fontSize: getFontSize('input', 'large', userSettings.fontScale),
              },
              '& .MuiInput-root': {
                height: calculateElementHeight('input', 'large', userSettings.fontScale),
                fontSize: getFontSize('input', 'large', userSettings.fontScale),
              },
            },
          },
        },
        MuiButton: {
          defaultProps: {
            variant: 'contained',
            size: themeConfig.componentSizes.button.default,
          },
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: themeConfig.borderRadius.standard,
              transition: themeConfig.transition.standard,
              fontFamily: getFontFamily(currentLanguage),
            },
            // Size variants with dynamic height
            sizeSmall: {
              padding: '6px 16px',
              fontSize: getFontSize('button', 'small', userSettings.fontScale),
              height: calculateElementHeight('button', 'small', userSettings.fontScale),
            },
            sizeMedium: {
              padding: '8px 20px',
              fontSize: getFontSize('button', 'medium', userSettings.fontScale),
              height: calculateElementHeight('button', 'medium', userSettings.fontScale),
            },
            sizeLarge: {
              padding: '12px 24px',
              fontSize: getFontSize('button', 'large', userSettings.fontScale),
              height: calculateElementHeight('button', 'large', userSettings.fontScale),
            },
            // Primary variant
            containedPrimary: {
              backgroundColor: colorPalette.primary.main,
              color: colorPalette.primary.contrast,
              '&:hover': {

                backgroundColor: colorPalette.primary.dark,
                transform: 'translateY(-1px)',

                boxShadow: `0 4px 12px ${colorPalette.transparent.primary}`,
              },
              '&:disabled': {

                backgroundColor: colorPalette.border.light,
                color: colorPalette.text.disabled,
              },
            },
            // Secondary variant
            containedSecondary: {
              backgroundColor: colorPalette.secondary.main,
              color: colorPalette.secondary.contrast,
              '&:hover': {

                backgroundColor: colorPalette.secondary.dark,
                transform: 'translateY(-1px)',

                boxShadow: `0 4px 12px ${colorPalette.transparent.secondary}`,
              },
              '&:disabled': {
                backgroundColor: colorPalette.border.light,
                color: colorPalette.text.disabled,
              },
            },
            // Error variant
            containedError: {
              backgroundColor: colorPalette.status.error,
              color: colorPalette.neutral.white,
              '&:hover': {
                backgroundColor: colorPalette.status.error,
                filter: 'brightness(0.9)',
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${colorPalette.transparent.primary}`,
              },
              '&:disabled': {
                backgroundColor: colorPalette.border.light,
                color: colorPalette.text.disabled,
              },
            },
            // Success variant
            containedSuccess: {
              backgroundColor: colorPalette.status.success,
              color: colorPalette.neutral.white,
              '&:hover': {
                backgroundColor: colorPalette.status.success,
                filter: 'brightness(0.9)',
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${colorPalette.transparent.primary}`,
              },
              '&:disabled': {
                backgroundColor: colorPalette.border.light,
                color: colorPalette.text.disabled,
              },
            },
            // Warning variant
            containedWarning: {
              backgroundColor: colorPalette.status.warning,
              color: colorPalette.neutral.white,
              '&:hover': {
                backgroundColor: colorPalette.status.warning,
                filter: 'brightness(0.9)',
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${colorPalette.transparent.primary}`,
              },
              '&:disabled': {
                backgroundColor: colorPalette.border.light,
                color: colorPalette.text.disabled,
              },
            },
            // Info variant
            containedInfo: {
              backgroundColor: colorPalette.status.info,
              color: colorPalette.neutral.white,
              '&:hover': {
                backgroundColor: colorPalette.status.info,
                filter: 'brightness(0.9)',
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${colorPalette.transparent.primary}`,
              },
              '&:disabled': {
                backgroundColor: colorPalette.border.light,
                color: colorPalette.text.disabled,
              },
            },
            // Outlined variant
            outlined: {
              backgroundColor: 'transparent',
              color: colorPalette.primary.main,
              border: `1px solid ${colorPalette.primary.main}`,
              '&:hover': {
                backgroundColor: colorPalette.primary.main,
                color: colorPalette.primary.contrast,
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                backgroundColor: 'transparent',
                color: colorPalette.text.disabled,
                borderColor: colorPalette.border.light,
              },
            },
            // Text variant
            text: {
              backgroundColor: 'transparent',
              color: colorPalette.primary.main,
              '&:hover': {
                backgroundColor: 'transparent',
                color: colorPalette.primary.dark,
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                backgroundColor: 'transparent',
                color: colorPalette.text.disabled,
              },
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              color: isDark ? colorPalette.primary.light : colorPalette.primary.main,
              textDecoration: 'none',
                '&:hover': {
                color: isDark ? colorPalette.primary.main : colorPalette.primary.dark,
                textDecoration: 'underline',
                },
              },
            },
          },
        MuiIconButton: {
          defaultProps: {
            size: themeConfig.componentSizes.button.default,
        },
          styleOverrides: {
            root: {
              border: 'none',
              fontSize: getFontSize('text', 'xs', userSettings.fontScale),
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isDark ? colorPalette.neutral.darkGray : colorPalette.neutral.lightGray,
                transform: 'scale(1.1)',
                opacity: 0.9,
              },
                },
              },
            },
        MuiSelect: {
          defaultProps: {
            variant: 'outlined',
            size: themeConfig.componentSizes.input.default,
          },
          styleOverrides: {
            root: {
              borderRadius: themeConfig.borderRadius.standard,
              transition: themeConfig.transition.standard,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colorPalette.border.light,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colorPalette.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colorPalette.primary.main,
              },
              // تنظیم ارتفاع پیش‌فرض برای Select
              '& .MuiOutlinedInput-root': {
                height: calculateElementHeight('input', themeConfig.componentSizes.input.default, userSettings.fontScale),
                fontSize: getFontSize('input', themeConfig.componentSizes.input.default, userSettings.fontScale),
              },
            },
            // Size variants with dynamic height
            sizeSmall: {
              '& .MuiOutlinedInput-root': {
                height: calculateElementHeight('input', 'small', userSettings.fontScale),
                fontSize: getFontSize('input', 'small', userSettings.fontScale),
              },
            },
            sizeMedium: {
              '& .MuiOutlinedInput-root': {
                height: calculateElementHeight('input', 'medium', userSettings.fontScale),
                fontSize: getFontSize('input', 'medium', userSettings.fontScale),
              },
            },
            sizeLarge: {
              '& .MuiOutlinedInput-root': {
                height: calculateElementHeight('input', 'large', userSettings.fontScale),
                fontSize: getFontSize('input', 'large', userSettings.fontScale),
              },
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              color: isDark ? colorPalette.neutral.white : colorPalette.neutral.black,
              fontSize: getFontSize('text', 'base', userSettings.fontScale),
              '&:hover': {
                backgroundColor: isDark ? colorPalette.neutral.darkGray : colorPalette.neutral.lightGray,
              },

              '&.Mui-selected': {
                backgroundColor: isDark ? colorPalette.primary.dark : colorPalette.primary.light,
                color: colorPalette.neutral.white,
                '&:hover': {
                  backgroundColor: isDark ? colorPalette.primary.main : colorPalette.primary.main,
                },
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? colorPalette.background.primary : colorPalette.neutral.white,
              border: `1px solid ${isDark ? colorPalette.neutral.darkGray : colorPalette.neutral.gray}`,
              borderRadius: themeConfig.borderRadius.standard,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${colorPalette.transparent.overlay}`,
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? colorPalette.background.primary : colorPalette.neutral.white,
              borderRadius: themeConfig.borderRadius.standard,
              boxShadow: `0 2px 8px ${colorPalette.transparent.overlay}`,
            },
            elevation8: {
              boxShadow: `0 8px 32px ${colorPalette.transparent.overlay}`,
            },
            // استایل مخصوص برای فرم لاگین
            loginForm: {
              backgroundColor: isDark ? colorPalette.background.primary : colorPalette.neutral.white,
              borderRadius: themeConfig.borderRadius.standard,
              boxShadow: `0 8px 32px ${colorPalette.transparent.overlay}`,
              padding: { xs: 3, sm: 4 },
              width: '100%',
              maxWidth: 400,
            },
          },
        },
        MuiContainer: {
          styleOverrides: {
            root: {
              paddingLeft: { xs: 2, sm: 3, md: 4 },
              paddingRight: { xs: 2, sm: 3, md: 4 },
            },
            maxWidthLg: {
              maxWidth: '1200px',
            },
          },
        },
        MuiGrid: {
          styleOverrides: {
            root: {
              '& .MuiGrid-item': {
                padding: 1.5,
              },
            },
          },
        },
        MuiFormControl: {
          defaultProps: {
            variant: 'outlined',
            size: themeConfig.componentSizes.input.default,
          },
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: themeConfig.borderRadius.standard,
              },
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              color: colorPalette.text.secondary,
              fontSize: getFontSize('text', 'sm', userSettings.fontScale),
              '&.Mui-focused': {
                color: colorPalette.primary.main,
              },
            },
          },
        },
        MuiFormHelperText: {
          styleOverrides: {
            root: {
              fontSize: getFontSize('text', 'xs', userSettings.fontScale),
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: themeConfig.borderRadius.standard,
            },
            sizeSmall: {
              height: 20,
              fontSize: getFontSize('text', 'xs', userSettings.fontScale),
            },
            sizeMedium: {
              fontSize: getFontSize('text', 'sm', userSettings.fontScale),
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              fontSize: getFontSize('text', 'base', userSettings.fontScale),
            },
            message: {
              fontSize: getFontSize('text', 'base', userSettings.fontScale),
            },
            title: {
              fontSize: getFontSize('text', 'lg', userSettings.fontScale),
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              fontSize: getFontSize('text', 'sm', userSettings.fontScale),
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            root: {
              width: 280,
              flexShrink: 0,

              '& .MuiDrawer-paper': {
                backgroundColor: isDark ? colorPalette.background.primary : colorPalette.neutral.white,
                borderRight: `1px solid ${isDark ? colorPalette.neutral.darkGray : colorPalette.neutral.gray}`,
                transition: 'all 0.3s ease',
                overflowX: 'hidden',
                overflowY: 'auto',
                position: 'relative',
              width: 280,
              boxSizing: 'border-box',

                '&:hover': {
                  transition: 'all 0.2s ease',
                },
              },
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              color: isDark ? colorPalette.neutral.white : colorPalette.neutral.black,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isDark ? colorPalette.neutral.darkGray : colorPalette.neutral.lightGray,
                transform: 'translateX(2px)',
              },
              '&:active': {
                transform: 'translateX(1px)',
              },
              '&.Mui-selected': {
                backgroundColor: isDark ? colorPalette.primary.dark : colorPalette.primary.light,
                color: colorPalette.neutral.white,
                '&:hover': {
                  backgroundColor: isDark ? colorPalette.primary.main : colorPalette.primary.main,
                },
              },
            },
          },
        },
        MuiListItemIcon: {
          styleOverrides: {
            root: {
              color: isDark ? colorPalette.neutral.lightGray : colorPalette.neutral.darkGray,
              minWidth: 40,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: colorPalette.primary.main,
              },
            },
          },
        },
        MuiListItemText: {
          styleOverrides: {
            primary: {
              fontSize: getFontSize('text', 'base', userSettings.fontScale),
            },
            secondary: {
              fontSize: getFontSize('text', 'sm', userSettings.fontScale),
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              fontSize: getFontSize('text', 'base', userSettings.fontScale),
            },
            head: {
              fontSize: getFontSize('text', 'sm', userSettings.fontScale),
              fontWeight: 600,
            },
          },
        },
        MuiTableHead: {
          styleOverrides: {
            root: {
              fontSize: getFontSize('text', 'sm', userSettings.fontScale),
            },
          },
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              fontSize: getFontSize('heading', 'h5', userSettings.fontScale),
            },
          },
        },
        MuiDialogContent: {
          styleOverrides: {
            root: {
              fontSize: getFontSize('text', 'base', userSettings.fontScale),
            },
          },
        },
        MuiDialogActions: {
          styleOverrides: {
            root: {
              fontSize: getFontSize('text', 'base', userSettings.fontScale),
            },
          },
        },
        MuiSnackbar: {
          styleOverrides: {
            root: {
              fontSize: getFontSize('text', 'base', userSettings.fontScale),
            },
          },
        },
        MuiAvatar: {
          styleOverrides: {
            root: {
              backgroundColor: colorPalette.primary.main,
              color: colorPalette.neutral.white,
              boxShadow: `0 4px 20px ${colorPalette.transparent.primary}`,
              border: `2px solid ${isDark ? colorPalette.neutral.darkGray : colorPalette.neutral.white}`,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              background: createGradient('primary', direction, isDark ? 'dark' : 'light'),
              boxShadow: `0 2px 8px ${colorPalette.transparent.overlay}`,
              color: colorPalette.neutral.white,
              backdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${colorPalette.transparent.white}`,
              height: 64,
              zIndex: 1201,
              transition: 'all 0.3s ease',
            },
          },
        },
        MuiToolbar: {
          styleOverrides: {
            root: {
              background: 'transparent',
              color: colorPalette.neutral.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
              padding: { xs: '0 16px', sm: '0 24px', md: '0 32px', lg: '0 48px' },
              minHeight: 64,
            },
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            ':root': {
              direction: direction,
              writingMode: 'horizontal-tb',
              textOrientation: 'mixed',
            },
            html: {
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              fontSynthesis: 'none',
            },
            body: {
              fontFamily: getFontFamily(currentLanguage),
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              fontSynthesis: 'none',
            },
            '*': {
              fontFamily: 'inherit',
            },
          },
        },
      },
      shape: {
        borderRadius: themeConfig.borderRadius.standard,
      },
      spacing: 8,
    });
  }, [currentLanguage, direction, isDark, userSettings.fontScale]);

  const contextValue = {
    // Language
    currentLanguage,
    direction,
    changeLanguage,
    toggleLanguage,
    
    // Theme
    toggleTheme,
    theme,
    
    // User Settings
    userSettings,
    updateUserSettings,
    changeFontScale,
    
    // Screen size
    screenSize,
    getResponsiveValue,

    // Helper functions for theme config
    getSiteConfig,
    getCompanyConfig,
  };

  const cache = getCache(direction);

  return (
    <AppThemeContext.Provider value={contextValue}>
      <CacheProvider value={cache}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </CacheProvider>
    </AppThemeContext.Provider>
  );
} 