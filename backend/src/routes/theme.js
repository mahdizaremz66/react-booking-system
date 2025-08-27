import express from 'express';
const router = express.Router();
import {
  getThemeSettings,
  saveThemeSettings,
  getThemeTemplates,
  createThemeTemplate,
  deleteThemeTemplate,
  applyThemeTemplate,
  getLanguages,
  getLinks
} from '../controllers/themeController.js';
import { authenticate } from '../middlewares/auth.js';

// Routes برای تنظیمات تم
router.get('/settings', getThemeSettings);
router.post('/settings', authenticate, saveThemeSettings);

// Routes برای تمپلیت‌ها
router.get('/templates', getThemeTemplates);
router.post('/templates', authenticate, createThemeTemplate);
router.delete('/templates/:id', authenticate, deleteThemeTemplate);
router.post('/templates/:id/apply', authenticate, applyThemeTemplate);

// Routes برای زبان‌ها
router.get('/languages', getLanguages);

// Routes برای لینک‌ها (شبکه‌های اجتماعی و مجوزها)
router.get('/links', getLinks);

export default router;
