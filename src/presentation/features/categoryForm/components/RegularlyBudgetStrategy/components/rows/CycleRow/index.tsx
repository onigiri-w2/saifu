import { Pressable, Text, View } from 'react-native';

import { KeyboardController } from 'react-native-keyboard-controller';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import CaretDownSvg from '@/assets/icons/phosphor/caret-down.svg';
import { budgetCycleLabels } from '@/src/domain/aggregation/budgetPlan/types';
import { useOpen } from '@/src/presentation/hooks/useOpen';

import { useStoreContext } from '../../../../../context/StoreContext';
import { sharedStylesheet } from '../styles';

import ModalEditor from './ModalEditor';

const itemName = 'strategy/regularly/cycle';
function CycleRow() {
  const { formStore, selectedItemStore } = useStoreContext();
  const data = useSnapshot(formStore.form.budgetPlan.strategyInputs.regularly);
  const selectedItem = useSnapshot(selectedItemStore).selected;

  const { styles, theme } = useStyles(stylesheet, {
    isSelected: selectedItem === itemName,
  });
  const { isOpen, open, close } = useOpen();

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        KeyboardController.dismiss();
        selectedItemStore.selected = itemName;
        open();
      }}
    >
      <Text style={styles.label}>周期</Text>
      <View style={styles.valueWrapper}>
        <Text style={styles.value}>{budgetCycleLabels[data.cycle]}</Text>
        <CaretDownSvg
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={selectedItem === itemName ? theme.colors.brand.primary : theme.colors.text.secondary}
        />
      </View>
      <ModalEditor isOpen={isOpen} close={close} />
    </Pressable>
  );
}
export default CycleRow;

const ICON_SIZE = 16;
const stylesheet = createStyleSheet((theme) => ({
  ...sharedStylesheet(theme),
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
}));
