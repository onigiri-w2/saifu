import { View, ActivityIndicator } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function LoadingView() {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.brand.primary} />
    </View>
  );
}

const stylesheet = createStyleSheet(() => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
