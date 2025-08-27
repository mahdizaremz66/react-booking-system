// تنظیمات زبان‌ها
export const calendarTypes = [
  {
    value: 'persian',
    label: 'هجری شمسی (Persian)',
    description: 'تقویم فارسی/ایرانی'
  },
  {
    value: 'gregorian',
    label: 'میلادی (Gregorian)',
    description: 'تقویم میلادی'
  },
  {
    value: 'hijri',
    label: 'هجری قمری (Hijri)',
    description: 'تقویم هجری قمری'
  }
];

export const dateFormats = [
  {
    value: 'YYYY/MM/DD',
    label: 'YYYY/MM/DD',
    example: '1402/12/25'
  },
  {
    value: 'DD/MM/YYYY',
    label: 'DD/MM/YYYY',
    example: '25/12/2024'
  },
  {
    value: 'MM/DD/YYYY',
    label: 'MM/DD/YYYY',
    example: '12/25/2024'
  },
  {
    value: 'YYYY-MM-DD',
    label: 'YYYY-MM-DD',
    example: '2024-12-25'
  },
  {
    value: 'DD-MM-YYYY',
    label: 'DD-MM-YYYY',
    example: '25-12-2024'
  }
];

export const timeFormats = [
  {
    value: 'HH:mm',
    label: '24 ساعته (HH:mm)',
    example: '14:30'
  },
  {
    value: 'hh:mm A',
    label: '12 ساعته (hh:mm A)',
    example: '02:30 PM'
  },
  {
    value: 'HH:mm:ss',
    label: '24 ساعته با ثانیه (HH:mm:ss)',
    example: '14:30:45'
  },
  {
    value: 'hh:mm:ss A',
    label: '12 ساعته با ثانیه (hh:mm:ss A)',
    example: '02:30:45 PM'
  }
];

export const numberFormats = [
  {
    value: 'fa-IR',
    label: 'فارسی (fa-IR)',
    example: '۱,۲۳۴,۵۶۷'
  },
  {
    value: 'en-US',
    label: 'انگلیسی آمریکا (en-US)',
    example: '1,234,567'
  },
  {
    value: 'en-GB',
    label: 'انگلیسی بریتانیا (en-GB)',
    example: '1,234,567'
  },
  {
    value: 'ar-SA',
    label: 'عربی (ar-SA)',
    example: '١٬٢٣٤٬٥٦٧'
  }
];

export const currencies = [
  {
    code: 'IRR',
    symbol: 'ریال',
    name: 'ریال ایران',
    position: 'right'
  },
  {
    code: 'USD',
    symbol: '$',
    name: 'دلار آمریکا',
    position: 'left'
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'یورو',
    position: 'left'
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'پوند بریتانیا',
    position: 'left'
  },
  {
    code: 'AED',
    symbol: 'د.إ',
    name: 'درهم امارات',
    position: 'right'
  },
  {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'ریال عربستان',
    position: 'right'
  }
];

// زبان‌های پیش‌فرض
export const defaultLanguages = [
  {
    code: 'fa',
    name: 'فارسی',
    nativeName: 'فارسی',
    direction: 'rtl',
    calendar: 'persian',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    numberFormat: 'fa-IR',
    currency: 'IRR',
    isActive: true,
    isDefault: true
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    calendar: 'gregorian',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: 'en-US',
    currency: 'USD',
    isActive: true,
    isDefault: false
  }
];

// دریافت ارز بر اساس کد
export const getCurrencyByCode = (code) => {
  return currencies.find(currency => currency.code === code);
};

// دریافت فرمت تاریخ بر اساس مقدار
export const getDateFormatByValue = (value) => {
  return dateFormats.find(format => format.value === value);
};

// دریافت فرمت زمان بر اساس مقدار
export const getTimeFormatByValue = (value) => {
  return timeFormats.find(format => format.value === value);
};

// دریافت فرمت عدد بر اساس مقدار
export const getNumberFormatByValue = (value) => {
  return numberFormats.find(format => format.value === value);
};
