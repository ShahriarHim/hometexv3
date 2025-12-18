// eslint.config.mjs

import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["MIGRATION_PACKAGE/**", ".next/**", "node_modules/**", "dist/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: [
      "**/*.cjs",
      "**/*.mjs",
      "scripts/**/*.js",
      "next.config.*",
      "postcss.config.*",
      "tailwind.config.*",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
      react,
    },

    rules: {
      // ===== Next.js =====
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-unwanted-polyfillio": "error",

      // ===== React =====
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/no-unescaped-entities": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // ===== TypeScript =====
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // ===== General =====
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      yoda: "error",
    },
  },
];
