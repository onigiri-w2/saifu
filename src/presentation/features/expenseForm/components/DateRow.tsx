import React, { useCallback } from 'react';
import { Text, Pressable, View } from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSnapshot } from 'valtio';

import CalendarSvg from '@/assets/icons/lucide/calendar.svg';
import { useOpen } from '@/src/presentation/hooks/useOpen';
import { dateFormat } from '@/src/presentation/i18n/format';

import { useFormStoreContext } from '../context/FormStoreContext';
import { commonStylesheet } from '../style';

function DateRow() {
  const { styles, theme } = useStyles(stylesheet);

  const store = useFormStoreContext();
  const timestamp = useSnapshot(store.form).timestamp;
  const date = new Date(timestamp);

  const { isOpen, open, close } = useOpen();

  const handleChangeDate = useCallback((date: Date) => {
    store.updateTimestamp(date.getTime());
  }, []);

  return (
    <Pressable style={styles.container} onPress={open}>
      <CalendarSvg width={theme.fontSize.subHeading} height={theme.fontSize.subHeading} stroke="#000" />
      <Text style={styles.label}>日付</Text>
      <View style={styles.valueWrapper}>
        <Text style={styles.value}>{dateFormat(date)}</Text>
      </View>
      <DateTimePickerModal
        isVisible={isOpen}
        mode="date"
        display="inline"
        date={new Date(timestamp)}
        onConfirm={() => {
          //
        }}
        onCancel={close}
        onChange={handleChangeDate}
        locale="ja"
        customConfirmButtonIOS={() => null}
        modalStyleIOS={styles.modal}
        cancelTextIOS="閉じる"
      />
    </Pressable>
  );
}

export default React.memo(DateRow);

const stylesheet = createStyleSheet((theme, rt) => ({
  ...commonStylesheet(theme),
  modal: {
    marginBottom: rt.insets.bottom,
  },
}));
