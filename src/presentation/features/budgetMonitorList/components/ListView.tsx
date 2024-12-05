import React, { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import { useStyles, createStyleSheet } from 'react-native-unistyles';

import { MonitorViewData } from '../../categoryList/types';

import Row from './Row';

type Props = {
  viewData: MonitorViewData[];
};
function ListView({ viewData }: Props) {
  const renderItem = useCallback((item: ListRenderItemInfo<MonitorViewData>) => {
    return <Row monitor={item.item.monitor} category={item.item.category.category} />;
  }, []);
  const keyExtractor = useCallback((item: MonitorViewData) => item.monitor.categoryId, []);
  const { styles, theme } = useStyles(stylesheet);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={viewData}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentInset={{ top: theme.spacing.x8, bottom: theme.spacing.x8 }}
    />
  );
}
export default React.memo(ListView);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    gap: theme.spacing.x6,
    backgroundColor: theme.colors.background.layer1,
    overflow: 'hidden',
  },
}));
