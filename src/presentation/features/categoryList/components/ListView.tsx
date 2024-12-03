import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { BudgetingCategory } from '@/src/presentation/usecase/query/budgeting-category/functions';

import AddButton from './AddButton';
import Row from './Row';

type Props = {
  viewData: BudgetingCategory[];
  onPressAdd: () => void;
  onPressItem: (categoryId: string) => void;
};
function ListView({ viewData, onPressAdd, onPressItem }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BudgetingCategory>) => <Row budgetingCategory={item} onPress={onPressItem} />,
    [onPressItem],
  );
  const keyExtractor = useCallback((item: BudgetingCategory) => item.category.id, []);
  const itemSeparator = useCallback(() => <View style={styles.separator} />, [styles.separator]);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={viewData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentInset={{ bottom: theme.spacing['6xl'] }}
      ListFooterComponent={<AddButton onPress={onPressAdd} />}
      ItemSeparatorComponent={itemSeparator}
      showsVerticalScrollIndicator={false}
    />
  );
}
export default ListView;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
  contentContainer: {
    backgroundColor: theme.colors.background.layer1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginTop: theme.spacing['3xl'],
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.secondary,
  },
}));
