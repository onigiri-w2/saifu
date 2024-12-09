import { View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import AmountRow from './AmountRow';
import CategoryRow from './CategoryRow';
import DateRow from './DateRow';
import MemoRow from './MemoRow';
import Saver from './Saver';

export default function FormView() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <AmountRow />
      <DateRow />
      <CategoryRow />
      <MemoRow />
      <View style={styles.saveWrapper}>
        <Saver />
      </View>
    </View>
  );
}
const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingTop: theme.spacing.x5,
    gap: theme.spacing.x5,
  },
  saveWrapper: {
    marginTop: theme.spacing.x2,
    marginHorizontal: theme.spacing.x4,
  },
}));
