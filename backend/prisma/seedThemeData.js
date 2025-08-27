import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedThemeData() {
  try {
    console.log('🌱 شروع وارد کردن داده‌های اولیه تم...');

    // حذف داده‌های موجود
    await prisma.themeSettings.deleteMany({});
    await prisma.themeLanguages.deleteMany({});
    await prisma.themeLinks.deleteMany({});
    await prisma.themeTemplates.deleteMany({});

    // ایجاد زبان‌های پیش‌فرض
    console.log('📝 ایجاد زبان‌های پیش‌فرض...');
    await prisma.themeLanguages.createMany({
      data: [
        {
          thlCode: 'fa',
          thlName: 'فارسی',
          thlNativeName: 'فارسی',
          thlDirection: 'rtl',
          thlCalendar: 'persian',
          thlFontPrimary: 'Vazir',
          thlFontFallback: 'Tahoma, Arial, sans-serif',
          thlTranslationFile: 'fa.json',
          thlDateFormat: 'YYYY/MM/DD',
          thlTimeFormat: 'HH:mm',
          thlNumberFormat: 'fa-IR',
          thlCurrency: 'IRR',
          thlCurrencySymbol: 'ریال',
          thlIsActive: true,
          thlIsDefault: true,
          thlCreatedBy: 'system'
        },
        {
          thlCode: 'en',
          thlName: 'English',
          thlNativeName: 'English',
          thlDirection: 'ltr',
          thlCalendar: 'gregorian',
          thlFontPrimary: 'Arial',
          thlFontFallback: 'Arial, sans-serif',
          thlTranslationFile: 'en.json',
          thlDateFormat: 'MM/DD/YYYY',
          thlTimeFormat: 'HH:mm',
          thlNumberFormat: 'en-US',
          thlCurrency: 'USD',
          thlCurrencySymbol: '$',
          thlIsActive: true,
          thlIsDefault: false,
          thlCreatedBy: 'system'
        }
      ]
    });

    // ایجاد تنظیمات پیش‌فرض
    console.log('⚙️ ایجاد تنظیمات پیش‌فرض...');
    const defaultSettings = [
      // تنظیمات سایت
      { category: 'site', key: 'title', value: { fa: 'سامانه رزرواسیون', en: 'Booking System' }, languageCode: 'fa' },
      { category: 'site', key: 'description', value: { fa: 'سامانه مدیریت رزرواسیون و رزرو آنلاین', en: 'Online booking and reservation management system' }, languageCode: 'fa' },
      { category: 'site', key: 'logo', value: '/images/logo.png', languageCode: 'fa' },
      
      // تنظیمات شرکت
      { category: 'company', key: 'name', value: { fa: 'شرکت نمونه', en: 'Sample Company' }, languageCode: 'fa' },
      { category: 'company', key: 'address', value: { fa: 'تهران، خیابان ولیعصر', en: 'Tehran, Vali-e-Asr St.' }, languageCode: 'fa' },
      { category: 'company', key: 'phone', value: '021-12345678', languageCode: 'fa' },
      { category: 'company', key: 'mobile', value: '09123456789', languageCode: 'fa' },
      { category: 'company', key: 'email', value: 'info@example.com', languageCode: 'fa' },
      { category: 'company', key: 'website', value: 'https://example.com', languageCode: 'fa' },
      
      // تنظیمات رنگ
      { category: 'colorPalettes', key: 'light', value: {
        primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', contrast: '#ffffff' },
        secondary: { main: '#7b1fa2', light: '#ba68c8', dark: '#6a1b9a', contrast: '#ffffff' },
        neutral: { white: '#ffffff', lightGray: '#f5f5f5', gray: '#e0e0e0', darkGray: '#757575', black: '#000000' },
        status: { success: '#4caf50', warning: '#ff9800', error: '#f44336', info: '#2196f3' },
        background: { primary: '#ffffff', secondary: '#f5f7fa', paper: '#ffffff' },
        text: { primary: '#212121', secondary: '#757575', disabled: '#bdbdbd' }
      }, languageCode: 'fa' },
      
      { category: 'colorPalettes', key: 'dark', value: {
        primary: { main: '#90caf9', light: '#e3f2fd', dark: '#42a5f5', contrast: '#000000' },
        secondary: { main: '#f48fb1', light: '#fce4ec', dark: '#ad1457', contrast: '#000000' },
        neutral: { white: '#000000', lightGray: '#303030', gray: '#424242', darkGray: '#616161', black: '#ffffff' },
        status: { success: '#66bb6a', warning: '#ffb74d', error: '#f44336', info: '#42a5f5' },
        background: { primary: '#121212', secondary: '#1e1e1e', paper: '#1e1e1e' },
        text: { primary: '#ffffff', secondary: '#b0b0b0', disabled: '#616161' }
      }, languageCode: 'fa' },
      
      // تنظیمات تایپوگرافی
      { category: 'typography', key: 'baseFontSize', value: 16, languageCode: 'fa' },
      { category: 'typography', key: 'fontScales', value: { normal: 1.0 }, languageCode: 'fa' },
      { category: 'typography', key: 'text', value: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 }, languageCode: 'fa' },
      { category: 'typography', key: 'heading', value: { h1: 32, h2: 28, h3: 24, h4: 20, h5: 18, h6: 16 }, languageCode: 'fa' },
      { category: 'typography', key: 'button', value: { small: 12, medium: 14, large: 16 }, languageCode: 'fa' },
      { category: 'typography', key: 'input', value: { small: 12, medium: 14, large: 16 }, languageCode: 'fa' },
      
      // تنظیمات border radius
      { category: 'borderRadius', key: 'standard', value: '8px', languageCode: 'fa' },
      { category: 'borderRadius', key: 'circle', value: '50%', languageCode: 'fa' },
      
      // تنظیمات transition
      { category: 'transition', key: 'standard', value: 'all 0.2s ease', languageCode: 'fa' },
      { category: 'transition', key: 'fast', value: 'all 0.1s ease', languageCode: 'fa' },
      { category: 'transition', key: 'slow', value: 'all 0.3s ease', languageCode: 'fa' },
      
      // تنظیمات breakpoints
      { category: 'breakpoints', key: 'xs', value: 0, languageCode: 'fa' },
      { category: 'breakpoints', key: 'sm', value: 600, languageCode: 'fa' },
      { category: 'breakpoints', key: 'md', value: 900, languageCode: 'fa' },
      { category: 'breakpoints', key: 'lg', value: 1200, languageCode: 'fa' },
      { category: 'breakpoints', key: 'xl', value: 1536, languageCode: 'fa' },
      
      // تنظیمات spacing
      { category: 'spacing', key: 'base', value: 8, languageCode: 'fa' },
      { category: 'spacing', key: 'xs', value: 4, languageCode: 'fa' },
      { category: 'spacing', key: 'sm', value: 8, languageCode: 'fa' },
      { category: 'spacing', key: 'md', value: 16, languageCode: 'fa' },
      { category: 'spacing', key: 'lg', value: 24, languageCode: 'fa' },
      { category: 'spacing', key: 'xl', value: 32, languageCode: 'fa' },
      { category: 'spacing', key: '2xl', value: 48, languageCode: 'fa' },
      { category: 'spacing', key: '3xl', value: 64, languageCode: 'fa' },
      { category: 'spacing', key: '4xl', value: 96, languageCode: 'fa' },
      
      // تنظیمات component sizes
      { category: 'componentSizes', key: 'input', value: { defaultSize: 'small' }, languageCode: 'fa' },
      { category: 'componentSizes', key: 'button', value: { defaultSize: 'medium' }, languageCode: 'fa' }
    ];

    for (const setting of defaultSettings) {
      await prisma.themeSettings.create({
        data: {
          thsCategory: setting.category,
          thsKey: setting.key,
          thsValue: setting.value,
          thsLanguageCode: setting.languageCode,
          thsCreatedBy: 'system'
        }
      });
    }

    // ایجاد لینک‌های پیش‌فرض
    console.log('🔗 ایجاد لینک‌های پیش‌فرض...');
    await prisma.themeLinks.createMany({
      data: [
        {
          thlType: 'social_media',
          thlTitle: 'تلگرام',
          thlIcon: 'telegram',
          thlUrl: 'https://t.me/example',
          thlSortOrder: 1,
          thlCreatedBy: 'system'
        },
        {
          thlType: 'social_media',
          thlTitle: 'اینستاگرام',
          thlIcon: 'instagram',
          thlUrl: 'https://instagram.com/example',
          thlSortOrder: 2,
          thlCreatedBy: 'system'
        },
        {
          thlType: 'license',
          thlTitle: 'مجوز تجاری',
          thlImagePath: '/images/licenses/commercial.png',
          thlUrl: 'https://example.com/license',
          thlSortOrder: 1,
          thlCreatedBy: 'system'
        }
      ]
    });

    // ایجاد قالب‌های پیش‌فرض
    console.log('🎨 ایجاد قالب‌های پیش‌فرض...');
    
    // قالب پیش‌فرض
    await prisma.themeTemplates.create({
      data: {
        thtId: 'default',
        thtName: 'پیش‌فرض',
        thtDescription: 'قالب پیش‌فرض سیستم با رنگ‌های آبی و طراحی کلاسیک',
        thtSettings: {
          site: {
            title: { fa: 'سامانه رزرواسیون', en: 'Booking System' },
            description: { fa: 'سامانه مدیریت رزرواسیون و رزرو آنلاین', en: 'Online booking and reservation management system' },
            logo: '/images/logo.png'
          },
          company: {
            name: { fa: 'شرکت نمونه', en: 'Sample Company' },
            address: { fa: 'تهران، خیابان ولیعصر', en: 'Tehran, Vali-e-Asr St.' },
            phone: '021-12345678',
            mobile: '09123456789',
            email: 'info@example.com',
            website: 'https://example.com'
          },
          colorPalettes: {
            light: {
              primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', contrast: '#ffffff' },
              secondary: { main: '#7b1fa2', light: '#ba68c8', dark: '#6a1b9a', contrast: '#ffffff' },
              neutral: { white: '#ffffff', lightGray: '#f5f5f5', gray: '#e0e0e0', darkGray: '#757575', black: '#000000' },
              status: { success: '#4caf50', warning: '#ff9800', error: '#f44336', info: '#2196f3' },
              background: { primary: '#ffffff', secondary: '#f5f7fa', paper: '#ffffff' },
              text: { primary: '#212121', secondary: '#757575', disabled: '#bdbdbd' }
            },
            dark: {
              primary: { main: '#90caf9', light: '#e3f2fd', dark: '#42a5f5', contrast: '#000000' },
              secondary: { main: '#f48fb1', light: '#fce4ec', dark: '#ad1457', contrast: '#000000' },
              neutral: { white: '#000000', lightGray: '#303030', gray: '#424242', darkGray: '#616161', black: '#ffffff' },
              status: { success: '#66bb6a', warning: '#ffb74d', error: '#f44336', info: '#42a5f5' },
              background: { primary: '#121212', secondary: '#1e1e1e', paper: '#1e1e1e' },
              text: { primary: '#ffffff', secondary: '#b0b0b0', disabled: '#616161' }
            }
          },
          typography: {
            baseFontSize: 16,
            fontScales: { normal: 1.0 },
            text: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
            heading: { h1: 32, h2: 28, h3: 24, h4: 20, h5: 18, h6: 16 },
            button: { small: 12, medium: 14, large: 16 },
            input: { small: 12, medium: 14, large: 16 }
          },
          borderRadius: { standard: '8px', circle: '50%' },
          transition: { standard: 'all 0.2s ease', fast: 'all 0.1s ease', slow: 'all 0.3s ease' },
          breakpoints: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
          spacing: { base: 8, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64, '4xl': 96 },
          componentSizes: { input: { defaultSize: 'small' }, button: { defaultSize: 'medium' } }
        },
        thtIsDefault: true,
        thtIsSystem: true,
        thtCreatedBy: 'system'
      }
    });

    // قالب مدرن
    await prisma.themeTemplates.create({
      data: {
        thtId: 'modern',
        thtName: 'مدرن',
        thtDescription: 'قالب مدرن با رنگ‌های تیره و طراحی مینیمال',
        thtSettings: {
          site: {
            title: { fa: 'سامانه مدرن', en: 'Modern System' },
            description: { fa: 'سامانه مدرن و پیشرفته', en: 'Modern and advanced system' },
            logo: '/images/logo.png'
          },
          company: {
            name: { fa: 'شرکت مدرن', en: 'Modern Company' },
            address: { fa: 'تهران، خیابان ولیعصر', en: 'Tehran, Vali-e-Asr St.' },
            phone: '021-12345678',
            mobile: '09123456789',
            email: 'info@modern.com',
            website: 'https://modern.com'
          },
          colorPalettes: {
            light: {
              primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5', contrast: '#ffffff' },
              secondary: { main: '#ec4899', light: '#f472b6', dark: '#db2777', contrast: '#ffffff' },
              neutral: { white: '#ffffff', lightGray: '#f8fafc', gray: '#e2e8f0', darkGray: '#64748b', black: '#0f172a' },
              status: { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
              background: { primary: '#ffffff', secondary: '#f8fafc', paper: '#ffffff' },
              text: { primary: '#0f172a', secondary: '#64748b', disabled: '#cbd5e1' }
            },
            dark: {
              primary: { main: '#818cf8', light: '#c7d2fe', dark: '#6366f1', contrast: '#1e1b4b' },
              secondary: { main: '#f472b6', light: '#fce7f3', dark: '#ec4899', contrast: '#831843' },
              neutral: { white: '#0f172a', lightGray: '#1e293b', gray: '#334155', darkGray: '#64748b', black: '#f8fafc' },
              status: { success: '#34d399', warning: '#fbbf24', error: '#f87171', info: '#60a5fa' },
              background: { primary: '#0f172a', secondary: '#1e293b', paper: '#1e293b' },
              text: { primary: '#f8fafc', secondary: '#cbd5e1', disabled: '#64748b' }
            }
          },
          typography: {
            baseFontSize: 16,
            fontScales: { normal: 1.0 },
            text: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
            heading: { h1: 36, h2: 30, h3: 24, h4: 20, h5: 18, h6: 16 },
            button: { small: 12, medium: 14, large: 16 },
            input: { small: 12, medium: 14, large: 16 }
          },
          borderRadius: { standard: '12px', circle: '50%' },
          transition: { standard: 'all 0.3s ease', fast: 'all 0.15s ease', slow: 'all 0.5s ease' },
          breakpoints: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 },
          spacing: { base: 8, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64, '4xl': 96 },
          componentSizes: { input: { defaultSize: 'medium' }, button: { defaultSize: 'medium' } }
        },
        thtIsDefault: false,
        thtIsSystem: true,
        thtCreatedBy: 'system'
      }
    });

    // قالب کلاسیک
    await prisma.themeTemplates.create({
      data: {
        thtId: 'classic',
        thtName: 'کلاسیک',
        thtDescription: 'قالب کلاسیک با رنگ‌های گرم و طراحی سنتی',
        thtSettings: {
          site: {
            title: { fa: 'سامانه کلاسیک', en: 'Classic System' },
            description: { fa: 'سامانه کلاسیک و رسمی', en: 'Classic and formal system' },
            logo: '/images/logo.png'
          },
          company: {
            name: { fa: 'شرکت کلاسیک', en: 'Classic Company' },
            address: { fa: 'تهران، خیابان ولیعصر', en: 'Tehran, Vali-e-Asr St.' },
            phone: '021-12345678',
            mobile: '09123456789',
            email: 'info@classic.com',
            website: 'https://classic.com'
          },
          colorPalettes: {
            light: {
              primary: { main: '#8b4513', light: '#cd853f', dark: '#654321', contrast: '#ffffff' },
              secondary: { main: '#d2691e', light: '#daa520', dark: '#b8860b', contrast: '#ffffff' },
              neutral: { white: '#fefefe', lightGray: '#f5f5dc', gray: '#ddd', darkGray: '#696969', black: '#2f4f4f' },
              status: { success: '#228b22', warning: '#ff8c00', error: '#dc143c', info: '#4682b4' },
              background: { primary: '#fefefe', secondary: '#f5f5dc', paper: '#fefefe' },
              text: { primary: '#2f4f4f', secondary: '#696969', disabled: '#a9a9a9' }
            },
            dark: {
              primary: { main: '#cd853f', light: '#f5deb3', dark: '#8b4513', contrast: '#2f4f4f' },
              secondary: { main: '#daa520', light: '#ffffe0', dark: '#b8860b', contrast: '#2f4f4f' },
              neutral: { white: '#2f4f4f', lightGray: '#404040', gray: '#505050', darkGray: '#696969', black: '#f5f5dc' },
              status: { success: '#32cd32', warning: '#ffa500', error: '#ff6347', info: '#87ceeb' },
              background: { primary: '#2f4f4f', secondary: '#404040', paper: '#404040' },
              text: { primary: '#f5f5dc', secondary: '#d3d3d3', disabled: '#a9a9a9' }
            }
          },
          typography: {
            baseFontSize: 16,
            fontScales: { normal: 1.0 },
            text: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
            heading: { h1: 32, h2: 28, h3: 24, h4: 20, h5: 18, h6: 16 },
            button: { small: 12, medium: 14, large: 16 },
            input: { small: 12, medium: 14, large: 16 }
          },
          borderRadius: { standard: '6px', circle: '50%' },
          transition: { standard: 'all 0.2s ease', fast: 'all 0.1s ease', slow: 'all 0.3s ease' },
          breakpoints: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
          spacing: { base: 8, xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48, '3xl': 64, '4xl': 96 },
          componentSizes: { input: { defaultSize: 'small' }, button: { defaultSize: 'medium' } }
        },
        thtIsDefault: false,
        thtIsSystem: true,
        thtCreatedBy: 'system'
      }
    });

    console.log('✅ داده‌های اولیه تم با موفقیت وارد شدند!');
  } catch (error) {
    console.error('❌ خطا در وارد کردن داده‌های اولیه تم:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای seed
seedThemeData();
