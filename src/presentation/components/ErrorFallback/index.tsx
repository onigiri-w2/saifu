import { Text, View } from 'react-native';

// import { FallbackProps } from 'react-error-boundary';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ErrorCharacterSvg from '@/assets/images/error-character.svg';

function ErrorFallback() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <ErrorCharacterSvg width={ICON_SIZE} height={ICON_SIZE} />
      <Text style={styles.title}>問題が発生しました</Text>
      <Text style={styles.description}>時間をおいてもう一度お試しください。</Text>
    </View>
  );
}
export default ErrorFallback;

const ICON_SIZE = 192;
const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing['6xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text.primary,
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
}));
