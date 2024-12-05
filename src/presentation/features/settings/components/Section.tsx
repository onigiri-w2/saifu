import { View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props = {
  children: React.ReactNode;
};
function Section({ children }: Props) {
  const { styles } = useStyles(stylesheet);

  return <View style={styles.container}>{children}</View>;
}
export default Section;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background.layer2,
    borderRadius: theme.radius.default,
  },
}));
