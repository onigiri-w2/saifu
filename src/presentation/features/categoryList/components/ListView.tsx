import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

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

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={viewData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentInset={{ top: theme.spacing.x6, bottom: theme.spacing.x12 }}
      ListFooterComponent={<AddButton onPress={onPressAdd} />}
      showsVerticalScrollIndicator={false}
    />
  );
}
export default ListView;

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    overflow: 'hidden',
  },
});
