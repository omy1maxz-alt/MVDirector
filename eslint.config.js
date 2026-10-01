import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist/**'] },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { 
    settings: { react: { version: 'detect' } }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  { plugins: { 'react-refresh': pluginReactRefresh } },
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
