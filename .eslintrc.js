module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier/@typescript-eslint",
  ],
  ignorePatterns: ["/public/draco-gltf/*.js"],
  rules: {
    // sometimes required for workarounds, perhaps change both of these to warn in the future
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    // type inference is generally good enough
    "@typescript-eslint/explicit-function-return-type": "off",
    // issue with eslint-plugin-react https://github.com/yannickcr/eslint-plugin-react/issues/2353
    "react/prop-types": "off",
    // display names seem to work, we don't need this validation for now
    "react/display-name": "off",
    // Next.js adds React to scope by default, though we'll probably import it in every file anyway
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/ban-ts-comment": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: [".eslintrc.js", "next.config.js"],
      env: {
        node: true,
      },
    },
  ],
};
