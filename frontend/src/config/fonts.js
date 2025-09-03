// تعریف فونت‌های موجود در پروژه (فقط فونت‌های نصب شده)
export const availableFonts = [
  {
    family: 'IRANSansXFaNum',
    name: 'ایران سنس ایکس فارسی',
    category: 'persian',
    weights: ['normal', 'bold'],
    fallback: 'Tahoma, Arial, sans-serif'
  },
  {
    family: 'IRANSansX',
    name: 'ایران سنس ایکس',
    category: 'persian',
    weights: ['normal', 'bold'],
    fallback: 'Tahoma, Arial, sans-serif'
  },
  {
    family: 'Vazirmatn',
    name: 'وزیرمتن',
    category: 'persian',
    weights: ['normal', 'bold'],
    fallback: 'Tahoma, Arial, sans-serif'
  }
];

// فونت‌های پیش‌فرض برای هر زبان
export const defaultFonts = {
  fa: 'IRANSansXFaNum',
  en: 'IRANSansX',
  ar: 'IRANSansXFaNum'
};

// دریافت فونت‌های بر اساس دسته‌بندی
export const getFontsByCategory = (category) => {
  return availableFonts.filter(font => font.category === category);
};

// دریافت فونت بر اساس نام خانواده
export const getFontByFamily = (family) => {
  return availableFonts.find(font => font.family === family);
};
