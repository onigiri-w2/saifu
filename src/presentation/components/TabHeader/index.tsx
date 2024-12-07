import { Text, View } from 'react-native';

import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import SettingsSvg from '@/assets/icons/lucide/settings_1.75px.svg';

export default function TabHeader(props: BottomTabHeaderProps) {
  const { styles } = useStyles(stylesheet);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={{ height: '100%', justifyContent: 'center' }}>
          <Text style={styles.title}>12月</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
            marginLeft: 'auto',
          }}
        >
          <SettingsSvg width={24} height={24} stroke="#111" />
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    backgroundColor: theme.colors.background.ground,
    paddingTop: rt.insets.top,
    paddingHorizontal: theme.spacing.x3,
  },
  content: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.subTitle,
    fontWeight: 'medium',
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.subCaption,
  },
}));
