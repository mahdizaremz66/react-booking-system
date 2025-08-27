// تنظیمات مرکزی تم و سایت
// این فایل از themeSettings.json می‌خواند و تنظیمات پیش‌فرض را نگه می‌دارد

import themeSettingsData from './themeSettings.json';

// تنظیمات پیش‌فرض (برای بازنشانی)
export const defaultThemeConfig = {
  site: {
    title: {
      fa: "سامانه رزرواسیون",
      en: "Booking System"
    },
    description: {
      fa: "سامانه مدیریت رزرواسیون و رزرو آنلاین",
      en: "Online booking and reservation management system"
    },
    logo: "/images/logo.png"
  },
  company: {
    name: {
      fa: "گروه نرم افرازی صبا افزار کویر یزد",
      en: "Saba Afzar Kavir Yazd Software Group"
    },
    address: {
      fa: "یزد، خیابان کاشانی، روبروی مسجد اتابکی",
      en: "Yazd, Kashani St., Opposite Etabaki Mosque"
    },
    phone: "03538215315",
    mobile: "09132537217",
    email: "mahdizare.mz66@gmail.com",
    website: "https://sabaafzar.com",
    socialMedia: {
      instagram: {
        icon: "instagram",
        url: "https://instagram.com/company",
        label: {
          fa: "اینستاگرام",
          en: "Instagram"
        }
      },
      telegram: {
        icon: "telegram",
        url: "https://t.me/company",
        label: {
          fa: "تلگرام",
          en: "Telegram"
        }
      },
      twitter: {
        icon: "twitter",
        url: "https://twitter.com/company",
        label: {
          fa: "توییتر",
          en: "Twitter"
        }
      },
      linkedin: {
        icon: "linkedin",
        url: "https://linkedin.com/company",
        label: {
          fa: "لینکدین",
          en: "LinkedIn"
        }
      }
    },
    licenses: [
      {
        name: {
          fa: "مجوز تجارت الکترونیک",
          en: "E-commerce License"
        },
        number: "123456789",
        url: "https://license1.com"
      },
      {
        name: {
          fa: "مجوز فناوری اطلاعات",
          en: "IT License"
        },
        number: "987654321",
        url: "https://license2.com"
      }
    ]
  },
        languages: {
        fa: {
          code: "fa",
          name: "فارسی",
          nativeName: "فارسی",
          direction: "rtl",
          calendar: "persian",
          font: {
            primary: "IRANSansXFaNum",
            fallback: "Tahoma, Arial, sans-serif"
          },
          translationFile: "fa.json",
          dateFormat: "YYYY/MM/DD",
          timeFormat: "HH:mm",
          numberFormat: "fa-IR",
          currency: "IRR",
          currencySymbol: "ریال",
          isActive: true,
          isDefault: true
        },
        en: {
          code: "en",
          name: "English",
          nativeName: "English",
          direction: "ltr",
          calendar: "gregorian",
          font: {
            primary: "IRANSansX",
            fallback: "Tahoma, Arial, sans-serif"
          },
          translationFile: "en.json",
          dateFormat: "MM/DD/YYYY",
          timeFormat: "HH:mm",
          numberFormat: "en-US",
          currency: "USD",
          currencySymbol: "$",
          isActive: true,
          isDefault: false
        }
      },
  colorPalettes: {
    light: {
      primary: {
        main: "#1976d2",
        light: "#42a5f5",
        dark: "#1565c0",
        contrast: "#ffffff"
      },
      secondary: {
        main: "#7b1fa2",
        light: "#ba68c8",
        dark: "#6a1b9a",
        contrast: "#ffffff"
      },
      neutral: {
        white: "#ffffff",
        lightGray: "#f5f5f5",
        gray: "#e0e0e0",
        darkGray: "#757575",
        black: "#000000"
      },
      status: {
        success: "#4caf50",
        warning: "#ff9800",
        error: "#f44336",
        info: "#2196f3"
      },
      background: {
        primary: "#ffffff",
        secondary: "#f5f7fa",
        paper: "#ffffff"
      },
      text: {
        primary: "#000000",
        secondary: "#757575",
        disabled: "#bdbdbd"
      },
      transparent: {
        primary: "rgba(25, 118, 210, 0.15)",
        secondary: "rgba(123, 31, 162, 0.15)",
        overlay: "rgba(0, 0, 0, 0.1)",
        white: "rgba(255, 255, 255, 0.9)",
        iconButton: "rgba(255, 255, 255, 0.1)",
        iconButtonHover: "rgba(255, 255, 255, 0.2)"
      },
      shadow: {
        light: "rgba(0, 0, 0, 0.05)",
        medium: "rgba(0, 0, 0, 0.1)",
        dark: "rgba(0, 0, 0, 0.2)"
      },
      border: {
        light: "#e0e0e0",
        medium: "#bdbdbd",
        dark: "#757575"
      },
      gradients: {
        primary: {
          start: "#7b1fa2",
          end: "#1976d2"
        },
        secondary: {
          start: "#e3f2fd",
          end: "#f3e5f5"
        },
        footer: {
          start: "#f8f9fa",
          end: "#e9ecef"
        }
      }
    },
    dark: {
      primary: {
        main: "#90caf9",
        light: "#e3f2fd",
        dark: "#42a5f5",
        contrast: "#000000"
      },
      secondary: {
        main: "#ce93d8",
        light: "#f3e5f5",
        dark: "#ab47bc",
        contrast: "#000000"
      },
      neutral: {
        white: "#ffffff",
        lightGray: "#424242",
        gray: "#616161",
        darkGray: "#9e9e9e",
        black: "#000000"
      },
      status: {
        success: "#66bb6a",
        warning: "#ffb74d",
        error: "#ef5350",
        info: "#42a5f5"
      },
      background: {
        primary: "#181a1b",
        secondary: "#2d2f30",
        paper: "#2d2f30"
      },
      text: {
        primary: "#ffffff",
        secondary: "#bdbdbd",
        disabled: "#757575"
      },
      transparent: {
        primary: "rgba(144, 202, 249, 0.15)",
        secondary: "rgba(206, 147, 216, 0.15)",
        overlay: "rgba(0, 0, 0, 0.3)",
        white: "rgba(255, 255, 255, 0.1)",
        iconButton: "rgba(255, 255, 255, 0.1)",
        iconButtonHover: "rgba(255, 255, 255, 0.2)"
      },
      shadow: {
        light: "rgba(0, 0, 0, 0.2)",
        medium: "rgba(0, 0, 0, 0.4)",
        dark: "rgba(0, 0, 0, 0.6)"
      },
      border: {
        light: "#424242",
        medium: "#616161",
        dark: "#9e9e9e"
      },
      gradients: {
        primary: {
          start: "#414345",
          end: "#232526"
        },
        secondary: {
          start: "#2d2f30",
          end: "#181a1b"
        },
        footer: {
          start: "#343a40",
          end: "#495057"
        }
      }
    }
  },
  borderRadius: {
    standard: '10px',
    circle: "50%"
  },
  transition: {
    standard: 'all 0.2s ease',
    fast: 'all 0.1s ease',
    slow: 'all 0.3s ease'
  },
  typography: {
    baseFontSize: 13,
    fontScales: {
      small: 0.85,
      normal: 1.0,
      large: 1.15,
      xlarge: 1.3
    },
    fontSizes: {
      text: {
        xs: 11,
        sm: 12,
        base: 13,
        lg: 14,
        xl: 16,
        '2xl': 18,
        '3xl': 20
      },
      heading: {
        h1: 24,
        h2: 20,
        h3: 18,
        h4: 16,
        h5: 14,
        h6: 13
      },
      button: {
        small: 12,
        medium: 13,
        large: 14
      },
      input: {
        small: 12,
        medium: 13,
        large: 14
      }
    }
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  },
  spacing: {
    base: 8,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
    "2xl": 8,
    "3xl": 10,
    "4xl": 12
  },
  componentSizes: {
    default: 'medium',
    input: {
      default: 'small',
      options: ['small', 'medium', 'large']
    },
    button: {
      default: 'medium',
      options: ['small', 'medium', 'large']
    }
  }
};

// تنظیمات فعلی (از themeSettings.json)
export const themeConfig = themeSettingsData;

// تابع برای بازنشانی به تنظیمات پیش‌فرض
export const resetToDefault = () => {
  return defaultThemeConfig;
};

export default themeConfig;