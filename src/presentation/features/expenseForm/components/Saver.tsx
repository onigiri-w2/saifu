import { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useExpenseMutation } from '@/src/presentation/usecase/mutation/expense/mutation';
import { assert } from '@/src/utils/errors';

import { useFormStoreContext } from '../context/FormStoreContext';

type Props = {
  mode?: 'create' | 'update';
  onSaved?: (success: boolean) => void;
};
export default function Saver({ mode = 'create', onSaved }: Props) {
  const formStore = useFormStoreContext();
  const [canSave, setCanSave] = useState(false);

  const queryClient = useQueryClient();
  const createMutation = useExpenseMutation.create(queryClient);
  const updateMutation = useExpenseMutation.update(queryClient);

  const handlePress = () => {
    if (formStore.isDirty() === false || formStore.isValid() === false) return;
    const form = formStore.form;
    const id = formStore.getId();

    if (mode === 'create') {
      createMutation.mutate(
        {
          categoryId: form.categoryId!,
          amount: form.amount,
          date: new Date(form.timestamp),
          memo: form.memo,
        },
        {
          onError: () => {
            onSaved?.(false);
          },
          onSuccess: () => {
            onSaved?.(true);
          },
        },
      );
    } else {
      assert(id !== undefined, "id can't be undefined");
      updateMutation.mutate(
        {
          id,
          categoryId: form.categoryId!,
          amount: form.amount,
          date: new Date(form.timestamp),
          memo: form.memo,
        },
        {
          onError: () => {
            onSaved?.(false);
          },
          onSuccess: () => {
            onSaved?.(true);
          },
        },
      );
    }
  };

  useEffect(() => {
    formStore.subscribe((isDirty: boolean, isValid: boolean) => {
      setCanSave(isDirty && isValid);
    });
  }, [setCanSave]);

  const { styles } = useStyles(stylesheet, { canSave });

  return (
    <TouchableOpacity style={styles.container} disabled={!canSave} onPress={handlePress}>
      <Text style={styles.text}>保存</Text>
    </TouchableOpacity>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.x2,
    borderRadius: theme.radius.default,
    height: theme.component.button.middle.height,
    variants: {
      canSave: {
        true: {
          backgroundColor: theme.colors.brand.primary,
        },
        false: {
          backgroundColor: theme.colors.status.disabled,
        },
      },
    },
  },
  text: {
    color: theme.colors.text.oposite,
    fontWeight: 600,
    fontSize: theme.fontSize.subHeading,
  },
}));
