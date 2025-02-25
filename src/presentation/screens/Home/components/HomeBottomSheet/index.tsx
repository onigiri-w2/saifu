import { useRef } from 'react';
import { Text, View } from 'react-native';

import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';

import HandleComponent from './components/HandleComponent';

function HomeBottomSheet() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const position = useSharedValue(0);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      handleComponent={HandleComponent}
      animatedPosition={position}
      snapPoints={['30%', '50%']}
      enableDynamicSizing={false}
    >
      <View style={{ flexDirection: 'row' }}>
        <BottomSheetFlatList
          style={{ flex: 1 }}
          data={sampleData}
          renderItem={({ item }) => {
            return <Text style={{ height: 40 }}>{item.name}</Text>;
          }}
          keyExtractor={(item) => item.id}
        />
        <BottomSheetFlatList
          style={{ flex: 1 }}
          data={sampleData}
          renderItem={({ item }) => {
            return <Text style={{ height: 40 }}>{item.name}</Text>;
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
    </BottomSheet>
  );
}
export default HomeBottomSheet;

const sampleData = [
  { id: '1', name: 'aaaaa1' },
  { id: '2', name: 'aaaaa2' },
  { id: '3', name: 'aaaaa3' },
  { id: '4', name: 'aaaaa4' },
  { id: '5', name: 'aaaaa5' },
  { id: '6', name: 'aaaaa6' },
  { id: '7', name: 'aaaaa7' },
  { id: '8', name: 'aaaaa8' },
  { id: '9', name: 'aaaaa1' },
  { id: '11', name: 'aaaaa2' },
  { id: '12', name: 'aaaaa5' },
  { id: '13', name: 'aaaaa4' },
  { id: '14', name: 'aaaaa2' },
  { id: '16', name: 'aaaaa5' },
  { id: '17', name: 'aaaaa4' },
  { id: '18', name: 'aaaaa4' },
  { id: '19', name: 'aaaaa4' },
  { id: '20', name: 'aaaaa4' },
];
