import { TouchableOpacity } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import ReceiptSvg from '@/assets/icons/lucide/receipt_1.75px.svg';
import { costUsagePreferenceStore } from '@/src/presentation/features/costUsage/store/preference.store';
export default function DisplayModeAction() {
  const costOrTransaction = useSnapshot(costUsagePreferenceStore).costOrTransaction;
  const isTransaction = costOrTransaction === 'transaction';

  const { styles, theme } = useStyles(stylesheet, { isTransaction });
  const size = theme.component.navigation.header.icon.size;
  const color = isTransaction ? 'white' : theme.component.navigation.header.icon.basecolor;

  const handlePress = () => {
    setTimeout(() => {
      costUsagePreferenceStore.costOrTransaction = isTransaction ? 'cost' : 'transaction';
    }, 0);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <ReceiptSvg stroke={color} width={size} height={size} />
    </TouchableOpacity>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    padding: theme.component.navigation.header.icon.padding,
    borderRadius: theme.radius.small,
    variants: {
      isTransaction: {
        true: {
          backgroundColor: theme.colors.brand.primary,
        },
      },
    },
  },
}));
