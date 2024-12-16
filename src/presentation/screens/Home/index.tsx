import { ScrollView, Text, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BudgetMetricsList from '../../features/budgetMetricsList';
import { utilStyleSheet } from '../../style/utilStyleSheet';

export default function Page() {
  const { styles } = useStyles(stylesheet);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>お金の状況</Text>
        <Text style={styles.today}>12月15日(日)</Text>
      </View>
      <BudgetMetricsList useDeferredRendering={false} />
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  ...utilStyleSheet(theme),
  container: {
    paddingTop: rt.insets.top + theme.spacing.x4,
    paddingHorizontal: theme.spacing.x4,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  pageTitle: {
    fontSize: theme.fontSize.subTitle,
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
  today: {
    fontSize: theme.fontSize.subBody,
    color: theme.colors.text.primary,
  },
}));
