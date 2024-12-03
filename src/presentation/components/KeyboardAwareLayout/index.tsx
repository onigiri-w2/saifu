import { ReactNode, createContext, useContext, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import { DEVICE_LAYOUT } from '@/src/presentation/utils/const';

const KeyboardOffsetContext = createContext<number>(0);

/**
 * 責務: 自分の端末高さからの位置を把握し、keyboardOffsetとして提供する
 * エラー処理:
 *   - 基本的にエラーになるようなら、0を返す。中断させるのは、ナンセンス。
 * 注意:
 *   - Viewの高さと端末高さを使ってることから、使い所によっては正しいoffsetにならない場合が起こる。
 *   - KeyboardAwareLayoutの使い所によっては、正しいoffsetにならない場合がある。
 *   - 多分大体の場合でうまくいかない...ww
 */
type Props = {
  children: ReactNode;
};
function KeyboardAwareLayout({ children }: Props) {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        let offset = DEVICE_LAYOUT.height - event.nativeEvent.layout.height;

        if (offset < 0) {
          // TODO: sentryにおくる
          console.warn('KeyboardAwareLayout: offset is negative. offset:', {
            deviceHeight: DEVICE_LAYOUT.height,
            layoutHeight: event.nativeEvent.layout.height,
          });
          offset = 0;
        }

        Platform.OS === 'ios' && setKeyboardOffset(offset);
      }}
    >
      <KeyboardOffsetContext.Provider value={keyboardOffset}>{children}</KeyboardOffsetContext.Provider>
    </View>
  );
}
export default KeyboardAwareLayout;

export const useKeyboardOffsetContext = () => useContext(KeyboardOffsetContext);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
