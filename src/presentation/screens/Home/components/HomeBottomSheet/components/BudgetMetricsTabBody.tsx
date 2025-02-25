import { Text } from 'react-native';

import { BottomSheetView } from '@gorhom/bottom-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const sampleData = [
  { id: '1', name: 'aaaaa1' },
  { id: '2', name: 'aaaaa2' },
  { id: '3', name: 'aaaaa3' },
  { id: '4', name: 'aaaaa4' },
  { id: '5', name: 'aaaaa5' },
  { id: '6', name: 'aaaaa6' },
  { id: '7', name: 'aaaaa7' },
  { id: '8', name: 'aaaaa8' },
  { id: '9', name: 'aaaaa9' },
  { id: '11', name: 'aaaaa10' },
  { id: '12', name: 'aaaaa11' },
  { id: '13', name: 'aaaaa12' },
  { id: '14', name: 'aaaaa13' },
  { id: '15', name: 'aaaaa14' },
];

function BudgetMetricsTabBody() {
  const { styles } = useStyles(stylesheet);
  return (
    <BottomSheetView
      style={{ flex: 1 }}
      onLayout={(e) => {
        console.log('onLayout', e.nativeEvent.layout);
      }}
    >
      <Text style={{ padding: 24 }}>aaaaaaaa</Text>
      {/* <FlatList */}
      {/*   style={{ flex: 1 }} */}
      {/*   data={sampleData} */}
      {/*   renderItem={({ item }) => { */}
      {/*     return <Text style={{ height: 40 }}>{item.name}</Text>; */}
      {/*   }} */}
      {/*   keyExtractor={(item) => item.id} */}
      {/* /> */}
    </BottomSheetView>
  );
}
export default BudgetMetricsTabBody;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
}));
