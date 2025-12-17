import nextPlugin from "@next/eslint-plugin-next";
import next from "eslint-config-next";
import tseslint from "typescript-eslint";

const config = [
  {
    ignores: ["MIGRATION_PACKAGE/**", ".next/**", "node_modules/**", "dist/**"],
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
  },
  ...next,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      // Next.js specific
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-unwanted-polyfillio": "error",

      // React best practices
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "error",
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-uses-react": "off", // Not needed in React 17+
      "react/jsx-uses-vars": "error",
      "react/no-children-prop": "error",
      "react/no-danger-with-children": "error",
      "react/no-deprecated": "warn",
      "react/no-direct-mutation-state": "error",
      "react/no-find-dom-node": "error",
      "react/no-is-mounted": "error",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-unknown-property": "error",
      "react/prop-types": "off", // Using TypeScript instead
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/require-render-return": "error",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // General JavaScript/TypeScript
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      "prefer-template": "warn",

      // Code quality
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-unmodified-loop-condition": "error",
      "no-unused-labels": "error",
      "no-useless-call": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-void": "error",
      "no-with": "error",
      radix: "error",
      "vars-on-top": "off",
      "wrap-iife": "error",
      yoda: "error",

      // Best practices
      "array-callback-return": "error",
      "consistent-return": "warn",
      "default-case": "warn",
      "dot-notation": "warn",
      "no-alert": "error",
      "no-caller": "error",
      "no-case-declarations": "error",
      "no-else-return": "warn",
      "no-empty-function": "warn",
      "no-empty-pattern": "error",
      "no-eq-null": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-floating-decimal": "error",
      "no-implicit-coercion": "warn",
      "no-iterator": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-loop-func": "error",
      "no-magic-numbers": "off", // Too strict for this project
      "no-multi-str": "error",
      "no-new": "warn",
      "no-new-wrappers": "error",
      "no-octal-escape": "error",
      "no-param-reassign": ["error", { props: false }],
      "no-proto": "error",
      "no-return-assign": "error",
      "no-return-await": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-unused-expressions": "error",
      "no-useless-call": "error",
      "no-useless-catch": "off", // Allow try/catch for error handling patterns
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "prefer-promise-reject-errors": "error",
      "require-await": "warn",
      yoda: "error",
    },
  },
];

export default config;
