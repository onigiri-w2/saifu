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
    Alert.alert('カテゴリを削除しますか？', '', [
      {
        text: '削除する',
        onPress: () => {
          Alert.alert('注意', '紐づく支出も一緒に削除されますが、削除しますか？', [
            { text: 'キャンセル', style: 'cancel' },
            {
              text: '削除する',
              onPress: () => {
                deleteMutation.mutate({ categoryId });
              },
              style: 'destructive',
            },
          ]);
        },
        style: 'destructive',
      },
      { text: 'キャンセル', style: 'cancel' },
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
