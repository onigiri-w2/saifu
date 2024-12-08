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
    paddingVertical: theme.spacing['x7'],
    borderRadius: theme.radius.default,
    backgroundColor: theme.colors.background.layer1,
  },
  description: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.secondary,
  },
}));
