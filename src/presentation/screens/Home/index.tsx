import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import DiffSvg from '@/assets/icons/lucide/diff_1.75px.svg';
import SlashSvg from '@/assets/icons/lucide/slash_1.75px.svg';

import BudgetMetricsList from '../../features/budgetMetricsList';
import { InfoVarinat } from '../../features/budgetMetricsList/types';
import { utilStyleSheet } from '../../style/utilStyleSheet';

export default function Page() {
  const [metricsVariant, setMetricsVariant] = useState<InfoVarinat>('entirly');

  const { styles, theme } = useStyles(stylesheet);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>お金の状況</Text>
        <Text style={styles.today}>12月15日(日)</Text>
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 44,
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: theme.fontSize.body,
              fontWeight: 'bold',
              color: theme.colors.text.primary,
            }}
          >
            予算状況
          </Text>
          <View style={styles.budgetHeaderButtons}>
            <TouchableOpacity
              style={[styles.budgetHeaderButton, metricsVariant === 'today' && styles.budgetHeaderButton_active]}
              onPress={() => {
                setMetricsVariant(metricsVariant === 'today' ? 'entirly' : 'today');
              }}
            >
              <SlashSvg
                width={16}
                height={16}
                stroke={metricsVariant === 'today' ? theme.colors.text.oposite : theme.colors.text.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.budgetHeaderButton, metricsVariant === 'diff' && styles.budgetHeaderButton_active]}
              onPress={() => {
                setMetricsVariant(metricsVariant === 'diff' ? 'entirly' : 'diff');
              }}
            >
              <DiffSvg
                width={19}
                height={19}
                stroke={metricsVariant === 'diff' ? theme.colors.text.oposite : theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <BudgetMetricsList useDeferredRendering={false} variant={metricsVariant} />
      </View>
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
  budgetHeaderButtons: {
    flexDirection: 'row',
    gap: theme.spacing.x2,
  },
  budgetHeaderButton: {
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.background.layer1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 32,
  },
  budgetHeaderButton_active: {
    backgroundColor: theme.colors.brand.primary,
  },
}));
