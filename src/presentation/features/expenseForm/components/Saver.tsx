import { useEffect, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import { useQueryClient } from '@tanstack/react-query';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DashedSquareSvg from '@/assets/icons/lucide/square-check_1.75px.svg';
import { useExpenseMutation } from '@/src/presentation/usecase/mutation/expense/mutation';
import { assert } from '@/src/utils/errors';

import { useFormStoreContext } from '../context/FormStoreContext';
import { OnSavedFunction } from '../type';

type Props = {
  mode?: 'create' | 'update';
  onSaved?: OnSavedFunction;
};
export default function Saver({ mode = 'create', onSaved }: Props) {
  const formStore = useFormStoreContext();
  const [canSave, setCanSave] = useState(false);

  const [keeping, setKeeping] = useState(false);

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
            onSaved?.(false, keeping);
          },
          onSuccess: () => {
            onSaved?.(true, keeping);
            if (keeping) {
              formStore.form.amount = 0;
              formStore.form.memo = '';
            }
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
            onSaved?.(false, false);
          },
          onSuccess: () => {
            onSaved?.(true, false);
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

  const { styles, theme } = useStyles(stylesheet, { canSave, keeping });

  return (
    <View>
      <TouchableOpacity style={styles.container} disabled={!canSave} onPress={handlePress}>
        <Text style={styles.text}>保存</Text>
      </TouchableOpacity>
      {mode === 'create' && (
        <Pressable
          style={styles.keepingView}
          onPress={() => {
            setKeeping((prev) => !prev);
          }}
        >
          <DashedSquareSvg
            width={theme.fontSize.body}
            height={theme.fontSize.body}
            stroke={keeping ? theme.colors.brand.primary : theme.colors.text.tertiary}
          />
          <Text style={styles.keeping}>保存後も続けて入力する</Text>
        </Pressable>
      )}
    </View>
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
  keepingView: {
    marginTop: theme.spacing.x2,
    paddingVertical: theme.spacing.x2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.x1,
  },
  keeping: {
    textAlign: 'center',
    fontSize: theme.fontSize.subBody,
    variants: {
      keeping: {
        true: {
          color: theme.colors.brand.primary,
          fontWeight: 600,
        },
        false: {
          color: theme.colors.text.tertiary,
        },
      },
    },
  },
}));
