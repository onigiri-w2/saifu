import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { IconColor } from '@/src/domain/aggregation/category/types/iconColor';
import { IconName, iconNames } from '@/src/domain/aggregation/category/types/iconName';

import ColorGrid from './components/ColorGrid';
import IconItem from './components/IconItem';
import { COLMUN_COUNT } from './cosntants';
import { Selected } from './types';

type Props = {
  initialSelected: Selected;
  onSelect: (iconName: IconName, iconColor: IconColor) => void;
};
function CategoryIconGird({ initialSelected, onSelect }: Props) {
  const { styles } = useStyles(stylesheet);
  const [selected, setSelected] = useState<Selected>(initialSelected);
  const flatListProps = useFlatListProps(selected, setSelected);
  const headerComponenet = useHeaderComponent(selected, setSelected);

  useEffect(() => {
    onSelect(selected.iconName, selected.iconColor);
  }, [selected]);

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={iconNames}
      renderItem={flatListProps.renderItem}
      keyExtractor={flatListProps.keyExtractor}
      numColumns={COLMUN_COUNT}
      initialNumToRender={COLMUN_COUNT}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={headerComponenet}
    />
  );
}
export default CategoryIconGird;
const stylesheet = createStyleSheet((theme) => ({
  content: {
    paddingHorizontal: theme.spacing.x4,
  },
}));

const useHeaderComponent = (selected: Selected, setSelected: (value: React.SetStateAction<Selected>) => void) => {
  const handleSelectColor = useCallback((iconColor: IconColor) => {
    setSelected((prev) => ({ ...prev, iconColor }));
  }, []);
  const headerComponenet = useCallback(
    () => <ColorGrid key="colorGrid" selected={selected.iconColor} onSelect={handleSelectColor} />,
    [selected.iconColor],
  );

  return headerComponenet;
};

const useFlatListProps = (selected: Selected, setSelected: (value: React.SetStateAction<Selected>) => void) => {
  const keyExtractor = useCallback((iconName: string) => iconName, []);
  const handleSelectIcon = useCallback((iconName: IconName) => {
    setSelected((prev) => ({ ...prev, iconName }));
  }, []);
  const renderItem = useCallback(
    ({ item: iconName }: { item: IconName }) => {
      return <IconItem iconName={iconName} onSelect={handleSelectIcon} isSelected={selected.iconName === iconName} />;
    },
    [selected.iconName],
  );

  return { keyExtractor, renderItem };
};
