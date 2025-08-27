import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../theme';
import { useMessageHandler } from '../utils/messageHandler';
import { TextField, Button, Alert, Paper, Box, Typography, CircularProgress, Avatar, Link as MuiLink, InputAdornment, IconButton } from "@mui/material";
import { PersonOutline as PersonOutlineIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { loginApi } from "../api/auth";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const { t } = useTranslation();
  const { getErrorMessage } = useMessageHandler();
  const { theme, direction } = useAppTheme();
  const [usrUsername, setUsrUsername] = useState("");
  const [usrPassword, setUsrPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginApi({ usrUsername, usrPassword });
      if (response.error) {
        setError(getErrorMessage(response.error.message || response.error));
      } else if (response.success && response.data) {
        // Call AuthContext login with token and user data from response.data
        login(response.data.token, response.data.user);
        navigate("/dashboard");
      } else {
        setError(getErrorMessage("loginError"));
      }
    } catch (err) {
      setError(getErrorMessage("loginError"));
    } finally {
      setLoading(false);
    }
  };

  // اگر کاربر قبلاً لاگین کرده، به dashboard هدایت شود
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // تنظیم gradient فرم لاگین بر اساس زبان و تم
  useEffect(() => {
    const updateLoginGradient = () => {
      const loginContainer = document.querySelector('.login-container');
      if (loginContainer) {
        loginContainer.style.background = theme.palette.components.gradients.secondary;
      }
    };

    // اجرای فوری
    updateLoginGradient();

    // اجرا بعد از رندر کامل
    const timer = setTimeout(updateLoginGradient, 100);

    return () => clearTimeout(timer);
  }, [theme.palette.components.gradients.secondary, direction]);

  // تنظیمات استایل از تم پروایدر
  const linkStyles = theme.palette.components.link;
  const inputIconStyles = theme.palette.components.inputIcon;
  const formPaperStyles = theme.palette.components.paper;

  return (
    <Box 
      className="login-container"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 3, md: 4 },
      }}>

      <Paper elevation={8} sx={{
        width: '100%',
        maxWidth: 400,
        padding: { xs: 3, sm: 4 },
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{
            width: 56,
            height: 56,
            mb: 2,
            backgroundColor: theme.palette.primary.main
          }}>
            <PersonOutlineIcon />
          </Avatar>
          <Typography variant="h6" align="center" sx={{
            width: '100%',
            textAlign: 'center',
            color: theme.palette.text.primary
          }}>
            {t('auth.loginToSystem')}
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label={t('auth.username')}
            fullWidth
            autoFocus
            autoComplete="username"
            value={usrUsername}
            onChange={e => setUsrUsername(e.target.value)}
            required
            slotProps={{
              input: {
                placeholder: t('auth.username'),
                style: {}
              }
            }}
          />
          <TextField
            label={t('auth.password')}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={usrPassword}
            onChange={e => setUsrPassword(e.target.value)}
            required
            slotProps={{
              input: {
                placeholder: t('auth.password'),
                style: {},
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                      onClick={() => setShowPassword((show) => !show)}
                      onMouseDown={e => e.preventDefault()}
                      edge="end"
                      sx={inputIconStyles}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: theme.shape.borderRadius
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : t('auth.login')}
          </Button>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            mt: 2
          }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {t('auth.noAccount')}
            </Typography>
            <MuiLink
              component={Link}
              to="/register"
              sx={linkStyles}
            >
              {t('auth.register')}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 