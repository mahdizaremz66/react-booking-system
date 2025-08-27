// این فایل دیگر قالب‌های داخلی ندارد
// تمام قالب‌ها از بک‌اند و دیتابیس لود می‌شوند

// تابع برای بررسی اینکه آیا قالب سیستمی است یا نه
export const isSystemTemplate = (templateId) => {
  return templateId === 'default';
};

// تابع برای بررسی اینکه آیا قالب قابل حذف است یا نه
export const isDeletableTemplate = (templateId) => {
  return templateId !== 'default';
};
