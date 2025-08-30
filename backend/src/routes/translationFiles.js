import express from 'express';
const router = express.Router();
import {
  getTranslationFiles,
  createTranslationFile,
  getTranslationFileContent,
  updateTranslationFile,
  deleteTranslationFile
} from '../controllers/translationFileController.js';
import { authenticate } from '../middlewares/auth.js';

// Routes برای مدیریت فایل‌های ترجمه

// دریافت لیست فایل‌های ترجمه (عمومی)
router.get('/', getTranslationFiles);

// ایجاد فایل ترجمه جدید (نیاز به احراز هویت)
router.post('/', authenticate, createTranslationFile);

// دریافت محتوای فایل ترجمه (عمومی)
router.get('/:fileName/content', getTranslationFileContent);

// به‌روزرسانی فایل ترجمه (نیاز به احراز هویت)
router.put('/:fileName', authenticate, updateTranslationFile);

// حذف فایل ترجمه (نیاز به احراز هویت)
router.delete('/:fileName', authenticate, deleteTranslationFile);

export default router;
