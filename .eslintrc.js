const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: ['anf'],
  plugins: ['react-native'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ios.js', '.android.js'],
      },
    },
  },
  rules: {
    'no-param-reassign': [ERROR, { props: false }],
    'react/require-extension': OFF,
    'react-native/no-unused-styles': ERROR,
    'class-methods-use-this': OFF,
    'jsx-a11y/anchor-has-content': OFF,
    'jsx-a11y/tabindex-no-positive': OFF,
    'react/no-unescaped-entities': OFF,
    'react/no-unused-prop-types': OFF,
    camelcase: OFF,
  },
  globals: {
    requestAnimationFrame: false,
    cancelAnimationFrame: false,
    XMLHttpRequest: false,
    fetch: false,
    navigator: false,
  },
};