module.exports = {
	plugins: ['eslint-plugin-tsdoc'],
	extends: ['alloy', 'alloy/typescript'],
	ignorePatterns: ['/coverage/', '/dist/', '/node_modules/', '/.eslintcache', 'debug.log'],
	env: {
		browser: true,
		es2017: true,
	},
	globals: {},
	rules: {
		'no-param-reassign': 'off',
		'max-params': 'off',
		'tsdoc/syntax': 'warn',
	},
	root: true,
};
