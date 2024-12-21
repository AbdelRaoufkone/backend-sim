module.exports = {
    env: {
      node: true,
      jest: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  };
  