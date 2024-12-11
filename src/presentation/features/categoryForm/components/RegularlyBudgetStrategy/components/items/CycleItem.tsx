import { useCallback, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';

import { MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import CaretDownSvg from '@/assets/icons/phosphor/caret-down.svg';
import { budgetCycleLabels, budgetCycles, isBudgetCycle } from '@/src/domain/aggregation/budgetPlan/types';
import { assert } from '@/src/utils/errors';

import { useStoreContext } from '../../../../context/StoreContext';

import { sharedStylesheet } from './styles';

const itemName = 'strategy/regularly/cycle';

function CycleRow() {
  const { formDataStore, formFocusStore } = useStoreContext();
  const data = useSnapshot(formDataStore.form.budgetPlan.strategyInputs.regularly);
  const selectedItem = useSnapshot(formFocusStore).focused;

  const { styles, theme } = useStyles(stylesheet, {
    isSelected: selectedItem === itemName,
  });

  const menuRef = useRef(null);

  const actions = useMemo(() => {
    return budgetCycles.map((cycle) => {
      return {
        id: cycle,
        title: budgetCycleLabels[cycle],
        state: data.cycle === cycle ? ('on' as const) : ('off' as const),
      };
    });
  }, [data.cycle]);

  const handlePressActions = useCallback(({ nativeEvent }: NativeActionEvent) => {
    assert(isBudgetCycle(nativeEvent.event), 'BudgetCycleでない値が与えられています', {
      value: nativeEvent.event,
    });

    formDataStore.form.budgetPlan.strategyInputs.regularly.cycle = nativeEvent.event;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>周期</Text>
      <MenuView
        ref={menuRef}
        title=""
        onPressAction={handlePressActions}
        style={styles.valueWrapper}
        actions={actions}
        shouldOpenOnLongPress={false}
      >
        <Text style={styles.value}>{budgetCycleLabels[data.cycle]}</Text>
        <CaretDownSvg
          width={ICON_SIZE}
          height={ICON_SIZE}
          fill={selectedItem === itemName ? theme.colors.brand.primary : theme.colors.text.secondary}
        />
      </MenuView>
    </View>
  );
}
export default CycleRow;

const ICON_SIZE = 16;
const stylesheet = createStyleSheet((theme) => ({
  ...sharedStylesheet(theme),
  valueWrapper: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
    gap: theme.spacing.xhalf,
    paddingLeft: theme.spacing.x3,
  },
}));
