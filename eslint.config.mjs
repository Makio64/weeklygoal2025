import { FlatCompat } from "@eslint/eslintrc"
import stylistic from '@stylistic/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

const compat = new FlatCompat()

export default [
	...pluginVue.configs['flat/recommended'],
	...compat.extends( './.eslintrc-auto-import.json' ),

	{
		files: ["**/*.js", "**/*.jsx", "**/*.cjs", "**/*.mjs", "**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts", "**/*.vue"],
		ignores: ['node_modules', 'dist', 'out', '.gitignore', 'src/renderer/auto-imports.d.ts', 'src/renderer/components.d.ts'],
		languageOptions: {
			parser: vueParser,
			ecmaVersion: 2022,
			sourceType: 'module',
			parserOptions: {
				parser: null,
				ecmaVersion: 2022,
				sourceType: 'module'
			}
		},
		plugins: {
			'@stylistic': stylistic,
			'unused-imports': unusedImports,
			'simple-import-sort': simpleImportSort
		},
		rules: {
			// Import sorting and unused imports
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'error',
				{
					'vars': 'all',
					'varsIgnorePattern': '^_',
					'args': 'after-used',
					'argsIgnorePattern': '^_'
				}
			],
			
			// Vue rules
			'vue/require-default-prop': 'off',
			'vue/multi-word-component-names': 'off',
			'vue/order-in-components': 'off',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/no-multiple-template-root': 'off',
			'vue/html-indent': ['error', 'tab'], // enforce tabs in template
			'vue/no-v-html': 'off',
			'vue/first-attribute-linebreak': 'off',
			'vue/multiline-html-element-content-newline': 'off',

			'@stylistic/indent': ['error', 'tab'],
			'max-len': 'off',
			'@stylistic/semi': ['error', 'never'],
			'@stylistic/key-spacing': ['error', { "beforeColon": false, "afterColon": true }],
			'@stylistic/space-infix-ops': ['error', { "int32Hint": false }],
			'@stylistic/comma-spacing': ["error", { "before": false, "after": true }],
			'@stylistic/array-bracket-spacing': ["error", "never"],
			'@stylistic/space-before-blocks': ["error", "always"],
			'@stylistic/object-curly-spacing': ["error", "always"],
			'@stylistic/space-in-parens': ["error", "always"],
			"array-bracket-newline": ["error", { multiline: true, minItems: null }],
			"array-element-newline": ["error", 'consistent']
		}
	}
]