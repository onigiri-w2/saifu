import { Text, View, ViewStyle } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props = {
  style: ViewStyle;
};
function NoBudgetStrategy({ style }: Props) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.description}>このカテゴリには予算を設けません</Text>
    </View>
  );
}
export default NoBudgetStrategy;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing['4xl'],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.layer2,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
  },
}));
