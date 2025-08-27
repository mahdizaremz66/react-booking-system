import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format as formatJalali, parse as parseJalali } from 'date-fns-jalali';
import { format, parse } from 'date-fns';
import { useAppTheme } from '../theme';

export default function AppDatePicker({ value, onChange, label, ...props }) {

  
  const displayValue = value ? new Date(value) : null;

  const handleChange = (newValue) => {
    if (newValue) {
      // تبدیل تاریخ به فرمت ISO برای ذخیره در دیتابیس
      const isoDate = format(newValue, 'yyyy-MM-dd');
      onChange(isoDate);
    } else {
      onChange(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
      <DatePicker
        label={label}
        value={displayValue}
        onChange={handleChange}
        format="yyyy/MM/dd"
        slotProps={{
          textField: {
            size: "small",
            margin: "dense",
            variant: "standard",
            fullWidth: true,
            sx: { mb: 1 },
            slotProps: {
              input: {
                style: {}
              }
            }
          }
        }}
      />
    </LocalizationProvider>
  );
}
