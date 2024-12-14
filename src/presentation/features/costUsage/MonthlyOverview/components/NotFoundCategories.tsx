import React from 'react';
import { Text, View } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props = {
  existAtLeastOne: boolean;
};
function NotFoundCategories({ existAtLeastOne }: Props) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.container, existAtLeastOne && { display: 'none' }]}>
      <Text style={styles.text}>カテゴリが1つも登録されていません</Text>
    </View>
  );
}
export default React.memo(NotFoundCategories);

const stylesheet = createStyleSheet((theme) => ({
  container: {
    display: 'flex',
    borderRadius: theme.radius.default,
    marginHorizontal: theme.spacing.x4,
    paddingVertical: theme.spacing.x12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.body,
  },
}));
