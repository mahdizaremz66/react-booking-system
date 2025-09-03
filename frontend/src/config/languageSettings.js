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


