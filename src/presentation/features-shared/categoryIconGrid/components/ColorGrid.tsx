import { View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { IconColor, iconColors } from '@/src/domain/types/categoryIconColor';

import { COLMUN_COUNT } from '../cosntants';

import ColorItem from './ColorItem';

type Props = {
  selected: IconColor;
  onSelect: (color: IconColor) => void;
};
function ColorGrid({ selected, onSelect }: Props) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      {iconColors.map((color) => (
        <ColorItem key={color} color={color} isSelected={selected === color} onSelect={onSelect} />
      ))}
    </View>
  );
}
export default ColorGrid;
const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: theme.spacing['x5'],
    paddingBottom: theme.spacing.x4,
    marginBottom: theme.spacing.x3,
    borderBottomWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  itemWrapper: {
    width: `${100 / (COLMUN_COUNT + 1)}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.x2,
  },
  item: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.default,
  },
}));
