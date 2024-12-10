import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import TrashSvg from '@/assets/icons/lucide/trash.svg';
import { useMutations } from '@/src/presentation/usecase/mutation';
import { assert } from '@/src/utils/errors';

import { useActionsContext } from '../context/ActionsContext';
import { useFormStoreContext } from '../context/FormStoreContext';

function Remover() {
  const queryClient = useQueryClient();
  const formStore = useFormStoreContext();
  const mutation = useMutations.expense.delete(queryClient);
  const { styles, theme } = useStyles(stylesheet);

  const actions = useActionsContext();

  const handlePress = () => {
    const id = formStore.getId();
    assert(id, 'id is required');

    Alert.alert('削除しますか？', undefined, [
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          mutation.mutate(id, {
            onSuccess: () => {
              actions.onRemoved?.(true);
            },
            onError: () => {
              actions.onRemoved?.(false);
            },
          });
        },
      },
      {
        text: 'キャンセル',
        style: 'cancel',
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <TrashSvg width={theme.fontSize.title} height={theme.fontSize.title} color={theme.colors.status.error} />
    </TouchableOpacity>
  );
}
export default React.memo(Remover);

const stylesheet = createStyleSheet((theme) => ({
  button: {
    padding: theme.spacing.x2,
  },
}));
