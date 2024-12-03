import { UnistylesRegistry } from 'react-native-unistyles';

import { lightTheme } from './themes';

type AppThemes = {
  light: typeof lightTheme;
};

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addThemes({
  light: lightTheme,
});
