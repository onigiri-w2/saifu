import { Text, TouchableOpacity } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};
function SaveButton({ onPress, disabled = false }: Props) {
  const { styles } = useStyles(stylesheet, { disabled });

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>保存</Text>
    </TouchableOpacity>
  );
}

export default SaveButton;

const stylesheet = createStyleSheet((theme) => ({
  text: {
    fontSize: theme.fontSize.body,
    fontWeight: 'bold',

    variants: {
      disabled: {
        true: {
          color: theme.colors.text.tertiary,
        },
        false: {
          color: theme.colors.brand.primary,
        },
      },
    },
  },
}));
