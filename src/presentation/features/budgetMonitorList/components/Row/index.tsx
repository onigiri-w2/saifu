import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Category from '@/src/domain/aggregation/category';
import ThisCycleMonitor from '@/src/domain/projection/budgetMonitor/monitors/thisCycle';
import CategoryIcon from '@/src/presentation/features-shared/categoryIcon';

import EntirlyDiffBar from './bar/EntirlyDiffBar';
import EntirlyRemainingBar from './bar/EntirlyRemainingBar';
import TodayRemainingBar from './bar/TodayRemainingBar';
import EntirlyDiffBody from './body/EntirlyDiffBody';
import EntirlyRemainingBody from './body/EntirlyRemainingBody';
import TodayRemainingBody from './body/TodayRemainingBody';

type Props = {
  monitor: ThisCycleMonitor;
  category: Category;
  visual?: 'entirly' | 'today' | 'diff';
};
function Row({ monitor, category, visual = 'entirly' }: Props) {
  const { styles, theme } = useStyles(stylesheet);

  const bar = useMemo(() => {
    if (visual === 'entirly') return <EntirlyRemainingBar monitor={monitor} />;
    else if (visual === 'diff') return <EntirlyDiffBar monitor={monitor} />;
    else return <TodayRemainingBar monitor={monitor} />;
  }, [visual, monitor]);

  const body = useMemo(() => {
    if (visual === 'entirly') return <EntirlyRemainingBody monitor={monitor} />;
    else if (visual === 'diff') return <EntirlyDiffBody monitor={monitor} />;
    else return <TodayRemainingBody monitor={monitor} />;
  }, [visual, monitor]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <CategoryIcon
          iconName={category.iconName}
          iconColor={category.iconColor}
          size={theme.component.list.row.iconSize.large}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.categoryName}>{category.name}</Text>
        {body}
        {bar}
      </View>
    </View>
  );
}
export default React.memo(Row);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    height: theme.component.list.row.height.default,
    gap: theme.spacing.x4,
    paddingHorizontal: theme.spacing.x4,
  },
  iconWrap: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.layer1,
    borderRadius: theme.radius.default,
  },
  content: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.text.primary,
  },
}));
