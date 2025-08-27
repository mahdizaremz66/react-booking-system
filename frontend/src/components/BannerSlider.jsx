import React, { useState, useEffect, useRef } from "react";
import { Button, IconButton, Box, Typography, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useAppTheme } from '../theme';
import { useTranslation } from 'react-i18next';
import img1 from "../assets/slider/1.jpg";
import img2 from "../assets/slider/2.jpg";
import img3 from "../assets/slider/3.jpg";
import img5 from "../assets/slider/5.webp";
import img6 from "../assets/slider/6.webp";
import imgSite from "../assets/slider/site.jpg";

const slides = [
  {
    image: img5,
    title: "حرم امام رضا (ع)",
    subtitle: "نمای بیرونی حرم مطهر",
    description: "زیارت و آرامش در حرم امام رضا (ع) - مشهد"
  },
  {
    image: img2,
    title: "دریای شمال",
    subtitle: "سواحل زیبای خزر",
    description: "آرامش و زیبایی در کنار دریای شمال ایران"
  },
  {
    image: img1,
    title: "جنگل‌های شمال",
    subtitle: "طبیعت بکر و سرسبز",
    description: "هوای پاک و مناظر بی‌نظیر جنگل‌های شمال"
  },
  {
    image: img3,
    title: "سواحل ماسه‌ای",
    subtitle: "تفریح و آرامش",
    description: "سواحل ماسه‌ای و دریای آرام شمال ایران"
  },
  {
    image: img6,
    title: "حرم امام رضا (ع)",
    subtitle: "نمای بیرونی حرم مطهر",
    description: "زیارت و آرامش در حرم امام رضا (ع) - مشهد"
  },
  {
    image: imgSite,
    title: "ایران زیبا",
    subtitle: "گردشگری و سفر",
    description: "تجربه سفر به نقاط دیدنی ایران با سامانه رزرو ما"
  }
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef();
  const { direction } = useAppTheme();
  const { t } = useTranslation();
  const theme = useTheme();

  // Auto-play functionality
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (index !== current) {
      setCurrent(index);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Main Image */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${slides[current].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: isTransitioning ? 'opacity 0.3s ease' : 'none',
        opacity: isTransitioning ? 0.8 : 1
      }}>
        {/* Overlay Gradient */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${theme.palette.shadow.medium} 0%, ${theme.palette.shadow.light} 50%, ${theme.palette.shadow.dark} 100%)`,
          zIndex: 1
        }} />

        {/* Content */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: theme.palette.common.white,
          zIndex: 2,
          width: '90%',
          maxWidth: 800
        }}>
          <Typography
            variant="sliderTitle"
            sx={{
              mb: 2,
              textShadow: `2px 2px 4px ${theme.palette.shadow.dark}`
            }}
          >
            {slides[current].title}
          </Typography>
          <Typography
            variant="sliderSubtitle"
            sx={{
              mb: 2,
              textShadow: `1px 1px 2px ${theme.palette.shadow.dark}`,
              opacity: 0.9
            }}
          >
            {slides[current].subtitle}
          </Typography>
          <Typography
            variant="sliderDescription"
            sx={{
              mb: 4,
              textShadow: `1px 1px 2px ${theme.palette.shadow.dark}`,
              opacity: 0.8,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            {slides[current].description}
          </Typography>
          <Button variant="contained" color="primary">
            {t('home.slider.startButton')}
          </Button>
        </Box>
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        onClick={direction === 'rtl' ? nextSlide : prevSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 16,
          zIndex: 3,
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.transparent.white,
        }}
        aria-label="تصویر قبلی"
      >
        {direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
      <IconButton
        onClick={direction === 'rtl' ? prevSlide : nextSlide}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 16,
          zIndex: 3,
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.transparent.white,
        }}
        aria-label="تصویر بعدی"
      >
        {direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>

      {/* Navigation Dots */}
      <Box sx={{
        
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 1,
        zIndex: 3
      }}>
        {slides.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`رفتن به تصویر ${index + 1}`}
            sx={{
              width: 10,
              height: 10,
              padding: 0,
              border: `1px solid ${theme.palette.neutral.white}`,
              color: theme.palette.neutral.white,
              backgroundColor: theme.palette.neutral.white,
            }}
          />
        ))}
      </Box>

      {/* Progress Bar */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: theme.palette.transparent.white,
        zIndex: 3
      }}>
        <Box
          sx={{
            height: '100%',
            backgroundColor: theme.palette.primary.main,
            width: `${((current + 1) / slides.length) * 100}%`,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            })
          }}
        />
      </Box>
    </Box>
  );
} 