import next from "eslint-config-next";

const config = [
  {
    ignores: ["MIGRATION_PACKAGE/**"],
  },
  ...next,
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;

