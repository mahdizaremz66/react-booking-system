import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme/AppThemeProvider';
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Grid,
    Alert,
    Snackbar,
    IconButton,
    Switch,
    Tabs,
    Tab,
    Card,
    CardContent
} from '@mui/material';
import {
    Save as SaveIcon,
    Business as BusinessIcon,
    Settings as SettingsIcon,
    Share as ShareIcon,
    Language as LanguageIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Style as StyleIcon,
    TextFields as TypographyIcon,
    ColorLens as ColorLensIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { defaultThemeConfig } from '../config/themeConfig';
import {
    loadThemeSettings,
    saveThemeSettings,
    convertFormDataToThemeConfig,
    convertThemeConfigToFormData,
    getAvailableFonts,
    loadThemeTemplates,
    applyTemplate,
    createCustomTemplate,
    deleteCustomTemplate
} from '../services/themeSettingsService';

// Tab Panel Component
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`theme-tabpanel-${index}`}
            aria-labelledby={`theme-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function ThemeSettings() {
    const { t } = useTranslation();
    const { theme, updateUserSettings } = useAppTheme();

    const [settings, setSettings] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [languages, setLanguages] = useState([]);
    const [siteCompanyInfo, setSiteCompanyInfo] = useState([]);
    const [socialNetworks, setSocialNetworks] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [templates, setTemplates] = useState({ builtin: [], custom: [], all: [] });
    const [activeTab, setActiveTab] = useState(0);

    // Initialize settings from file
    useEffect(() => {
        const initializeSettings = async () => {
            try {
                const loadedSettings = await loadThemeSettings();
                const formData = convertThemeConfigToFormData(loadedSettings);
                setSettings(formData);

                // تنظیم زبان‌ها
                setLanguages(Object.keys(loadedSettings.languages).map(code => ({
                    code,
                    ...loadedSettings.languages[code]
                })));

                // تنظیم اطلاعات سایت و شرکت
                setSiteCompanyInfo([
                    { key: 'siteName', label: 'نام سایت', value: loadedSettings.site?.name || '' },
                    { key: 'siteDescription', label: 'توضیحات سایت', value: loadedSettings.site?.description || '' },
                    { key: 'siteLogo', label: 'لوگو سایت', value: loadedSettings.site?.logo || '' },
                    { key: 'companyName', label: 'نام شرکت', value: loadedSettings.company?.name || '' },
                    { key: 'companyAddress', label: 'آدرس شرکت', value: loadedSettings.company?.address || '' },
                    { key: 'companyPhone', label: 'تلفن شرکت', value: loadedSettings.company?.phone || '' },
                    { key: 'companyEmail', label: 'ایمیل شرکت', value: loadedSettings.company?.email || '' }
                ]);

                // تنظیم شبکه‌های اجتماعی و مجوزها
                setSocialNetworks(loadedSettings.socialMedia || []);
                setLicenses(loadedSettings.licenses || []);

                // بارگذاری قالب‌ها
                const templatesData = await loadThemeTemplates();
                setTemplates(templatesData);
            } catch (error) {
                console.error('خطا در بارگذاری تنظیمات:', error);
                setSnackbar({
                    open: true,
                    message: 'خطا در بارگذاری تنظیمات',
                    severity: 'error'
                });
            }
        };

        initializeSettings();
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSiteCompanyChange = (key, value) => {
        setSiteCompanyInfo(prev => 
            prev.map(item => 
                item.key === key ? { ...item, value } : item
            )
        );
    };

    const handleSocialNetworkChange = (index, field, value) => {
        setSocialNetworks(prev => 
            prev.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const handleLicenseChange = (index, field, value) => {
        setLicenses(prev => 
            prev.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addSocialNetwork = () => {
        setSocialNetworks(prev => [...prev, { name: '', url: '', icon: '' }]);
    };

    const removeSocialNetwork = (index) => {
        setSocialNetworks(prev => prev.filter((_, i) => i !== index));
    };

    const addLicense = () => {
        setLicenses(prev => [...prev, { name: '', url: '', icon: '' }]);
    };

    const removeLicense = (index) => {
        setLicenses(prev => prev.filter((_, i) => i !== index));
    };

    const addLanguage = () => {
        const newLang = {
            code: '',
            name: '',
            nativeName: '',
            direction: 'ltr',
            isActive: true,
            isDefault: false
        };
        setLanguages(prev => [...prev, newLang]);
    };

    const removeLanguage = (index) => {
        if (languages.length <= 2) {
            setSnackbar({
                open: true,
                message: 'حداقل دو زبان باید وجود داشته باشد',
                severity: 'warning'
            });
            return;
        }
        setLanguages(prev => prev.filter((_, i) => i !== index));
    };

    const handleLanguageChange = (index, field, value) => {
        setLanguages(prev => 
            prev.map((lang, i) => 
                i === index ? { ...lang, [field]: value } : lang
            )
        );
    };

    const handleApplyTemplate = async (templateId) => {
        try {
            const result = await applyTemplate(templateId);
            if (result.success) {
                const loadedSettings = await loadThemeSettings();
                const formData = convertThemeConfigToFormData(loadedSettings);
                setSettings(formData);
                
                setSnackbar({
                    open: true,
                    message: 'قالب با موفقیت اعمال شد',
                    severity: 'success'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: result.message || 'خطا در اعمال قالب',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('خطا در اعمال قالب:', error);
            setSnackbar({
                open: true,
                message: 'خطا در اعمال قالب',
                severity: 'error'
            });
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        try {
            const result = await deleteCustomTemplate(templateId);
            if (result.success) {
                setSnackbar({
                    open: true,
                    message: 'قالب با موفقیت حذف شد',
                    severity: 'success'
                });
                
                const templatesData = await loadThemeTemplates();
                setTemplates(templatesData);
            } else {
                setSnackbar({
                    open: true,
                    message: result.message || 'خطا در حذف قالب',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('خطا در حذف قالب:', error);
            setSnackbar({
                open: true,
                message: 'خطا در حذف قالب',
                severity: 'error'
            });
        }
    };

    const handleSaveTab = async (tabIndex) => {
        try {
            let dataToSave = {};
            
            switch (tabIndex) {
                case 0: // تنظیمات زبان
                    dataToSave = {
                        ...settings,
                        languages: languages.reduce((acc, lang) => {
                            acc[lang.code] = lang;
                            return acc;
                        }, {})
                    };
                    break;
                    
                case 1: // اطلاعات سایت و شرکت
                    const siteData = {};
                    const companyData = {};
                    siteCompanyInfo.forEach(item => {
                        if (item.key.startsWith('site')) {
                            siteData[item.key.replace('site', '').toLowerCase()] = item.value;
                        } else if (item.key.startsWith('company')) {
                            companyData[item.key.replace('company', '').toLowerCase()] = item.value;
                        }
                    });
                    dataToSave = {
                        ...settings,
                        site: siteData,
                        company: companyData
                    };
                    break;
                    
                case 2: // شبکه‌های اجتماعی و مجوزها
                    dataToSave = {
                        ...settings,
                        socialMedia: socialNetworks,
                        licenses: licenses
                    };
                    break;
                    
                case 3: // تنظیمات تایپوگرافی
                    dataToSave = {
                        ...settings,
                        typography: {
                            fontFamily: settings.fontFamily,
                            fontSize: settings.fontSize,
                            fontWeight: settings.fontWeight,
                            lineHeight: settings.lineHeight
                        }
                    };
                    break;
                    
                case 4: // تنظیمات کامپوننت‌ها
                    dataToSave = {
                        ...settings,
                        components: {
                            borderRadius: settings.borderRadius,
                            spacing: settings.spacing,
                            shadows: settings.shadows
                        }
                    };
                    break;
                    
                case 5: // تنظیمات قالب
                    dataToSave = settings;
                    break;
            }

            const result = await saveThemeSettings(dataToSave);
            if (result.success) {
                setSnackbar({
                    open: true,
                    message: 'تنظیمات با موفقیت ذخیره شد',
                    severity: 'success'
                });
                
                // اگر قالب ذخیره شد، قالب "دلخواه کاربر" ایجاد کن
                if (tabIndex === 5) {
                    try {
                        const currentConfig = convertFormDataToThemeConfig(dataToSave);
                        await createCustomTemplate({
                            name: 'دلخواه کاربر',
                            description: 'تنظیمات سفارشی کاربر',
                            settings: currentConfig
                        });
                        
                        const templatesData = await loadThemeTemplates();
                        setTemplates(templatesData);
                    } catch (error) {
                        console.error('خطا در ایجاد قالب دلخواه کاربر:', error);
                    }
                }
            } else {
                setSnackbar({
                    open: true,
                    message: result.message || 'خطا در ذخیره تنظیمات',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('خطا در ذخیره تنظیمات:', error);
            setSnackbar({
                open: true,
                message: 'خطا در ذخیره تنظیمات',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Box sx={{ 
                backgroundColor: '#ffffff', 
                borderRadius: 2, 
                p: 3, 
                boxShadow: 1,
                maxWidth: '100%'
            }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <SettingsIcon color="primary" />
                    <Typography variant="h4" color="primary">تنظیمات سایت</Typography>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="تنظیمات سایت">
                        <Tab label="تنظیمات زبان" icon={<LanguageIcon />} iconPosition="start" />
                        <Tab label="اطلاعات سایت و شرکت" icon={<BusinessIcon />} iconPosition="start" />
                        <Tab label="شبکه‌های اجتماعی و مجوزها" icon={<ShareIcon />} iconPosition="start" />
                        <Tab label="تنظیمات تایپوگرافی" icon={<TypographyIcon />} iconPosition="start" />
                        <Tab label="تنظیمات کامپوننت‌ها" icon={<ColorLensIcon />} iconPosition="start" />
                        <Tab label="تنظیمات قالب" icon={<StyleIcon />} iconPosition="start" />
                    </Tabs>
                </Box>

                {/* Tab 0: تنظیمات زبان */}
                <TabPanel value={activeTab} index={0}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <LanguageIcon color="primary" />
                                <Typography variant="h6" color="primary">تنظیمات زبان‌ها</Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={addLanguage}
                                    sx={{ ml: 'auto' }}
                                >
                                    افزودن زبان
                                </Button>
                            </Box>

                            {languages.map((lang, index) => (
                                <Box key={index} sx={{
                                    mb: 3,
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    backgroundColor: '#fafafa',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Typography variant="h6" color="primary">{lang.name || `زبان ${index + 1}`}</Typography>
                                        <Switch
                                            checked={lang.isActive || false}
                                            onChange={(e) => handleLanguageChange(index, 'isActive', e.target.checked)}
                                            color="primary"
                                        />
                                        <Typography variant="body2">فعال</Typography>
                                        <Switch
                                            checked={lang.isDefault || false}
                                            onChange={(e) => handleLanguageChange(index, 'isDefault', e.target.checked)}
                                            color="secondary"
                                        />
                                        <Typography variant="body2">پیش‌فرض</Typography>
                                        {languages.length > 2 && (
                                            <IconButton
                                                color="error"
                                                onClick={() => removeLanguage(index)}
                                                sx={{ ml: 'auto' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="کد زبان"
                                                value={lang.code || ''}
                                                onChange={(e) => handleLanguageChange(index, 'code', e.target.value)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="نام زبان"
                                                value={lang.name || ''}
                                                onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="نام بومی"
                                                value={lang.nativeName || ''}
                                                onChange={(e) => handleLanguageChange(index, 'nativeName', e.target.value)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>جهت</InputLabel>
                                                <Select
                                                    value={lang.direction || 'ltr'}
                                                    onChange={(e) => handleLanguageChange(index, 'direction', e.target.value)}
                                                    label="جهت"
                                                >
                                                    <MenuItem value="ltr">چپ به راست</MenuItem>
                                                    <MenuItem value="rtl">راست به چپ</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSaveTab(0)}
                                >
                                    ذخیره تغییرات
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* Tab 1: اطلاعات سایت و شرکت */}
                <TabPanel value={activeTab} index={1}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <BusinessIcon color="primary" />
                                <Typography variant="h6" color="primary">اطلاعات سایت و شرکت</Typography>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid xs={12}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>اطلاعات سایت</Typography>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="نام سایت"
                                        value={siteCompanyInfo.find(item => item.key === 'siteName')?.value || ''}
                                        onChange={(e) => handleSiteCompanyChange('siteName', e.target.value)}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="لوگو سایت"
                                        value={siteCompanyInfo.find(item => item.key === 'siteLogo')?.value || ''}
                                        onChange={(e) => handleSiteCompanyChange('siteLogo', e.target.value)}
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        fullWidth
                                        label="توضیحات سایت"
                                        value={siteCompanyInfo.find(item => item.key === 'siteDescription')?.value || ''}
                                        onChange={(e) => handleSiteCompanyChange('siteDescription', e.target.value)}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>

                                <Grid xs={12}>
                                    <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>اطلاعات شرکت</Typography>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="نام شرکت"
                                        value={siteCompanyInfo.find(item => item.key === 'companyName')?.value || ''}
                                        onChange={(e) => handleSiteCompanyChange('companyName', e.target.value)}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="تلفن شرکت"
                                        value={siteCompanyInfo.find(item => item.key === 'companyPhone')?.value || ''}
                                        onChange={(e) => handleSiteCompanyChange('companyPhone', e.target.value)}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="ایمیل شرکت"
                                        value={siteCompanyInfo.find(item => item.key === 'companyEmail')?.value || ''}
                                        onChange={(e) => handleSiteCompanyChange('companyEmail', e.target.value)}
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <TextField
                                        fullWidth
                                        label="آدرس شرکت"
                                        value={siteCompanyInfo.find(item => item.key === 'companyAddress')?.value || ''}
                                        onChange={(e) => handleSiteCompanyChange('companyAddress', e.target.value)}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSaveTab(1)}
                                >
                                    ذخیره تغییرات
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* Tab 2: شبکه‌های اجتماعی و مجوزها */}
                <TabPanel value={activeTab} index={2}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <ShareIcon color="primary" />
                                <Typography variant="h6" color="primary">شبکه‌های اجتماعی و مجوزها</Typography>
                            </Box>

                            {/* شبکه‌های اجتماعی */}
                            <Typography variant="h6" sx={{ mb: 2 }}>شبکه‌های اجتماعی</Typography>
                            {socialNetworks.map((network, index) => (
                                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="نام شبکه"
                                                value={network.name || ''}
                                                onChange={(e) => handleSocialNetworkChange(index, 'name', e.target.value)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="لینک"
                                                value={network.url || ''}
                                                onChange={(e) => handleSocialNetworkChange(index, 'url', e.target.value)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={3}>
                                            <TextField
                                                fullWidth
                                                label="آیکون"
                                                value={network.icon || ''}
                                                onChange={(e) => handleSocialNetworkChange(index, 'icon', e.target.value)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={1}>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeSocialNetwork(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={addSocialNetwork}
                                sx={{ mb: 3 }}
                            >
                                افزودن شبکه اجتماعی
                            </Button>

                            {/* مجوزها */}
                            <Typography variant="h6" sx={{ mb: 2 }}>مجوزها</Typography>
                            {licenses.map((license, index) => (
                                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="نام مجوز"
                                                value={license.name || ''}
                                                onChange={(e) => handleLicenseChange(index, 'name', e.target.value)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                label="لینک"
                                                value={license.url || ''}
                                                onChange={(e) => handleLicenseChange(index, 'url', e.target.value)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={3}>
                                            <TextField
                                                fullWidth
                                                label="آیکون"
                                                value={license.icon || ''}
                                                onChange={(e) => handleLicenseChange(index, 'icon', e.target.value)}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid xs={12} sm={1}>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeLicense(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={addLicense}
                                sx={{ mb: 3 }}
                            >
                                افزودن مجوز
                            </Button>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSaveTab(2)}
                                >
                                    ذخیره تغییرات
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* Tab 3: تنظیمات تایپوگرافی */}
                <TabPanel value={activeTab} index={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <TypographyIcon color="primary" />
                                <Typography variant="h6" color="primary">تنظیمات تایپوگرافی</Typography>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>فونت اصلی</InputLabel>
                                        <Select
                                            value={settings.fontFamily || ''}
                                            onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                                            label="فونت اصلی"
                                        >
                                            {getAvailableFonts().map(font => (
                                                <MenuItem key={font.family} value={font.family}>
                                                    {font.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="اندازه فونت پایه"
                                        type="number"
                                        value={settings.fontSize || ''}
                                        onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                                        InputProps={{ inputProps: { min: 12, max: 24 } }}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="وزن فونت"
                                        type="number"
                                        value={settings.fontWeight || ''}
                                        onChange={(e) => handleSettingChange('fontWeight', e.target.value)}
                                        InputProps={{ inputProps: { min: 100, max: 900, step: 100 } }}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="ارتفاع خط"
                                        type="number"
                                        value={settings.lineHeight || ''}
                                        onChange={(e) => handleSettingChange('lineHeight', e.target.value)}
                                        InputProps={{ inputProps: { min: 1, max: 3, step: 0.1 } }}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSaveTab(3)}
                                >
                                    ذخیره تغییرات
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* Tab 4: تنظیمات کامپوننت‌ها */}
                <TabPanel value={activeTab} index={4}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <ColorLensIcon color="primary" />
                                <Typography variant="h6" color="primary">تنظیمات کامپوننت‌ها</Typography>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="شعاع گوشه"
                                        type="number"
                                        value={settings.borderRadius || ''}
                                        onChange={(e) => handleSettingChange('borderRadius', e.target.value)}
                                        InputProps={{ inputProps: { min: 0, max: 20 } }}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="فاصله‌گذاری"
                                        type="number"
                                        value={settings.spacing || ''}
                                        onChange={(e) => handleSettingChange('spacing', e.target.value)}
                                        InputProps={{ inputProps: { min: 4, max: 32 } }}
                                    />
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="سایه‌ها"
                                        value={settings.shadows || ''}
                                        onChange={(e) => handleSettingChange('shadows', e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSaveTab(4)}
                                >
                                    ذخیره تغییرات
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* Tab 5: تنظیمات قالب */}
                <TabPanel value={activeTab} index={5}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <StyleIcon color="primary" />
                                <Typography variant="h6" color="primary">تنظیمات قالب</Typography>
                            </Box>

                            {/* قالب‌های آماده */}
                            <Typography variant="h6" sx={{ mb: 2 }}>قالب‌های آماده</Typography>
                            
                            {/* قالب‌های داخلی */}
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>قالب‌های داخلی</Typography>
                            <Grid container spacing={3} sx={{ mb: 4, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                                {templates.builtin.map((template) => (
                                    <Grid xs={12} sm={6} md={4} key={template.id} sx={{ display: 'flex', flex: '1 1 auto', minWidth: 0 }}>
                                        <Box sx={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 2,
                                            p: 2,
                                            backgroundColor: '#ffffff',
                                            height: 280,
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: 2,
                                                transform: 'translateY(-2px)',
                                                transition: 'all 0.2s ease-in-out'
                                            }
                                        }}>
                                            {/* پیش‌نمایش رنگ‌ها */}
                                            <Box sx={{
                                                height: 80,
                                                borderRadius: 1,
                                                mb: 2,
                                                background: `linear-gradient(135deg, ${template.settings?.colors?.primary?.main || '#1976d2'} 0%, ${template.settings?.colors?.secondary?.main || '#dc004e'} 100%)`,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                flexShrink: 0
                                            }}>
                                                <Box sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    backgroundColor: template.settings?.colors?.background?.paper || '#ffffff',
                                                    border: '2px solid rgba(255,255,255,0.8)'
                                                }} />
                                                <Box sx={{
                                                    position: 'absolute',
                                                    bottom: 8,
                                                    left: 8,
                                                    width: 40,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: template.settings?.colors?.neutral?.gray || '#757575'
                                                }} />
                                            </Box>

                                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', flexShrink: 0 }}>{template.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                mb: 2,
                                                flex: 1,
                                                minHeight: 60,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                lineHeight: 1.4
                                            }}>
                                                {template.description}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                fullWidth
                                                startIcon={<DownloadIcon />}
                                                onClick={() => handleApplyTemplate(template.id)}
                                                sx={{ flexShrink: 0 }}
                                            >
                                                اعمال قالب
                                            </Button>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* قالب‌های سفارشی */}
                            {templates.custom.length > 0 && (
                                <>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>قالب‌های سفارشی</Typography>
                                    <Grid container spacing={3} sx={{ mb: 4, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                                        {templates.custom.map((template) => (
                                            <Grid xs={12} sm={6} md={4} key={template.id} sx={{ display: 'flex', flex: '1 1 auto', minWidth: 0 }}>
                                                <Box sx={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 2,
                                                    p: 2,
                                                    backgroundColor: '#ffffff',
                                                    height: 280,
                                                    width: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        boxShadow: 2,
                                                        transform: 'translateY(-2px)',
                                                        transition: 'all 0.2s ease-in-out'
                                                    }
                                                }}>
                                                    {/* پیش‌نمایش رنگ‌ها */}
                                                    <Box sx={{
                                                        height: 80,
                                                        borderRadius: 1,
                                                        mb: 2,
                                                        background: `linear-gradient(135deg, ${template.settings?.colors?.primary?.main || '#1976d2'} 0%, ${template.settings?.colors?.secondary?.main || '#dc004e'} 100%)`,
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        flexShrink: 0
                                                    }}>
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            backgroundColor: template.settings?.colors?.background?.paper || '#ffffff',
                                                            border: '2px solid rgba(255,255,255,0.8)'
                                                        }} />
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            bottom: 8,
                                                            left: 8,
                                                            width: 40,
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: template.settings?.colors?.neutral?.gray || '#757575'
                                                        }} />
                                                    </Box>

                                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', flexShrink: 0 }}>{template.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        mb: 2,
                                                        flex: 1,
                                                        minHeight: 60,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        lineHeight: 1.4
                                                    }}>
                                                        {template.description}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            startIcon={<DownloadIcon />}
                                                            onClick={() => handleApplyTemplate(template.id)}
                                                            sx={{ flex: 1 }}
                                                        >
                                                            اعمال
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            color="error"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => handleDeleteTemplate(template.id)}
                                                        >
                                                            حذف
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={() => handleSaveTab(5)}
                                >
                                    ذخیره تغییرات
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </TabPanel>
            </Box>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
