// سرویس مدیریت فایل‌های ترجمه

// دریافت لیست فایل‌های ترجمه موجود
export const getTranslationFiles = async () => {
  try {
    const response = await fetch('/api/translation-files');
    if (response.ok) {
      const data = await response.json();
      return data.files || [];
    }
    
    // fallback به فایل‌های پیش‌فرض
    return getDefaultTranslationFiles();
  } catch (error) {
    console.error('خطا در دریافت فایل‌های ترجمه:', error);
    return getDefaultTranslationFiles();
  }
};

// فایل‌های ترجمه پیش‌فرض (فقط در صورت خطا)
const getDefaultTranslationFiles = () => {
  return [
    { name: 'fa.json', label: 'fa.json', language: 'fa', isDefault: true },
    { name: 'en.json', label: 'en.json', language: 'en', isDefault: true }
  ];
};

// ایجاد فایل ترجمه جدید
export const createTranslationFile = async (fileName, language, content) => {
  try {
    const response = await fetch('/api/translation-files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName,
        language,
        content
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    }
    
    const error = await response.json();
    return { success: false, message: error.message || 'خطا در ایجاد فایل ترجمه' };
  } catch (error) {
    console.error('خطا در ایجاد فایل ترجمه:', error);
    return { success: false, message: 'خطا در ایجاد فایل ترجمه' };
  }
};



// حذف فایل ترجمه
export const deleteTranslationFile = async (fileName) => {
  try {
    const response = await fetch(`/api/translation-files/${fileName}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      return { success: true, message: 'فایل ترجمه با موفقیت حذف شد' };
    }
    
    const error = await response.json();
    return { success: false, message: error.message || 'خطا در حذف فایل ترجمه' };
  } catch (error) {
    console.error('خطا در حذف فایل ترجمه:', error);
    return { success: false, message: 'خطا در حذف فایل ترجمه' };
  }
};

// دریافت محتوای فایل ترجمه
export const getTranslationFileContent = async (fileName) => {
  try {
    const response = await fetch(`/api/translation-files/${fileName}/content`);
    if (response.ok) {
      const data = await response.json();
      return { success: true, content: data.content };
    }
    
    return { success: false, message: 'خطا در دریافت محتوای فایل' };
  } catch (error) {
    console.error('خطا در دریافت محتوای فایل:', error);
    return { success: false, message: 'خطا در دریافت محتوای فایل' };
  }
};

// به‌روزرسانی فایل ترجمه
export const updateTranslationFile = async (fileName, content) => {
  try {
    const response = await fetch(`/api/translation-files/${fileName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    
    if (response.ok) {
      return { success: true, message: 'فایل ترجمه با موفقیت به‌روزرسانی شد' };
    }
    
    const error = await response.json();
    return { success: false, message: error.message || 'خطا در به‌روزرسانی فایل ترجمه' };
  } catch (error) {
    console.error('خطا در به‌روزرسانی فایل ترجمه:', error);
    return { success: false, message: 'خطا در به‌روزرسانی فایل ترجمه' };
  }
};

// اعتبارسنجی نام فایل
export const validateFileName = (fileName) => {
  if (!fileName) {
    return { valid: false, message: 'نام فایل الزامی است' };
  }
  
  if (!fileName.endsWith('.json')) {
    return { valid: false, message: 'نام فایل باید با .json پایان یابد' };
  }
  
  if (fileName.length < 5) {
    return { valid: false, message: 'نام فایل باید حداقل 5 کاراکتر باشد' };
  }
  
  if (!/^[a-z]{2}\.json$/.test(fileName)) {
    return { valid: false, message: 'فرمت نام فایل باید به صورت xx.json باشد (مثل fa.json)' };
  }
  
  return { valid: true };
};

// دریافت قالب پیش‌فرض برای فایل ترجمه جدید
export const getDefaultTranslationTemplate = (language) => {
  return {
    translation: {
      common: {
        loading: language === 'fa' ? 'در حال بارگذاری...' : 'Loading...',
        error: language === 'fa' ? 'خطا' : 'Error',
        success: language === 'fa' ? 'موفقیت' : 'Success',
        cancel: language === 'fa' ? 'لغو' : 'Cancel',
        save: language === 'fa' ? 'ذخیره' : 'Save',
        edit: language === 'fa' ? 'ویرایش' : 'Edit',
        delete: language === 'fa' ? 'حذف' : 'Delete',
        add: language === 'fa' ? 'افزودن' : 'Add',
        search: language === 'fa' ? 'جستجو' : 'Search',
        filter: language === 'fa' ? 'فیلتر' : 'Filter',
        clear: language === 'fa' ? 'پاک کردن' : 'Clear',
        back: language === 'fa' ? 'بازگشت' : 'Back',
        next: language === 'fa' ? 'بعدی' : 'Next',
        previous: language === 'fa' ? 'قبلی' : 'Previous',
        submit: language === 'fa' ? 'ارسال' : 'Submit',
        close: language === 'fa' ? 'بستن' : 'Close',
        confirm: language === 'fa' ? 'تایید' : 'Confirm',
        yes: language === 'fa' ? 'بله' : 'Yes',
        no: language === 'fa' ? 'خیر' : 'No',
        ok: language === 'fa' ? 'تایید' : 'OK'
      }
    }
  };
};
