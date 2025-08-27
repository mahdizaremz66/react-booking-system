import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { TextField, Button, Alert, Paper, Box, Typography, CircularProgress, Avatar, InputAdornment, IconButton, Link as MuiLink, useTheme } from "@mui/material";
import { PersonAdd as PersonAddIcon, Visibility, VisibilityOff, FontDownload, LightMode, DarkMode, Language } from '@mui/icons-material';
import { registerApi } from "../api/auth";
import { AuthContext } from "../contexts/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    usrUsername: "",
    usrPassword: "",
    confirmPassword: "",
    perName: "",
    perLastName: "",
    usrAvatar: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { direction, changeFontScale, toggleTheme, toggleLanguage, currentLanguage } = useAppTheme();
  const theme = useTheme();
  const { t } = useTranslation();



  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // اعتبارسنجی
    if (formData.usrPassword !== formData.confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    if (formData.usrPassword.length < 6) {
      setError("رمز عبور باید حداقل 6 کاراکتر باشد");
      return;
    }

    setLoading(true);
    setError("");

    const res = await registerApi({
      usrUsername: formData.usrUsername,
      usrPassword: formData.usrPassword,
      perName: formData.perName,
      perLastName: formData.perLastName,
      usrAvatar: formData.usrAvatar || null
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.success && res.data) {
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } else {
      setError(getErrorMessage("registerError"));
    }
  };

  return (
    <Box className="register-page" sx={{
      height: 'calc(100vh - var(--header-height, 0px))',
      paddingTop: 'var(--header-height, 0px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto'
    }}>
      {/* تنظیمات فونت و دارک مود */}
      <Box sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        display: 'flex',
        gap: 1,
        zIndex: 1000
      }}>
        <IconButton
          onClick={changeFontScale}
        >
          <FontDownload />
        </IconButton>
        <IconButton
          onClick={toggleTheme}
        >
          {theme.palette.components.themeToggle.icon === 'LightMode' ? <LightMode /> : <DarkMode />}
        </IconButton>
        <IconButton
          onClick={toggleLanguage}
        >
          <Language />
          <Typography
            component="span"
            sx={{
              ml: 0.5
            }}
          >
            {currentLanguage === 'fa' ? 'EN' : 'FA'}
          </Typography>
        </IconButton>
      </Box>

      <Paper elevation={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{
            width: 80,
            height: 80,
            mb: 2,
            backgroundColor: theme.palette.secondary.main
          }}>
            <PersonAddIcon sx={{ color: theme.palette.neutral.white }} />
          </Avatar>
          <Typography variant="h6" align="center" color="secondary" mb={1} sx={{
            width: '100%',
            textAlign: 'center'
          }}>
            {t('auth.registerToSystem')}
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="perName"
            label="نام"
            variant="standard"
            fullWidth
            autoFocus
            value={formData.perName}
            onChange={handleChange}
            required
            slotProps={{
              input: {
                style: { fontSize: theme.typography.body1 }
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: theme.typography.body1,
                height: 40
              },
              '& .MuiInputLabel-root': {
                fontSize: theme.typography.body2
              }
            }}
          />
          <TextField
            name="perLastName"
            label="نام خانوادگی"
            variant="standard"
            fullWidth
            value={formData.perLastName}
            onChange={handleChange}
            required
            slotProps={{
              input: {
                style: { fontSize: theme.typography.body1 }
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: theme.typography.body1,
                height: 40
              },
              '& .MuiInputLabel-root': {
                fontSize: theme.typography.body2
              }
            }}
          />
          <TextField
            name="usrUsername"
            label="نام کاربری"
            variant="standard"
            fullWidth
            value={formData.usrUsername}
            onChange={handleChange}
            required
            slotProps={{
              input: {
                style: { fontSize: theme.typography.body1 }
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: theme.typography.body1,
                height: 40
              },
              '& .MuiInputLabel-root': {
                fontSize: theme.typography.body2
              }
            }}
          />
          <TextField
            name="usrPassword"
            label="رمز عبور"
            variant="standard"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formData.usrPassword}
            onChange={handleChange}
            required
            slotProps={{
              input: {
                style: { fontSize: theme.typography.body1 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'عدم نمایش رمز' : 'نمایش رمز'}
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={e => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: theme.typography.body1,
                height: 40
              },
              '& .MuiInputLabel-root': {
                fontSize: theme.typography.body2
              }
            }}
          />
          <TextField
            name="confirmPassword"
            label="تکرار رمز عبور"
            variant="standard"
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            slotProps={{
              input: {
                style: { fontSize: theme.typography.body1 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? 'عدم نمایش رمز' : 'نمایش رمز'}
                      onClick={() => setShowConfirmPassword((show) => !show)}
                      onMouseDown={e => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: theme.typography.body1,
                height: 40
              },
              '& .MuiInputLabel-root': {
                fontSize: theme.typography.body2
              }
            }}
          />
          <TextField
            name="usrAvatar"
            label="آدرس آواتار (اختیاری)"
            variant="standard"
            fullWidth
            value={formData.usrAvatar}
            onChange={handleChange}
            slotProps={{
              input: {
                style: { fontSize: theme.typography.body1 }
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: theme.typography.body1,
                height: 40
              },
              '& .MuiInputLabel-root': {
                fontSize: theme.typography.body2
              }
            }}
          />
          {error && <Alert severity="error" sx={{ fontSize: theme.typography.caption }}>{error}</Alert>}
          <Button
            type="submit"
            color="secondary"
            fullWidth
            disabled={loading}
            sx={{
              py: 1,
                              borderRadius: 3
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "ثبت‌نام"}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              قبلاً حساب کاربری دارید؟{' '}
              <MuiLink href="/login" sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 600
              }}>
                ورود به سامانه
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 