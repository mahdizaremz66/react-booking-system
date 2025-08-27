import jalaali from 'jalaali-js';

export function formatDateYMD(date, lang = 'fa') {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d)) return '';
  if (lang === 'fa' || lang.startsWith('fa')) {
    const { jy, jm, jd } = jalaali.toJalaali(d);
    return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
} 