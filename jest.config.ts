import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // ... 他の設定
};

export default config;
