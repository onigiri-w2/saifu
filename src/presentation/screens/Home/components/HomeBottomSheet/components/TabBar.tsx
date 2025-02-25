import { View, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

const tabs = {
  budgetMetrics: '予算状況',
  history: '履歴',
};

function TabBar() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.tabBar}>
      {Object.entries(tabs).map(([key, value]) => (
        <View style={styles.tabView} key={key}>
          <Text style={styles.tabText}>{value}</Text>
        </View>
      ))}
    </View>
  );
}
export default TabBar;

const stylesheet = createStyleSheet((theme) => ({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabView: {
    padding: theme.spacing.x1,
  },
  tabText: {
    fontSize: theme.fontSize.body,
  },
}));
