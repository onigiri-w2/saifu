import { JsonLocalDate } from '../../utils/reanimated/types';

export const dateFormat = (value: Date) => {
  // 今は日本だけ
  // return `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`;
  return `${value.getMonth() + 1}月${value.getDate()}日`;
};

export const dateFormatOnWorklet = (date: JsonLocalDate) => {
  'worklet';
  return `${date.month}/${date.day}`;
};
