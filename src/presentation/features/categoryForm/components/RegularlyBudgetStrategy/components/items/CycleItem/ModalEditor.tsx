import React from 'react';
import { Modal, Pressable, View, Text } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import { budgetCycleLabels, budgetCycles } from '@/src/domain/aggregation/budgetPlan/types';
import { useStoreContext } from '@/src/presentation/features/categoryForm/context/StoreContext';

type Props = {
  isOpen: boolean;
  close: () => void;
};
function ModalEditor({ isOpen, close }: Props) {
  const { styles } = useStyles(stylesheet);
  const { formDataStore, formFocusStore } = useStoreContext();

  const selectedCycle = useSnapshot(formDataStore.form.budgetPlan.strategyInputs.regularly).cycle;

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <Pressable
        style={styles.modal}
        onPress={() => {
          close();
          formFocusStore.focused = undefined;
        }}
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>周期の選択</Text>
          <View style={styles.buttonsContent}>
            {budgetCycles.map((cycle) => {
              return (
                <Pressable
                  key={cycle}
                  style={styles.button(selectedCycle === cycle)}
                  onPress={() => {
                    formDataStore.form.budgetPlan.strategyInputs.regularly.cycle = cycle;
                    formFocusStore.focused = undefined;
                  }}
                >
                  <Text style={styles.buttonText(selectedCycle === cycle)}>{budgetCycleLabels[cycle]}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
export default React.memo(ModalEditor);

const stylesheet = createStyleSheet((theme) => ({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  modalContent: {
    padding: theme.spacing.x4,
    width: '88%',
  },
  title: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  buttonsContent: {
    marginTop: theme.spacing.x4,
    gap: theme.spacing.x3,
  },
  button: (isActive: boolean) => ({
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.x3,
    borderRadius: theme.radius.default,
    backgroundColor: isActive ? theme.colors.brand.primaryTint : theme.colors.background.layer2,
    borderWidth: 1,
    borderColor: isActive ? theme.colors.brand.primary : theme.colors.background.layer2,
  }),
  buttonText: (isActive: boolean) => ({
    fontSize: theme.fontSize.body,
    color: isActive ? theme.colors.brand.primary : theme.colors.text.primary,
  }),
}));
