import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/']
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    plugins: {
      prettier
    },
    rules: {
      ...configPrettier.rules,
      'prettier/prettier': 'error'
    }
  }
];
