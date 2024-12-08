import { Text, TouchableOpacity } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function Saver() {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity style={styles.container}>
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
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.small,
    height: theme.component.button.middle.height,
  },
  text: {
    color: theme.colors.text.oposite,
    fontWeight: 600,
    fontSize: theme.fontSize.subHeading,
  },
}));
