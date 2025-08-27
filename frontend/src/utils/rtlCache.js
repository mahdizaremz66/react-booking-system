import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

// Create RTL cache with proper configuration for MUI v5+
export const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
  prepend: true, // This ensures our styles take precedence
  speedy: false, // Disable speedy mode for better RTL support
});

// Create LTR cache for normal direction
export const ltrCache = createCache({
  key: 'muiltr',
  prepend: true,
  speedy: false, // Disable speedy mode for consistency
});

// Function to get cache based on direction
export const getCache = (direction) => {
  return direction === 'rtl' ? rtlCache : ltrCache;
}; 