import { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useFormStoreContext } from '../context/FormStoreContext';

export default function Saver() {
  const store = useFormStoreContext();
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    store.subscribe((isDirty: boolean, isValid: boolean) => {
      setCanSave(isDirty && isValid);
    });
  }, [setCanSave]);

  const { styles } = useStyles(stylesheet, { canSave });

  return (
    <TouchableOpacity style={styles.container} disabled={!canSave}>
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
