import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { numberFormat } from '@/src/presentation/i18n/format/number';

import CategoryIcon from '../../../shared/components/CategoryIcon';
import { ExtendedTransaction } from '../../types';

type Props = {
  extendedTransaction: ExtendedTransaction;
};
function TransactionRow({ extendedTransaction }: Props) {
  const { styles } = useStyles(stylesheet);
  const { transaction, category } = extendedTransaction;
  const value = transaction.amount.value * (transaction.type === 'income' ? 1 : -1);

  return (
    <TouchableOpacity style={styles.container}>
      <CategoryIcon iconName={category.iconName} iconColor={category.iconColor} size={28} />
      <View style={styles.middle}>
        <Text style={styles.categoryName}>{category.name}</Text>
        {transaction.memo !== '' && <Text style={styles.memo}>{transaction.memo}</Text>}
      </View>
      <Text style={styles.money}>{numberFormat(value)}</Text>
    </TouchableOpacity>
  );
}
export default React.memo(
  TransactionRow,
  (prev, next) => JSON.stringify(prev.extendedTransaction) === JSON.stringify(next.extendedTransaction),
);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.x3,
    height: theme.component.list.row.height.default,
    paddingHorizontal: theme.spacing.x3,
  },
  middle: {
    flex: 1,
  },
  categoryName: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
  },
  memo: {
    fontSize: theme.fontSize.subBody,
    color: theme.colors.text.tertiary,
  },
  money: {
    fontSize: theme.fontSize.body,
    color: theme.colors.status.error,
  },
}));
