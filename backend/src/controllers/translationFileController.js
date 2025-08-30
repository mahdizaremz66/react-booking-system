import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// مسیر پوشه فایل‌های ترجمه (پوشه اصلی پروژه)
const TRANSLATIONS_DIR = path.join(__dirname, '../../../translations');

// اطمینان از وجود پوشه ترجمه‌ها
const ensureTranslationsDir = async () => {
  try {
    await fs.access(TRANSLATIONS_DIR);
  } catch {
    await fs.mkdir(TRANSLATIONS_DIR, { recursive: true });
  }
};

// دریافت لیست فایل‌های ترجمه
export const getTranslationFiles = async (req, res) => {
  try {
    await ensureTranslationsDir();
    
    const files = await fs.readdir(TRANSLATIONS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const translationFiles = jsonFiles.map(file => {
      const language = file.replace('.json', '');
      return {
        name: file,
        label: file, // فقط نام فایل
        language: language,
        isDefault: ['fa', 'en'].includes(language)
      };
    });

    res.json({
      success: true,
      files: translationFiles
    });
  } catch (error) {
    console.error('خطا در دریافت فایل‌های ترجمه:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت فایل‌های ترجمه',
      error: error.message
    });
  }
};

// ایجاد فایل ترجمه جدید
export const createTranslationFile = async (req, res) => {
  try {
    const { fileName, language, content } = req.body;
    const userId = req.user?.id || 'system';

    // اعتبارسنجی نام فایل
    if (!fileName || !fileName.endsWith('.json')) {
      return res.status(400).json({
        success: false,
        message: 'نام فایل باید با .json پایان یابد'
      });
    }

    await ensureTranslationsDir();
    
    const filePath = path.join(TRANSLATIONS_DIR, fileName);
    
    // بررسی وجود فایل
    try {
      await fs.access(filePath);
      return res.status(400).json({
        success: false,
        message: 'فایل ترجمه با این نام قبلاً وجود دارد'
      });
    } catch {
      // فایل وجود ندارد، ادامه می‌دهیم
    }

    // ایجاد فایل
    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf8');

    res.json({
      success: true,
      message: 'فایل ترجمه با موفقیت ایجاد شد',
      data: {
        name: fileName,
        language: language,
        path: filePath
      }
    });
  } catch (error) {
    console.error('خطا در ایجاد فایل ترجمه:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد فایل ترجمه',
      error: error.message
    });
  }
};

// دریافت محتوای فایل ترجمه
export const getTranslationFileContent = async (req, res) => {
  try {
    const { fileName } = req.params;
    
    const filePath = path.join(TRANSLATIONS_DIR, fileName);
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const parsedContent = JSON.parse(content);
      
      res.json({
        success: true,
        content: parsedContent
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          success: false,
          message: 'فایل ترجمه یافت نشد'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('خطا در دریافت محتوای فایل ترجمه:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت محتوای فایل ترجمه',
      error: error.message
    });
  }
};

// به‌روزرسانی فایل ترجمه
export const updateTranslationFile = async (req, res) => {
  try {
    const { fileName } = req.params;
    const { content } = req.body;
    const userId = req.user?.id || 'system';

    const filePath = path.join(TRANSLATIONS_DIR, fileName);
    
    // بررسی وجود فایل
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'فایل ترجمه یافت نشد'
      });
    }

    // به‌روزرسانی فایل
    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf8');

    res.json({
      success: true,
      message: 'فایل ترجمه با موفقیت به‌روزرسانی شد'
    });
  } catch (error) {
    console.error('خطا در به‌روزرسانی فایل ترجمه:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی فایل ترجمه',
      error: error.message
    });
  }
};

// حذف فایل ترجمه
export const deleteTranslationFile = async (req, res) => {
  try {
    const { fileName } = req.params;
    const userId = req.user?.id || 'system';

    // بررسی فایل‌های اصلی
    if (['fa.json', 'en.json'].includes(fileName)) {
      return res.status(400).json({
        success: false,
        message: 'فایل‌های ترجمه اصلی قابل حذف نیستند'
      });
    }

    const filePath = path.join(TRANSLATIONS_DIR, fileName);
    
    // بررسی وجود فایل
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'فایل ترجمه یافت نشد'
      });
    }

    // حذف فایل
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'فایل ترجمه با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('خطا در حذف فایل ترجمه:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف فایل ترجمه',
      error: error.message
    });
  }
};

// کپی فایل‌های پیش‌فرض
export const initializeDefaultTranslations = async () => {
  try {
    await ensureTranslationsDir();
    
    const defaultFiles = ['fa.json', 'en.json'];
    
    for (const fileName of defaultFiles) {
      const filePath = path.join(TRANSLATIONS_DIR, fileName);
      
      try {
        await fs.access(filePath);
        // فایل وجود دارد
      } catch {
        // فایل وجود ندارد، ایجاد می‌کنیم
        const sourcePath = path.join(__dirname, `../../frontend/src/locales/${fileName}`);
        
        try {
          const content = await fs.readFile(sourcePath, 'utf8');
          await fs.writeFile(filePath, content, 'utf8');
          console.log(`فایل ${fileName} کپی شد`);
        } catch (error) {
          console.error(`خطا در کپی فایل ${fileName}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('خطا در مقداردهی اولیه فایل‌های ترجمه:', error);
  }
};
