export default {
  displayName: 'fsm-lib',
  preset: '../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../coverage/libs',
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary'],
  coveragePathIgnorePatterns: [
    'colors.css',
    'constants.ts',
    'mocks.ts',
    'types.ts',
  ],
};
