const baseTheme = {
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '6xl': 48,
  },
  fontSize: {
    '2xs': 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    full: 1000,
  },
  height: {
    tabBar: 60,
    pageHeader: 52,
  },
};

export const lightTheme = {
  ...baseTheme,
  colors: {
    brand: {
      primary: '#2077DE',
      primaryTint: '#E4EFFB',
    },
    background: {
      ground: '#F1F1F6',
      layer1: '#FFFFFF',
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
    },
    highlight: {
      default: 'rgba(0, 0, 0, 0.1)',
    },
  },
};
