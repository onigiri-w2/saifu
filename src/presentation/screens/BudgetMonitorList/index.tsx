import { View } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';

import BudgetMonitorList from '../../features/budgetMonitorList';
import { utilStyleSheet } from '../../style/utilStyleSheet';

export default function Screen() {
  const isFocused = useIsFocused();
  const { styles } = useStyles(utilStyleSheet);

  return (
    <View style={styles.screen}>
      <BudgetMonitorList useDeferredRendering={!isFocused} />
    </View>
  );
}
