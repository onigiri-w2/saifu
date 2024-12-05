import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TrashSvg from '@/assets/icons/lucide/trash.svg';
import { useBudgetingCategoryMutation } from '@/src/presentation/usecase/mutation/budgeting-category/mutation';

const TRASH_ICON_SIZE = 24;
type Props = {
  categoryId: string;
};
function DeleteAction({ categoryId }: Props) {
  const { styles, theme } = useStyles(stylesheet);
  const queryClient = useQueryClient();
  const deleteMutation = useBudgetingCategoryMutation.delete(queryClient);

  const handlePress = () => {
    Alert.alert('カテゴリを削除しますか？', '関連する支出は全て削除されます', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '削除', onPress: () => deleteMutation.mutate({ categoryId }), style: 'destructive' },
    ]);
  };

  return (
    <TouchableOpacity style={styles.deleteAction} onPress={handlePress}>
      <TrashSvg width={TRASH_ICON_SIZE} height={TRASH_ICON_SIZE} stroke={theme.colors.text.oposite} />
    </TouchableOpacity>
  );
}
export default DeleteAction;

const stylesheet = createStyleSheet((theme) => ({
  deleteAction: {
    flex: 1,
    backgroundColor: theme.colors.status.error,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: theme.component.list.row.height.default,
  },
}));
