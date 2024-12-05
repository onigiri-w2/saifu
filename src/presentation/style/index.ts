import { UnistylesRegistry } from 'react-native-unistyles';

import { appThemes } from './themes';

type AppThemes = typeof appThemes;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes { }
}
UnistylesRegistry.addThemes(appThemes);
