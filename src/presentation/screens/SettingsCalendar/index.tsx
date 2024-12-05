import React from 'react';
import { ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useStyles, createStyleSheet } from 'react-native-unistyles';

import { dayOfWeekLabels } from '@/src/domain/valueobject/types';
import { calendarQueryOptions } from '@/src/presentation/usecase/query/calendar/query-options';

import Row from '../../features/settings/components/Row';
import Section from '../../features/settings/components/Section';
import { SettingsStackNavigationProp } from '../../navigation/settingsStack';
import { utilStyleSheet } from '../../style/utilStyleSheet';

export default function Tab() {
  const { styles, theme } = useStyles(stylesheet);
  const { data: calendar } = useSuspenseQuery(calendarQueryOptions.loadCalendar());

  const navigation = useNavigation<SettingsStackNavigationProp>();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInset={{ bottom: theme.spacing['x12'] }}
    >
      <Section>
        <Row
          title="開始月"
          value={`${calendar.cycleStartDef.startYear}月`}
          onPress={() => {
            navigation.navigate('SettingsCalendarStartYear', {
              startYear: calendar.cycleStartDef.startYear,
            });
          }}
        />
        <Row
          title="開始日"
          value={`${calendar.cycleStartDef.startMonth}日`}
          onPress={() => {
            navigation.navigate('SettingsCalendarStartMonth', {
              startMonth: calendar.cycleStartDef.startMonth,
            });
          }}
        />
        <Row
          title="開始曜日"
          value={dayOfWeekLabels[calendar.cycleStartDef.startWeek] + '曜日'}
          onPress={() => {
            navigation.navigate('SettingsCalendarStartWeek', {
              startWeek: calendar.cycleStartDef.startWeek,
            });
          }}
        />
      </Section>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  ...utilStyleSheet(theme),
  content: {
    paddingHorizontal: theme.spacing.x4,
    paddingVertical: theme.spacing['x6'],
  },
}));
