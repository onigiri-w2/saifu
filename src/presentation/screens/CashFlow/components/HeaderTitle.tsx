import { useMemo } from 'react';
import { Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

type Props = {
  yearmonth: Yearmonth;
};
export default function HeaderTitle({ yearmonth }: Props) {
  const { styles } = useStyles(stylesheet);
  const label = useMemo(() => {
    return `${yearmonth.month}月`;
  }, [yearmonth]);

  return <Text style={styles.label}>{label}</Text>;
}

const stylesheet = createStyleSheet((theme) => ({
  label: {
    fontSize: theme.component.navigation.header.title.fontSize,
    color: theme.component.navigation.header.title.color,
    fontWeight: theme.component.navigation.header.title.fontWeight,
  },
}));
