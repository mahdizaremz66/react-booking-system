import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { Instagram as InstagramIcon, Telegram as TelegramIcon, WhatsApp as WhatsAppIcon, Article as NewsIcon, Gavel as RuleIcon, Info as AboutIcon, ContactSupport as ContactIcon, Payment as PaymentIcon, TrackChanges as TrackIcon, LocationOn as LocationIcon, Phone as PhoneIcon, PhoneAndroid as MobileIcon, Email as EmailIcon } from '@mui/icons-material';
import { Box, Typography, Grid, Link, Container } from '@mui/material';

export default function Footer({ forceMobile = false }) {
  const { t } = useTranslation();
  const { currentLanguage, direction, theme, getCompanyConfig, screenSize } = useAppTheme();

  // تنظیم background footer با استفاده از تم
  useEffect(() => {
    const updateFooterGradient = () => {
      const desktop = document.getElementById('main-footer');
      const mobile = document.querySelector('.footer-mobile');
      const tablet = document.querySelector('.footer-tablet');
      const gradient = theme.palette.components.gradients.footer;

      if (desktop) desktop.style.background = gradient;
      if (mobile) mobile.style.background = gradient;
      if (tablet) tablet.style.background = gradient;
    };

    updateFooterGradient();
    const timer = setTimeout(updateFooterGradient, 100);
    return () => clearTimeout(timer);
  }, [theme.palette.components.gradients.footer, direction, screenSize]);

  // در موبایل کوچک یا حالت forceMobile
  if (screenSize === 'xs') {
    return (
      <Box
        sx={{
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          padding: { xs: 1, sm: 1.5 },
          backgroundColor: theme.palette.components.gradients.footer,
          color: theme.palette.neutral.white,
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${theme.palette.transparent.white}`,
          borderBottom: `1px solid ${theme.palette.transparent.white}`,
          boxShadow: `0 -2px 8px ${theme.palette.shadow.medium}, 0 2px 8px ${theme.palette.shadow.medium}`,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="md">
          {/* محتوای فوتر موبایل */}
          <Typography variant="body2" sx={{ color: theme.palette.neutral.darkGray }}>
            {getCompanyConfig(currentLanguage).name} © {new Date().getFullYear()}
          </Typography>
          {/* خط جداکننده */}
          <Box sx={{
            borderTop: `1px solid ${theme.palette.neutral.gray}`,
            marginTop: 1,
            paddingTop: 1,
          }} />

          {/* متن کپی‌رایت */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingBottom: 0,
          }}>
            <Typography sx={{
              color: theme.palette.neutral.darkGray,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {t('company.copyrightText')}
              <Link
                href="https://sabassg.ir"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                {t('company.copyrightLink')}
              </Link>
              {t('company.copyrightEnd')}
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // در موبایل متوسط یا breakpoint موبایل
  if (screenSize === 'sm' || screenSize === 'md' || forceMobile) {
    return (
      <Box
        sx={{
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          padding: { xs: 1, sm: 1 },
          backgroundColor: theme.palette.components.gradients.footer,
          color: theme.palette.neutral.white,
          fontFamily: theme.typography.fontFamily,
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${theme.palette.transparent.white}`,
          borderBottom: `1px solid ${theme.palette.transparent.white}`,
          boxShadow: `0 -2px 8px ${theme.palette.shadow.medium}, 0 2px 8px ${theme.palette.shadow.medium}`,
          zIndex: 1000,
        }}
      >
        {/* محتوای فوتر تبلت */}
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: theme.palette.neutral.darkGray }}>
              {getCompanyConfig(currentLanguage).name} © {new Date().getFullYear()}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Link
                href={getCompanyConfig(currentLanguage).socialMedia.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                title={getCompanyConfig(currentLanguage).socialMedia.instagram.label[currentLanguage]}
              >
                <InstagramIcon />
              </Link>
              <Link
                href={getCompanyConfig(currentLanguage).socialMedia.telegram.url}
                target="_blank"
                rel="noopener noreferrer"
                title={getCompanyConfig(currentLanguage).socialMedia.telegram.label[currentLanguage]}
              >
                <TelegramIcon />
              </Link>
              <Link
                href={getCompanyConfig(currentLanguage).socialMedia.twitter.url}
                target="_blank"
                rel="noopener noreferrer"
                title={getCompanyConfig(currentLanguage).socialMedia.twitter.label[currentLanguage]}
              >
                <WhatsAppIcon />
              </Link>
            </Box>
          </Box>
          {/* خط جداکننده */}
          <Box sx={{
            borderTop: `1px solid ${theme.palette.neutral.gray}`,
            marginTop: 1,
            paddingTop: 1,
          }} />

          {/* متن کپی‌رایت */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingBottom: 0,
          }}>
            <Typography sx={{
              color: theme.palette.neutral.darkGray,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {t('company.copyrightText')}
              <Link
                href="https://sabassg.ir"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                {t('company.copyrightLink')}
              </Link>
              {t('company.copyrightEnd')}
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="footer"
      id="main-footer"
      sx={{
        py: 1.5,
        px: 1,
        backgroundColor: theme.palette.components.gradients.footer,
        borderTop: `1px solid ${theme.palette.transparent.white}`,
        borderBottom: `1px solid ${theme.palette.transparent.white}`,
        boxShadow: `0 -2px 8px ${theme.palette.shadow.medium}, 0 2px 8px ${theme.palette.shadow.medium}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* ستون اول: اطلاعات شرکت */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{
              color: 'inherit',
              mb: 2,
            }}>
              {getCompanyConfig(currentLanguage).name}
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}>
              {/* سطر اول: آدرس */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <LocationIcon sx={{ color: theme.palette.neutral.darkGray }} />
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Typography sx={{ color: 'inherit' }}>
                    {t('common.address')}
                  </Typography>
                  <Typography sx={{ color: 'inherit' }}>
                    :
                  </Typography>
                  <Typography sx={{ color: theme.palette.neutral.darkGray }}>
                    {getCompanyConfig(currentLanguage).address}
                  </Typography>
                </Box>
              </Box>

              {/* سطر دوم: تلفن و موبایل */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <PhoneIcon sx={{ color: theme.palette.neutral.darkGray }} />
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    <Typography sx={{ color: 'inherit' }}>
                      {t('common.phone')}
                    </Typography>
                    <Typography sx={{ color: 'inherit' }}>
                      :
                    </Typography>
                    <Typography sx={{ color: theme.palette.neutral.darkGray }}>
                      {getCompanyConfig(currentLanguage).phone}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <MobileIcon sx={{ color: theme.palette.neutral.darkGray }} />
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    <Typography sx={{ color: 'inherit' }}>
                      {t('common.mobile')}
                    </Typography>
                    <Typography sx={{ color: 'inherit' }}>
                      :
                    </Typography>
                    <Typography sx={{ color: theme.palette.neutral.darkGray }}>
                      {getCompanyConfig(currentLanguage).mobile}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* سطر سوم: ایمیل */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <EmailIcon sx={{ color: theme.palette.neutral.darkGray }} />
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Typography sx={{ color: 'inherit' }}>
                    {t('common.email')}
                  </Typography>
                  <Typography sx={{ color: 'inherit' }}>
                    :
                  </Typography>
                  <Typography sx={{ color: theme.palette.neutral.darkGray }}>
                    {getCompanyConfig(currentLanguage).email}
                  </Typography>
                </Box>
              </Box>

              {/* سطر چهارم: شبکه‌های اجتماعی */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 1,
              }}>
                <Link
                  href={getCompanyConfig(currentLanguage).socialMedia.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={getCompanyConfig(currentLanguage).socialMedia.instagram.label[currentLanguage]}
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href={getCompanyConfig(currentLanguage).socialMedia.telegram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={getCompanyConfig(currentLanguage).socialMedia.telegram.label[currentLanguage]}
                >
                  <TelegramIcon />
                </Link>
                <Link
                  href={getCompanyConfig(currentLanguage).socialMedia.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="MuiLink-iconLink"
                  title={getCompanyConfig(currentLanguage).socialMedia.twitter.label[currentLanguage]}
                >
                  <WhatsAppIcon />
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* ستون دوم: دسترسی آسان */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{
              color: 'inherit',
              mb: 2,
            }}>
              {t('navigation.quickAccess')}
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              alignItems: 'flex-start',
            }}>
              <Link href="#" sx={{
                color: theme.palette.neutral.darkGray,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: direction === 'rtl' ? 'translateX(-2px)' : 'translateX(2px)'
                },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'all 0.2s ease',
              }}>
                <NewsIcon />
                {t('navigation.news')}
              </Link>
              <Link href="#" sx={{
                color: theme.palette.neutral.darkGray,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: direction === 'rtl' ? 'translateX(-2px)' : 'translateX(2px)'
                },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'all 0.2s ease',
              }}>
                <RuleIcon />
                {t('navigation.rules')}
              </Link>
              <Link href="#" sx={{
                color: theme.palette.neutral.darkGray,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: direction === 'rtl' ? 'translateX(-2px)' : 'translateX(2px)'
                },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'all 0.2s ease',
              }}>
                <AboutIcon />
                {t('navigation.about')}
              </Link>
              <Link href="#" sx={{
                color: theme.palette.neutral.darkGray,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: direction === 'rtl' ? 'translateX(-2px)' : 'translateX(2px)'
                },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'all 0.2s ease',
              }}>
                <ContactIcon />
                {t('navigation.contact')}
              </Link>
              <Link href="#" sx={{
                color: theme.palette.neutral.darkGray,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: direction === 'rtl' ? 'translateX(-2px)' : 'translateX(2px)'
                },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'all 0.2s ease',
              }}>
                <PaymentIcon />
                {t('company.onlinePayment')}
              </Link>
              <Link href="#" sx={{
                color: theme.palette.neutral.darkGray,
                textDecoration: 'none',
                '&:hover': {
                  color: theme.palette.primary.main,
                  transform: direction === 'rtl' ? 'translateX(-2px)' : 'translateX(2px)'
                },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                transition: 'all 0.2s ease',
              }}>
                <TrackIcon />
                {t('company.trackingPurchase')}
              </Link>
            </Box>
          </Grid>

          {/* ستون سوم: مجوزها */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography sx={{
              color: 'inherit',
              mb: 2,
            }}>
              {t('company.licenses')}
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: 1,
            }}>
              {/* نماد اعتماد الکترونیک */}
              <Link
                href="https://trustseal.enamad.ir/?id=123456&Code=abcdef"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  p: 1,
                  backgroundColor: theme.palette.neutral.white,
                  border: `1px solid ${theme.palette.neutral.gray}`,
                  borderRadius: theme.shape.borderRadius,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 4px 12px ${theme.palette.transparent.overlay}`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Box
                  component="img"
                  src="/src/assets/certificates/enamad.png"
                  alt={t('company.electronicTrust')}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'contain',
                  }}
                />
              </Link>

              {/* کسب و کار اینترنتی */}
              <Link
                href="https://www.kasbokar.com/verify/123456"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  p: 1,
                  backgroundColor: theme.palette.neutral.white,
                  border: `1px solid ${theme.palette.neutral.gray}`,
                  borderRadius: theme.shape.borderRadius,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 4px 12px ${theme.palette.transparent.overlay}`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Box
                  component="img"
                  src="/src/assets/certificates/certificate1.png"
                  alt={t('company.internetBusiness')}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'contain',
                  }}
                />
              </Link>

              {/* ایران تکنولوژی */}
              <Link
                href="https://www.irantechnology.ir/verify/123456"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  p: 1,
                  backgroundColor: theme.palette.neutral.white,
                  border: `1px solid ${theme.palette.neutral.gray}`,
                  borderRadius: theme.shape.borderRadius,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 4px 12px ${theme.palette.transparent.overlay}`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Box
                  component="img"
                  src="/src/assets/certificates/certificate2.png"
                  alt={t('company.iranTechnology')}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'contain',
                  }}
                />
              </Link>

              {/* طراحی سایت گردشگری */}
              <Link
                href="https://www.tourism.ir/verify/123456"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  p: 1,
                  backgroundColor: theme.palette.neutral.white,
                  border: `1px solid ${theme.palette.neutral.gray}`,
                  borderRadius: theme.shape.borderRadius,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 4px 12px ${theme.palette.transparent.overlay}`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Box
                  component="img"
                  src="/src/assets/certificates/certificate3.png"
                  alt={t('company.tourismDesign')}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'contain',
                  }}
                />
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* خط جداکننده */}
        <Box sx={{
          borderTop: `1px solid ${theme.palette.neutral.gray}`,
          marginTop: 1,
          paddingTop: 1,
        }} />

        {/* متن کپی‌رایت */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          paddingBottom: 0,
        }}>
          <Typography sx={{
            color: theme.palette.neutral.darkGray,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {t('company.copyrightText')}
            <Link
              href="https://sabassg.ir"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              {t('company.copyrightLink')}
            </Link>
            {t('company.copyrightEnd')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
