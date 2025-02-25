import { Suspense } from 'react';
import { View, Text, ScrollView } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BudgetMetricsList from '../../features/budget-metrics/components/BudgetMetricsList';
import { utilStyleSheet } from '../style/utilStyleSheet';

const tabNames = ['予算', '履歴', '予定'];

export default function HomePage() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: '#f1f1f1' }]}>
      <View style={{ backgroundColor: '#fff', borderRadius: 24, gap: 0 }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            borderBottomWidth: 1,
            borderColor: theme.colors.border.secondary,
            paddingHorizontal: 12,
            paddingVertical: 16,
            gap: 8,
          }}
        >
          {tabNames.map((name) => (
            <View
              key={name}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.background.layer1,
                borderRadius: 2,
              }}
            >
              <Text style={{ fontSize: theme.fontSize.body, color: theme.colors.text.primary }}>{name}</Text>
            </View>
          ))}
        </View>
        <View style={{ paddingHorizontal: 12 }}>
          <Suspense>
            <BudgetMetricsList useDeferredRendering={false} kind="entirly" />
          </Suspense>
        </View>
        {/* <View style={{ backgroundColor: '#fff', paddingVertical: 20, borderRadius: 24, paddingHorizontal: 0 }}> */}
        {/*   <Suspense> */}
        {/*     <Timeline */}
        {/*       useDeferredRendering={false} */}
        {/*       period={Period.build(LocalDate.build(2024, 12, 15), LocalDate.build(2025, 1, 1))} */}
        {/*     /> */}
        {/*   </Suspense> */}
        {/* </View> */}
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  ...utilStyleSheet(theme),
}));
