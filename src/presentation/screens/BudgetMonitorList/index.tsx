import { StyleSheet, View } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import BudgetMonitorList from '../../features/budgetMonitorList';

export default function Screen() {
  const isFocused = useIsFocused();

  return (
    <View style={styles.container}>
      <BudgetMonitorList useDeferredRendering={!isFocused} />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
