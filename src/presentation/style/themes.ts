const spaceUnit = 4;
const fontSizeBase = 17;
const fontSizeUnit = 2;
const radiusUnit = 4;

const pallet = {
  brand: {
    primary: '#2077DE',
    primaryTint: '#E4EFFB',
  },
  background: {
    ground: '#FFFFFF',
    layer2: '#f5f5f5',
    layer3: '#E5E5E5',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)', // より標準的な不透明度
    secondary: 'rgba(0, 0, 0, 0.6)', // これは良いバランス
    tertiary: 'rgba(0, 0, 0, 0.38)', // 0.3は少し薄すぎるかも
    placeholder: 'rgba(0, 0, 0, 0.30)', // 0.38は少し濃すぎるかも
    oposite: '#FFFFFF',
  },
  status: {
    success: '#289150',
    warning: '#EBC816',
    error: '#E71B34',
  },
  border: {
    primary: 'rgba(0, 0, 0, 0.12)',
    secondary: 'rgba(0, 0, 0, 0.08)',
    listSeparator: 'rgba(0, 0, 0, 0.08)',
  },
  highlight: {
    default: 'rgba(0, 0, 0, 0.1)',
  },
};

const baseTheme = {
  spacing: {
    xhalf: spaceUnit / 2,
    x1: spaceUnit,
    x2: spaceUnit * 2,
    x3: spaceUnit * 3,
    x4: spaceUnit * 4,
    x5: spaceUnit * 5,
    x6: spaceUnit * 6,
    x7: spaceUnit * 7,
    x8: spaceUnit * 8,
    x10: spaceUnit * 10,
    x12: spaceUnit * 12,
  },
  fontSize: {
    subCaption: fontSizeBase - fontSizeUnit * 3,
    caption: fontSizeBase - fontSizeUnit * 2,
    subBody: fontSizeBase - fontSizeUnit,
    body: fontSizeBase,
    subHeading: fontSizeBase + fontSizeUnit,
    heading: fontSizeBase + fontSizeUnit * 2,
    subTitle: fontSizeBase + fontSizeUnit * 3.5,
    title: fontSizeBase + fontSizeUnit * 5,
  },
  radius: {
    small: radiusUnit,
    default: radiusUnit * 2,
    full: 1000,
  },

  component: {
    navigation: {
      header: {
        height: 56,
        padding: {
          horizontal: spaceUnit * 4,
        },
        title: {
          fontSize: fontSizeBase,
          fontWeight: '500' as const,
          color: pallet.text.primary,
        },
        icon: {
          size: fontSizeBase + fontSizeUnit * 2,
          basecolor: pallet.text.primary,
          padding: spaceUnit * 1.5,
        },
      },
      bottomBar: { height: 60 },
    },
    list: {
      row: {
        height: { default: 52 },
        padding: {
          horizontal: spaceUnit * 4,
        },
        iconSize: {
          small: 20,
          middle: 24,
          large: 28,
        },
      },
    },
  },
};

const lightTheme = {
  ...baseTheme,
  colors: { ...pallet },
};

export const appThemes = {
  light: lightTheme,
};
