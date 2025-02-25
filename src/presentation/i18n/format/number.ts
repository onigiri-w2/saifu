import { locale, currency } from '../config';

export const numberFormat = (value: number, isCurrency = true) => {
  if (!isCurrency) return Intl.NumberFormat(locale).format(value);
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};
export const numberFormatOnWorklet = (value: number, isCurrency = true) => {
  'worklet';
  if (!isCurrency) return value.toLocaleString(locale);
  return value.toLocaleString(locale, {
    style: 'currency',
    currency,
  });
};
