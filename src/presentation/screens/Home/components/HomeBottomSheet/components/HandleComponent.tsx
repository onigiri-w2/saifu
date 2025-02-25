import { View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

function HandleComponent() {
  const { styles } = useStyles(stylesheet);

  return <View style={styles.container}></View>;
}
export default HandleComponent;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    height: 16,
    width: '100%',
    alignItems: 'center',
  },
}));
