module.exports = {
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
	],
	"rules": {
		//"@typescript-eslint/no-explicit-any": "off",
	},
	"env": {
		"browser": true,
		"es6": true
	},
	"parser": "@typescript-eslint/parser",
	"plugins": ["@typescript-eslint"],
}