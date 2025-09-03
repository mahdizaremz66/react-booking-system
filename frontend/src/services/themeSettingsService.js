import themeSettingsData from '../config/themeSettings.json';
import { defaultThemeConfig } from '../config/themeConfig';
import { availableFonts, defaultFonts } from '../config/fonts';
import { calendarTypes, dateFormats, currencies, defaultLanguages } from '../config/languageSettings';
import { isSystemTemplate, isDeletableTemplate } from '../config/themeTemplates';

// خواندن تنظیمات از API یا فایل (fallback)
export const loadThemeSettings = async () => {
  try {
    // تلاش برای خواندن از API
    if (import.meta.env.MODE !== 'development' || import.meta.env.VITE_USE_API === 'true') {
      const response = await fetch('/api/theme-settings');
      if (response.ok) {
        const data = await response.json();
        return convertDatabaseToThemeConfig(data);
      }
    }
    
    // fallback به فایل JSON در صورت عدم دسترسی به API
    return themeSettingsData;
  } catch (error) {
    console.error('خطا در خواندن تنظیمات تم:', error);
    return defaultThemeConfig;
  }
};

// ذخیره تنظیمات در API یا localStorage (fallback)
export const saveThemeSettings = async (settings) => {
  try {
    // تلاش برای ذخیره در API
    if (import.meta.env.MODE !== 'development' || import.meta.env.VITE_USE_API === 'true') {
      const dbData = convertThemeConfigToDatabase(settings);
      const response = await fetch('/api/theme-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbData)
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      }
    }
    
    // fallback به localStorage در صورت عدم دسترسی به API
    localStorage.setItem('themeSettings', JSON.stringify(settings));
    return { success: true, message: 'تنظیمات با موفقیت ذخیره شد' };
  } catch (error) {
    console.error('خطا در ذخیره تنظیمات:', error);
    return { success: false, message: 'خطا در ذخیره تنظیمات' };
  }
};

// دریافت تنظیمات پیش‌فرض از defaultThemeConfig
export const getDefaultSettings = () => {
  return defaultThemeConfig;
};

// خواندن تنظیمات از localStorage (برای حالت توسعه)
export const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('themeSettings');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('خطا در خواندن از localStorage:', error);
    return null;
  }
};

// تبدیل تنظیمات فرم به ساختار themeConfig
export const convertFormDataToThemeConfig = (formData) => {
  // تبدیل زبان‌ها از آرایه به آبجکت
  const languagesObject = {};
  if (formData.languages && Array.isArray(formData.languages)) {
    formData.languages.forEach(lang => {
      if (lang.code) {
        languagesObject[lang.code] = {
          code: lang.code,
          name: lang.name || '',
          nativeName: lang.nativeName || lang.name || '',
          direction: lang.direction || 'ltr',
          calendar: lang.calendar || 'gregorian',
          font: {
            primary: lang.fontPrimary || 'Arial',
            fallback: lang.fontFallback || 'Tahoma, Arial, sans-serif'
          },
          translationFile: lang.translationFile || `${lang.code}.json`,
          dateFormat: lang.dateFormat || 'MM/DD/YYYY',

          currency: lang.currency || 'USD',
          currencySymbol: lang.currencySymbol || '$',
          isActive: lang.isActive !== undefined ? lang.isActive : true,
          isDefault: lang.isDefault !== undefined ? lang.isDefault : false
        };
      }
    });
  }

  return {
    site: {
      title: {
        fa: formData.siteTitle?.fa || defaultThemeConfig.site.title.fa,
        en: formData.siteTitle?.en || defaultThemeConfig.site.title.en
      },
      description: {
        fa: formData.siteDescription?.fa || defaultThemeConfig.site.description.fa,
        en: formData.siteDescription?.en || defaultThemeConfig.site.description.en
      },
      logo: formData.siteLogo || defaultThemeConfig.site.logo
    },
    company: {
      name: {
        fa: formData.companyName?.fa || defaultThemeConfig.company.name.fa,
        en: formData.companyName?.en || defaultThemeConfig.company.name.en
      },
      address: {
        fa: formData.companyAddress?.fa || defaultThemeConfig.company.address.fa,
        en: formData.companyAddress?.en || defaultThemeConfig.company.address.en
      },
      phone: formData.companyPhone || defaultThemeConfig.company.phone,
      mobile: formData.companyMobile || defaultThemeConfig.company.mobile,
      email: formData.companyEmail || defaultThemeConfig.company.email,
      website: formData.companyWebsite || defaultThemeConfig.company.website,
      socialMedia: formData.socialMedia || defaultThemeConfig.company.socialMedia,
      licenses: formData.licenses || defaultThemeConfig.company.licenses
    },
    languages: languagesObject,
    colorPalettes: {
      light: {
        primary: {
          main: formData.primaryMain || defaultThemeConfig.colorPalettes.light.primary.main,
          light: formData.primaryLight || defaultThemeConfig.colorPalettes.light.primary.light,
          dark: formData.primaryDark || defaultThemeConfig.colorPalettes.light.primary.dark,
          contrast: formData.primaryContrast || defaultThemeConfig.colorPalettes.light.primary.contrast
        },
        secondary: {
          main: formData.secondaryMain || defaultThemeConfig.colorPalettes.light.secondary.main,
          light: formData.secondaryLight || defaultThemeConfig.colorPalettes.light.secondary.light,
          dark: formData.secondaryDark || defaultThemeConfig.colorPalettes.light.secondary.dark,
          contrast: formData.secondaryContrast || defaultThemeConfig.colorPalettes.light.secondary.contrast
        },
        neutral: {
          white: formData.neutralWhite || defaultThemeConfig.colorPalettes.light.neutral.white,
          lightGray: formData.neutralLightGray || defaultThemeConfig.colorPalettes.light.neutral.lightGray,
          gray: formData.neutralGray || defaultThemeConfig.colorPalettes.light.neutral.gray,
          darkGray: formData.neutralDarkGray || defaultThemeConfig.colorPalettes.light.neutral.darkGray,
          black: formData.neutralBlack || defaultThemeConfig.colorPalettes.light.neutral.black
        },
        status: {
          success: formData.statusSuccess || defaultThemeConfig.colorPalettes.light.status.success,
          warning: formData.statusWarning || defaultThemeConfig.colorPalettes.light.status.warning,
          error: formData.statusError || defaultThemeConfig.colorPalettes.light.status.error,
          info: formData.statusInfo || defaultThemeConfig.colorPalettes.light.status.info
        },
        background: {
          primary: formData.backgroundPrimary || defaultThemeConfig.colorPalettes.light.background.primary,
          secondary: formData.backgroundSecondary || defaultThemeConfig.colorPalettes.light.background.secondary,
          paper: formData.backgroundPaper || defaultThemeConfig.colorPalettes.light.background.paper
        },
        text: {
          primary: formData.textPrimary || defaultThemeConfig.colorPalettes.light.text.primary,
          secondary: formData.textSecondary || defaultThemeConfig.colorPalettes.light.text.secondary,
          disabled: formData.textDisabled || defaultThemeConfig.colorPalettes.light.text.disabled
        },
        transparent: {
          primary: formData.transparentPrimary || defaultThemeConfig.colorPalettes.light.transparent.primary,
          secondary: formData.transparentSecondary || defaultThemeConfig.colorPalettes.light.transparent.secondary,
          overlay: formData.transparentOverlay || defaultThemeConfig.colorPalettes.light.transparent.overlay,
          white: formData.transparentWhite || defaultThemeConfig.colorPalettes.light.transparent.white,
          iconButton: formData.transparentIconButton || defaultThemeConfig.colorPalettes.light.transparent.iconButton,
          iconButtonHover: formData.transparentIconButtonHover || defaultThemeConfig.colorPalettes.light.transparent.iconButtonHover
        },
        shadow: {
          light: formData.shadowLight || defaultThemeConfig.colorPalettes.light.shadow.light,
          medium: formData.shadowMedium || defaultThemeConfig.colorPalettes.light.shadow.medium,
          dark: formData.shadowDark || defaultThemeConfig.colorPalettes.light.shadow.dark
        },
        border: {
          light: formData.borderLight || defaultThemeConfig.colorPalettes.light.border.light,
          medium: formData.borderMedium || defaultThemeConfig.colorPalettes.light.border.medium,
          dark: formData.borderDark || defaultThemeConfig.colorPalettes.light.border.dark
        },
        gradients: {
          primary: {
            start: formData.gradientPrimaryStart || defaultThemeConfig.colorPalettes.light.gradients.primary.start,
            end: formData.gradientPrimaryEnd || defaultThemeConfig.colorPalettes.light.gradients.primary.end
          },
          secondary: {
            start: formData.gradientSecondaryStart || defaultThemeConfig.colorPalettes.light.gradients.secondary.start,
            end: formData.gradientSecondaryEnd || defaultThemeConfig.colorPalettes.light.gradients.secondary.end
          },
          footer: {
            start: formData.gradientFooterStart || defaultThemeConfig.colorPalettes.light.gradients.footer.start,
            end: formData.gradientFooterEnd || defaultThemeConfig.colorPalettes.light.gradients.footer.end
          }
        }
      },
      dark: {
        primary: {
          main: formData.darkPrimaryMain || defaultThemeConfig.colorPalettes.dark.primary.main,
          light: formData.darkPrimaryLight || defaultThemeConfig.colorPalettes.dark.primary.light,
          dark: formData.darkPrimaryDark || defaultThemeConfig.colorPalettes.dark.primary.dark,
          contrast: formData.darkPrimaryContrast || defaultThemeConfig.colorPalettes.dark.primary.contrast
        },
        secondary: {
          main: formData.darkSecondaryMain || defaultThemeConfig.colorPalettes.dark.secondary.main,
          light: formData.darkSecondaryLight || defaultThemeConfig.colorPalettes.dark.secondary.light,
          dark: formData.darkSecondaryDark || defaultThemeConfig.colorPalettes.dark.secondary.dark,
          contrast: formData.darkSecondaryContrast || defaultThemeConfig.colorPalettes.dark.secondary.contrast
        },
        neutral: {
          white: formData.darkNeutralWhite || defaultThemeConfig.colorPalettes.dark.neutral.white,
          lightGray: formData.darkNeutralLightGray || defaultThemeConfig.colorPalettes.dark.neutral.lightGray,
          gray: formData.darkNeutralGray || defaultThemeConfig.colorPalettes.dark.neutral.gray,
          darkGray: formData.darkNeutralDarkGray || defaultThemeConfig.colorPalettes.dark.neutral.darkGray,
          black: formData.darkNeutralBlack || defaultThemeConfig.colorPalettes.dark.neutral.black
        },
        status: {
          success: formData.darkStatusSuccess || defaultThemeConfig.colorPalettes.dark.status.success,
          warning: formData.darkStatusWarning || defaultThemeConfig.colorPalettes.dark.status.warning,
          error: formData.darkStatusError || defaultThemeConfig.colorPalettes.dark.status.error,
          info: formData.darkStatusInfo || defaultThemeConfig.colorPalettes.dark.status.info
        },
        background: {
          primary: formData.darkBackgroundPrimary || defaultThemeConfig.colorPalettes.dark.background.primary,
          secondary: formData.darkBackgroundSecondary || defaultThemeConfig.colorPalettes.dark.background.secondary,
          paper: formData.darkBackgroundPaper || defaultThemeConfig.colorPalettes.dark.background.paper
        },
        text: {
          primary: formData.darkTextPrimary || defaultThemeConfig.colorPalettes.dark.text.primary,
          secondary: formData.darkTextSecondary || defaultThemeConfig.colorPalettes.dark.text.secondary,
          disabled: formData.darkTextDisabled || defaultThemeConfig.colorPalettes.dark.text.disabled
        },
        transparent: {
          primary: formData.darkTransparentPrimary || defaultThemeConfig.colorPalettes.dark.transparent.primary,
          secondary: formData.darkTransparentSecondary || defaultThemeConfig.colorPalettes.dark.transparent.secondary,
          overlay: formData.darkTransparentOverlay || defaultThemeConfig.colorPalettes.dark.transparent.overlay,
          white: formData.darkTransparentWhite || defaultThemeConfig.colorPalettes.dark.transparent.white,
          iconButton: formData.darkTransparentIconButton || defaultThemeConfig.colorPalettes.dark.transparent.iconButton,
          iconButtonHover: formData.darkTransparentIconButtonHover || defaultThemeConfig.colorPalettes.dark.transparent.iconButtonHover
        },
        shadow: {
          light: formData.darkShadowLight || defaultThemeConfig.colorPalettes.dark.shadow.light,
          medium: formData.darkShadowMedium || defaultThemeConfig.colorPalettes.dark.shadow.medium,
          dark: formData.darkShadowDark || defaultThemeConfig.colorPalettes.dark.shadow.dark
        },
        border: {
          light: formData.darkBorderLight || defaultThemeConfig.colorPalettes.dark.border.light,
          medium: formData.darkBorderMedium || defaultThemeConfig.colorPalettes.dark.border.medium,
          dark: formData.darkBorderDark || defaultThemeConfig.colorPalettes.dark.border.dark
        },
        gradients: {
          primary: {
            start: formData.darkGradientPrimaryStart || defaultThemeConfig.colorPalettes.dark.gradients.primary.start,
            end: formData.darkGradientPrimaryEnd || defaultThemeConfig.colorPalettes.dark.gradients.primary.end
          },
          secondary: {
            start: formData.darkGradientSecondaryStart || defaultThemeConfig.colorPalettes.dark.gradients.secondary.start,
            end: formData.darkGradientSecondaryEnd || defaultThemeConfig.colorPalettes.dark.gradients.secondary.end
          },
          footer: {
            start: formData.darkGradientFooterStart || defaultThemeConfig.colorPalettes.dark.gradients.footer.start,
            end: formData.darkGradientFooterEnd || defaultThemeConfig.colorPalettes.dark.gradients.footer.end
          }
        }
      }
    },
    borderRadius: {
      standard: formData.borderRadius || defaultThemeConfig.borderRadius.standard,
      circle: formData.borderRadiusCircle || defaultThemeConfig.borderRadius.circle
    },
    transition: {
      standard: formData.transitionStandard || defaultThemeConfig.transition.standard,
      fast: formData.transitionFast || defaultThemeConfig.transition.fast,
      slow: formData.transitionSlow || defaultThemeConfig.transition.slow
    },
    typography: {
      baseFontSize: formData.baseFontSize || defaultThemeConfig.typography.baseFontSize,
      fontScales: formData.fontScales || defaultThemeConfig.typography.fontScales,
      fontSizes: {
        text: {
          xs: formData.fontSizeTextXs || defaultThemeConfig.typography.fontSizes.text.xs,
          sm: formData.fontSizeTextSm || defaultThemeConfig.typography.fontSizes.text.sm,
          base: formData.fontSizeTextBase || defaultThemeConfig.typography.fontSizes.text.base,
          lg: formData.fontSizeTextLg || defaultThemeConfig.typography.fontSizes.text.lg,
          xl: formData.fontSizeTextXl || defaultThemeConfig.typography.fontSizes.text.xl,
          '2xl': formData.fontSizeText2xl || defaultThemeConfig.typography.fontSizes.text['2xl'],
          '3xl': formData.fontSizeText3xl || defaultThemeConfig.typography.fontSizes.text['3xl']
        },
        heading: {
          h1: formData.fontSizeHeadingH1 || defaultThemeConfig.typography.fontSizes.heading.h1,
          h2: formData.fontSizeHeadingH2 || defaultThemeConfig.typography.fontSizes.heading.h2,
          h3: formData.fontSizeHeadingH3 || defaultThemeConfig.typography.fontSizes.heading.h3,
          h4: formData.fontSizeHeadingH4 || defaultThemeConfig.typography.fontSizes.heading.h4,
          h5: formData.fontSizeHeadingH5 || defaultThemeConfig.typography.fontSizes.heading.h5,
          h6: formData.fontSizeHeadingH6 || defaultThemeConfig.typography.fontSizes.heading.h6
        },
        button: {
          small: formData.fontSizeButtonSmall || defaultThemeConfig.typography.fontSizes.button.small,
          medium: formData.fontSizeButtonMedium || defaultThemeConfig.typography.fontSizes.button.medium,
          large: formData.fontSizeButtonLarge || defaultThemeConfig.typography.fontSizes.button.large
        },
        input: {
          small: formData.fontSizeInputSmall || defaultThemeConfig.typography.fontSizes.input.small,
          medium: formData.fontSizeInputMedium || defaultThemeConfig.typography.fontSizes.input.medium,
          large: formData.fontSizeInputLarge || defaultThemeConfig.typography.fontSizes.input.large
        }
      }
    },
    breakpoints: {
      xs: formData.breakpointXs || defaultThemeConfig.breakpoints.xs,
      sm: formData.breakpointSm || defaultThemeConfig.breakpoints.sm,
      md: formData.breakpointMd || defaultThemeConfig.breakpoints.md,
      lg: formData.breakpointLg || defaultThemeConfig.breakpoints.lg,
      xl: formData.breakpointXl || defaultThemeConfig.breakpoints.xl
    },
    spacing: {
      base: formData.spacingBase || defaultThemeConfig.spacing.base,
      xs: formData.spacingXs || defaultThemeConfig.spacing.xs,
      sm: formData.spacingSm || defaultThemeConfig.spacing.sm,
      md: formData.spacingMd || defaultThemeConfig.spacing.md,
      lg: formData.spacingLg || defaultThemeConfig.spacing.lg,
      xl: formData.spacingXl || defaultThemeConfig.spacing.xl,
      "2xl": formData.spacing2xl || defaultThemeConfig.spacing["2xl"],
      "3xl": formData.spacing3xl || defaultThemeConfig.spacing["3xl"],
      "4xl": formData.spacing4xl || defaultThemeConfig.spacing["4xl"]
    },
    componentSizes: {
      default: formData.componentDefaultSize || defaultThemeConfig.componentSizes.default,
      input: {
        default: formData.inputDefaultSize || defaultThemeConfig.componentSizes.input.default,
        options: defaultThemeConfig.componentSizes.input.options
      },
      button: {
        default: formData.buttonDefaultSize || defaultThemeConfig.componentSizes.button.default,
        options: defaultThemeConfig.componentSizes.button.options
      }
    }
  };
};

// تبدیل تنظیمات themeConfig به فرم
export const convertThemeConfigToFormData = (config) => {
  // تبدیل زبان‌ها از آبجکت به آرایه
  const languagesArray = [];
  if (config.languages) {
    Object.keys(config.languages)
      .filter(code => code !== '_comment') // حذف _comment
      .forEach(code => {
      const lang = config.languages[code];
      languagesArray.push({
        code: lang.code || code,
        name: lang.name || '',
        nativeName: lang.nativeName || lang.name || '',
        direction: lang.direction || 'ltr',
        calendar: lang.calendar || 'gregorian',
        fontPrimary: lang.font?.primary || 'Arial',
        fontFallback: lang.font?.fallback || 'Tahoma, Arial, sans-serif',
        translationFile: lang.translationFile || `${code}.json`,
        dateFormat: lang.dateFormat || 'MM/DD/YYYY',

        currency: lang.currency || 'USD',
        currencySymbol: lang.currencySymbol || '$',
        isActive: lang.isActive !== undefined ? lang.isActive : true,
        isDefault: lang.isDefault !== undefined ? lang.isDefault : false
      });
    });
  }

  return {
    // Site settings
    siteTitle: config.site.title,
    siteDescription: config.site.description,
    siteLogo: config.site.logo,
    
    // Company settings
    companyName: config.company.name,
    companyAddress: config.company.address,
    companyPhone: config.company.phone,
    companyMobile: config.company.mobile,
    companyEmail: config.company.email,
    companyWebsite: config.company.website,
    socialMedia: config.company.socialMedia,
    licenses: config.company.licenses,
    
    // Languages
    languages: languagesArray,
    
    // Colors (Light mode)
    primaryMain: config.colorPalettes.light.primary.main,
    primaryLight: config.colorPalettes.light.primary.light,
    primaryDark: config.colorPalettes.light.primary.dark,
    primaryContrast: config.colorPalettes.light.primary.contrast,
    secondaryMain: config.colorPalettes.light.secondary.main,
    secondaryLight: config.colorPalettes.light.secondary.light,
    secondaryDark: config.colorPalettes.light.secondary.dark,
    secondaryContrast: config.colorPalettes.light.secondary.contrast,
    
    // Neutral colors (Light mode)
    neutralWhite: config.colorPalettes.light.neutral.white,
    neutralLightGray: config.colorPalettes.light.neutral.lightGray,
    neutralGray: config.colorPalettes.light.neutral.gray,
    neutralDarkGray: config.colorPalettes.light.neutral.darkGray,
    neutralBlack: config.colorPalettes.light.neutral.black,
    
    // Status colors (Light mode)
    statusSuccess: config.colorPalettes.light.status.success,
    statusWarning: config.colorPalettes.light.status.warning,
    statusError: config.colorPalettes.light.status.error,
    statusInfo: config.colorPalettes.light.status.info,
    
    // Background colors (Light mode)
    backgroundPrimary: config.colorPalettes.light.background.primary,
    backgroundSecondary: config.colorPalettes.light.background.secondary,
    backgroundPaper: config.colorPalettes.light.background.paper,
    
    // Text colors (Light mode)
    textPrimary: config.colorPalettes.light.text.primary,
    textSecondary: config.colorPalettes.light.text.secondary,
    textDisabled: config.colorPalettes.light.text.disabled,
    
    // Transparent colors (Light mode)
    transparentPrimary: config.colorPalettes.light.transparent.primary,
    transparentSecondary: config.colorPalettes.light.transparent.secondary,
    transparentOverlay: config.colorPalettes.light.transparent.overlay,
    transparentWhite: config.colorPalettes.light.transparent.white,
    transparentIconButton: config.colorPalettes.light.transparent.iconButton,
    transparentIconButtonHover: config.colorPalettes.light.transparent.iconButtonHover,
    
    // Shadow colors (Light mode)
    shadowLight: config.colorPalettes.light.shadow.light,
    shadowMedium: config.colorPalettes.light.shadow.medium,
    shadowDark: config.colorPalettes.light.shadow.dark,
    
    // Border colors (Light mode)
    borderLight: config.colorPalettes.light.border.light,
    borderMedium: config.colorPalettes.light.border.medium,
    borderDark: config.colorPalettes.light.border.dark,
    
    // Gradient colors (Light mode)
    gradientPrimaryStart: config.colorPalettes.light.gradients.primary.start,
    gradientPrimaryEnd: config.colorPalettes.light.gradients.primary.end,
    gradientSecondaryStart: config.colorPalettes.light.gradients.secondary.start,
    gradientSecondaryEnd: config.colorPalettes.light.gradients.secondary.end,
    gradientFooterStart: config.colorPalettes.light.gradients.footer.start,
    gradientFooterEnd: config.colorPalettes.light.gradients.footer.end,
    
    // Colors (Dark mode)
    darkPrimaryMain: config.colorPalettes.dark.primary.main,
    darkPrimaryLight: config.colorPalettes.dark.primary.light,
    darkPrimaryDark: config.colorPalettes.dark.primary.dark,
    darkPrimaryContrast: config.colorPalettes.dark.primary.contrast,
    darkSecondaryMain: config.colorPalettes.dark.secondary.main,
    darkSecondaryLight: config.colorPalettes.dark.secondary.light,
    darkSecondaryDark: config.colorPalettes.dark.secondary.dark,
    darkSecondaryContrast: config.colorPalettes.dark.secondary.contrast,
    
    // Neutral colors (Dark mode)
    darkNeutralWhite: config.colorPalettes.dark.neutral.white,
    darkNeutralLightGray: config.colorPalettes.dark.neutral.lightGray,
    darkNeutralGray: config.colorPalettes.dark.neutral.gray,
    darkNeutralDarkGray: config.colorPalettes.dark.neutral.darkGray,
    darkNeutralBlack: config.colorPalettes.dark.neutral.black,
    
    // Status colors (Dark mode)
    darkStatusSuccess: config.colorPalettes.dark.status.success,
    darkStatusWarning: config.colorPalettes.dark.status.warning,
    darkStatusError: config.colorPalettes.dark.status.error,
    darkStatusInfo: config.colorPalettes.dark.status.info,
    
    // Background colors (Dark mode)
    darkBackgroundPrimary: config.colorPalettes.dark.background.primary,
    darkBackgroundSecondary: config.colorPalettes.dark.background.secondary,
    darkBackgroundPaper: config.colorPalettes.dark.background.paper,
    
    // Text colors (Dark mode)
    darkTextPrimary: config.colorPalettes.dark.text.primary,
    darkTextSecondary: config.colorPalettes.dark.text.secondary,
    darkTextDisabled: config.colorPalettes.dark.text.disabled,
    
    // Transparent colors (Dark mode)
    darkTransparentPrimary: config.colorPalettes.dark.transparent.primary,
    darkTransparentSecondary: config.colorPalettes.dark.transparent.secondary,
    darkTransparentOverlay: config.colorPalettes.dark.transparent.overlay,
    darkTransparentWhite: config.colorPalettes.dark.transparent.white,
    darkTransparentIconButton: config.colorPalettes.dark.transparent.iconButton,
    darkTransparentIconButtonHover: config.colorPalettes.dark.transparent.iconButtonHover,
    
    // Shadow colors (Dark mode)
    darkShadowLight: config.colorPalettes.dark.shadow.light,
    darkShadowMedium: config.colorPalettes.dark.shadow.medium,
    darkShadowDark: config.colorPalettes.dark.shadow.dark,
    
    // Border colors (Dark mode)
    darkBorderLight: config.colorPalettes.dark.border.light,
    darkBorderMedium: config.colorPalettes.dark.border.medium,
    darkBorderDark: config.colorPalettes.dark.border.dark,
    
    // Gradient colors (Dark mode)
    darkGradientPrimaryStart: config.colorPalettes.dark.gradients.primary.start,
    darkGradientPrimaryEnd: config.colorPalettes.dark.gradients.primary.end,
    darkGradientSecondaryStart: config.colorPalettes.dark.gradients.secondary.start,
    darkGradientSecondaryEnd: config.colorPalettes.dark.gradients.secondary.end,
    darkGradientFooterStart: config.colorPalettes.dark.gradients.footer.start,
    darkGradientFooterEnd: config.colorPalettes.dark.gradients.footer.end,
    
    // Typography
    baseFontSize: config.typography.baseFontSize,
    fontScales: config.typography.fontScales,
    
    // Font sizes
    fontSizeTextXs: config.typography.fontSizes.text.xs,
    fontSizeTextSm: config.typography.fontSizes.text.sm,
    fontSizeTextBase: config.typography.fontSizes.text.base,
    fontSizeTextLg: config.typography.fontSizes.text.lg,
    fontSizeTextXl: config.typography.fontSizes.text.xl,
    fontSizeText2xl: config.typography.fontSizes.text['2xl'],
    fontSizeText3xl: config.typography.fontSizes.text['3xl'],
    
    fontSizeHeadingH1: config.typography.fontSizes.heading.h1,
    fontSizeHeadingH2: config.typography.fontSizes.heading.h2,
    fontSizeHeadingH3: config.typography.fontSizes.heading.h3,
    fontSizeHeadingH4: config.typography.fontSizes.heading.h4,
    fontSizeHeadingH5: config.typography.fontSizes.heading.h5,
    fontSizeHeadingH6: config.typography.fontSizes.heading.h6,
    
    fontSizeButtonSmall: config.typography.fontSizes.button.small,
    fontSizeButtonMedium: config.typography.fontSizes.button.medium,
    fontSizeButtonLarge: config.typography.fontSizes.button.large,
    
    fontSizeInputSmall: config.typography.fontSizes.input.small,
    fontSizeInputMedium: config.typography.fontSizes.input.medium,
    fontSizeInputLarge: config.typography.fontSizes.input.large,
    
    // Component sizes
    componentDefaultSize: config.componentSizes.default,
    inputDefaultSize: config.componentSizes.input.default,
    buttonDefaultSize: config.componentSizes.button.default,
    
    // Border radius and transitions
    borderRadius: config.borderRadius.standard,
    borderRadiusCircle: config.borderRadius.circle,
    transitionStandard: config.transition.standard,
    transitionFast: config.transition.fast,
    transitionSlow: config.transition.slow,
    
    // Breakpoints
    breakpointXs: config.breakpoints.xs,
    breakpointSm: config.breakpoints.sm,
    breakpointMd: config.breakpoints.md,
    breakpointLg: config.breakpoints.lg,
    breakpointXl: config.breakpoints.xl,
    
    // Spacing
    spacingBase: config.spacing.base,
    spacingXs: config.spacing.xs,
    spacingSm: config.spacing.sm,
    spacingMd: config.spacing.md,
    spacingLg: config.spacing.lg,
    spacingXl: config.spacing.xl,
    spacing2xl: config.spacing["2xl"],
    spacing3xl: config.spacing["3xl"],
    spacing4xl: config.spacing["4xl"]
  };
};

// توابع کمکی برای مدیریت زبان‌ها
export const getAvailableFonts = () => availableFonts;
export const getCalendarTypes = () => calendarTypes;
export const getDateFormats = () => dateFormats;

export const getCurrencies = () => currencies;

// دریافت فایل‌های ترجمه موجود
export const getTranslationFiles = () => {
  // در حالت واقعی، این از سرور خوانده می‌شود
  // فعلاً فایل‌های موجود در پوشه locales را برمی‌گردانیم
  return [
    { name: 'fa.json', label: 'فارسی (fa.json)' },
    { name: 'en.json', label: 'English (en.json)' },
    { name: 'ar.json', label: 'العربية (ar.json)' }
  ];
};

// ایجاد زبان جدید
export const createNewLanguage = () => {
  return {
    code: '',
    name: '',
    nativeName: '',
    direction: 'ltr',
    calendar: 'gregorian',
    fontPrimary: 'Arial',
    fontFallback: 'Tahoma, Arial, sans-serif',
    translationFile: '',
    dateFormat: 'MM/DD/YYYY',

    currency: 'USD',
    currencySymbol: '$',
    isActive: true,
    isDefault: false
  };
};

// اعتبارسنجی زبان
export const validateLanguage = (language) => {
  const errors = [];
  
  if (!language.code || language.code.trim() === '') {
    errors.push('کد زبان الزامی است');
  }
  
  if (!language.name || language.name.trim() === '') {
    errors.push('نام زبان الزامی است');
  }
  
  if (!language.translationFile || language.translationFile.trim() === '') {
    errors.push('فایل ترجمه الزامی است');
  }
  
  return errors;
};

// تبدیل داده‌های دیتابیس به ساختار themeConfig
export const convertDatabaseToThemeConfig = (dbData) => {
  const themeConfig = { ...defaultThemeConfig };
  
  // تبدیل تنظیمات اصلی
  if (dbData.settings) {
    dbData.settings.forEach(setting => {
      const { category, key, value, languageCode } = setting;
      
      if (languageCode && languageCode !== 'fa') {
        // تنظیمات چندزبانه
        if (!themeConfig[category]) themeConfig[category] = {};
        if (!themeConfig[category][key]) themeConfig[category][key] = {};
        themeConfig[category][key][languageCode] = value;
      } else {
        // تنظیمات عمومی
        if (!themeConfig[category]) themeConfig[category] = {};
        themeConfig[category][key] = value;
      }
    });
  }
  
  // تبدیل زبان‌ها
  if (dbData.languages) {
    themeConfig.languages = {};
    dbData.languages.forEach(lang => {
      themeConfig.languages[lang.code] = {
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        direction: lang.direction,
        calendar: lang.calendar,
        font: {
          primary: lang.fontPrimary,
          fallback: lang.fontFallback
        },
        translationFile: lang.translationFile,
        dateFormat: lang.dateFormat,

        currency: lang.currency,
        currencySymbol: lang.currencySymbol,
        isActive: lang.isActive,
        isDefault: lang.isDefault
      };
    });
  }
  
  // تبدیل لینک‌ها (شبکه‌های اجتماعی و مجوزها)
  if (dbData.links) {
    const socialMedia = {};
    const licenses = [];
    
    dbData.links.forEach(link => {
      if (link.type === 'social_media') {
        socialMedia[link.title.toLowerCase()] = {
          icon: link.icon,
          url: link.url,
          label: {
            fa: link.title,
            en: link.title
          }
        };
      } else if (link.type === 'license') {
        licenses.push({
          name: {
            fa: link.title,
            en: link.title
          },
          number: link.id.toString(),
          url: link.url
        });
      }
    });
    
    if (!themeConfig.company) themeConfig.company = {};
    themeConfig.company.socialMedia = socialMedia;
    themeConfig.company.licenses = licenses;
  }
  
  return themeConfig;
};

// تبدیل ساختار themeConfig به فرمت دیتابیس
export const convertThemeConfigToDatabase = (themeConfig) => {
  const dbData = {
    settings: [],
    languages: [],
    links: []
  };
  
  // تبدیل تنظیمات اصلی
  Object.keys(themeConfig).forEach(category => {
    if (category === 'languages' || category === 'company') return;
    
    const categoryData = themeConfig[category];
    Object.keys(categoryData).forEach(key => {
      const value = categoryData[key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // تنظیمات چندزبانه
        if (value.fa || value.en) {
          Object.keys(value).forEach(lang => {
            dbData.settings.push({
              category,
              key,
              value: value[lang],
              languageCode: lang
            });
          });
        } else {
          // تنظیمات JSON
          dbData.settings.push({
            category,
            key,
            value: JSON.stringify(value),
            languageCode: 'fa'
          });
        }
      } else {
        // تنظیمات ساده
        dbData.settings.push({
          category,
          key,
          value,
          languageCode: 'fa'
        });
      }
    });
  });
  
  // تبدیل زبان‌ها
  if (themeConfig.languages) {
    Object.keys(themeConfig.languages)
      .filter(code => code !== '_comment') // حذف _comment
      .forEach(code => {
      const lang = themeConfig.languages[code];
      dbData.languages.push({
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        direction: lang.direction,
        calendar: lang.calendar,
        fontPrimary: lang.font?.primary,
        fontFallback: lang.font?.fallback,
        translationFile: lang.translationFile,
        dateFormat: lang.dateFormat,

        currency: lang.currency,
        currencySymbol: lang.currencySymbol,
        isActive: lang.isActive,
        isDefault: lang.isDefault
      });
    });
  }
  
  // تبدیل لینک‌ها
  if (themeConfig.company?.socialMedia) {
    Object.keys(themeConfig.company.socialMedia).forEach((key, index) => {
      const social = themeConfig.company.socialMedia[key];
      dbData.links.push({
        type: 'social_media',
        title: social.label?.fa || key,
        icon: social.icon,
        url: social.url,
        sortOrder: index + 1
      });
    });
  }
  
  if (themeConfig.company?.licenses) {
    themeConfig.company.licenses.forEach((license, index) => {
      dbData.links.push({
        type: 'license',
        title: license.name?.fa || `مجوز ${index + 1}`,
        imagePath: license.url,
        url: license.url,
        sortOrder: index + 1
      });
    });
  }
  
  return dbData;
};

// مدیریت قالب‌ها
export const loadThemeTemplates = async () => {
  try {
    // بارگذاری تمام قالب‌ها از API
    if (import.meta.env.MODE !== 'development' || import.meta.env.VITE_USE_API === 'true') {
      const response = await fetch('/api/theme/templates');
      if (response.ok) {
        const templates = await response.json();
        
        // تفکیک قالب‌های سیستمی و سفارشی
        const builtin = templates.filter(t => isSystemTemplate(t.id));
        const custom = templates.filter(t => !isSystemTemplate(t.id));
        
        return {
          builtin,
          custom,
          all: templates
        };
      }
    }
    
    // fallback برای حالت توسعه
    return {
      builtin: [],
      custom: [],
      all: []
    };
  } catch (error) {
    console.error('خطا در بارگذاری قالب‌ها:', error);
    return {
      builtin: [],
      custom: [],
      all: []
    };
  }
};

// اعمال قالب
export const applyTemplate = async (templateId) => {
  try {
    const response = await fetch(`/api/theme/templates/${templateId}/apply`, {
      method: 'POST'
    });
    
    if (response.ok) {
      const result = await response.json();
      return result;
    }
    
    return { success: false, message: 'قالب یافت نشد' };
  } catch (error) {
    console.error('خطا در اعمال قالب:', error);
    return { success: false, message: 'خطا در اعمال قالب' };
  }
};

// ایجاد قالب سفارشی
export const createCustomTemplate = async (templateData) => {
  try {
    const response = await fetch('/api/theme/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData)
    });
    
    if (response.ok) {
      const result = await response.json();
      return result;
    }
    
    return { success: false, message: 'خطا در ایجاد قالب' };
  } catch (error) {
    console.error('خطا در ایجاد قالب:', error);
    return { success: false, message: 'خطا در ایجاد قالب' };
  }
};

// حذف قالب سفارشی
export const deleteCustomTemplate = async (templateId) => {
  try {
    // بررسی اینکه آیا قالب قابل حذف است
    if (!isDeletableTemplate(templateId)) {
      return { success: false, message: 'قالب پیش‌فرض قابل حذف نیست' };
    }
    
    const response = await fetch(`/api/theme/templates/${templateId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      const result = await response.json();
      return result;
    }
    
    return { success: false, message: 'خطا در حذف قالب' };
  } catch (error) {
    console.error('خطا در حذف قالب:', error);
    return { success: false, message: 'خطا در حذف قالب' };
  }
};
