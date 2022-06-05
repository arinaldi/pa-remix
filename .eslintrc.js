/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
  ],
  rules: {
    // "comma-dangle": ["error", "always-multiline"],
    "eol-last": "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "type",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
        ],
      },
    ],
    "no-console": "warn",
    "object-shorthand": "error",
    semi: ["error", "always"],
  },
  settings: {
    jest: {
      version: 27,
    },
  },
};
