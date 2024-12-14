import { JsonLocalDate } from '../utils/reanimated/types';

import { locale, currency } from './config';

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

export const dateFormat = (value: Date) => {
  // 今は日本だけ
  return `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`;
};

export const dateFormatOnWorklet = (date: JsonLocalDate) => {
  'worklet';
  return `${date.month}/${date.day}`;
};
