import React, { useMemo } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { SvgProps } from 'react-native-svg';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ChevronSvg from '@/assets/icons/lucide/chevron_2px.svg';

type Props = {
  title: string;
  value?: string;
  SvgComponent?: React.FC<SvgProps>;
  rightIconVariant?: 'chevron' | 'none';
  onPress?: () => void;
};
function Row({ title, value, SvgComponent, rightIconVariant = 'chevron', onPress }: Props) {
  const { styles, theme } = useStyles(stylesheet, {
    hasLeftIcon: !!SvgComponent,
  });

  const leftIcon = useMemo(() => {
    if (!SvgComponent) return null;
    return <SvgComponent width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.text.primary} />;
  }, [SvgComponent, theme]);

  const rightIcon = useMemo(() => {
    switch (rightIconVariant) {
      case 'chevron':
        return <ChevronSvg width={CHEVRON_SIZE} height={CHEVRON_SIZE} color={theme.colors.text.tertiary} />;
      case 'none':
        return null;
      default:
        return null;
    }
  }, [rightIconVariant, theme]);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      {leftIcon}
      <Text style={styles.title}>{title}</Text>
      {value !== undefined && <Text style={styles.value}>{value}</Text>}
      {rightIcon}
    </TouchableOpacity>
  );
}
export default Row;

const ICON_SIZE = 22;
const CHEVRON_SIZE = 22;
const stylesheet = createStyleSheet((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.component.list.row.height.default,
    paddingHorizontal: theme.spacing.x4,
  },
  title: {
    variants: {
      hasLeftIcon: {
        true: {
          marginLeft: theme.spacing.x4,
        },
        false: {
          marginLeft: 0,
        },
      },
    },
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.body,
    flex: 1,
  },
  value: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.body,
  },
}));
