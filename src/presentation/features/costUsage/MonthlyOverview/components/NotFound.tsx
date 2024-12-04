import { Text, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
function NotFound() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>表示のためのデータが存在しません</Text>
      <Text>まずはカテゴリを作成してみてください</Text>
    </View>
  );
}
export default NotFound;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
  },
}));
