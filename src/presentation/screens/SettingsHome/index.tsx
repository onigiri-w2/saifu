import { ScrollView, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useStyles, createStyleSheet } from 'react-native-unistyles';

import CalendarCogSvg from '@/assets/icons/lucide/calendar.svg';
import FileTextSvg from '@/assets/icons/lucide/file-text.svg';
import ShieldAlertSvg from '@/assets/icons/lucide/shield-alert.svg';

import Row from '../../features/settings/components/Row';
import Section from '../../features/settings/components/Section';
import { SettingsStackNavigationProp } from '../../navigation/settingsStack';

export default function Page() {
  const { styles, theme } = useStyles(stylesheet);
  const navigation = useNavigation<SettingsStackNavigationProp>();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        contentInset={{
          bottom: theme.spacing['6xl'],
        }}
      >
        <Section>
          <Row
            title="カレンダー設定"
            SvgComponent={CalendarCogSvg}
            rightIconVariant="chevron"
            onPress={() => {
              navigation.navigate('SettingsCalendar');
            }}
          />
        </Section>
        <Section>
          <Row title="プライバシーポリシー" SvgComponent={ShieldAlertSvg} rightIconVariant="chevron" />
          <Row title="利用規約" SvgComponent={FileTextSvg} rightIconVariant="chevron" />
        </Section>
      </ScrollView>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  scrollViewContent: {
    paddingVertical: theme.spacing['3xl'],
    gap: theme.spacing.xl,
  },
}));
