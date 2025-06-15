import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginImport from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import eslintPluginNext from "@next/eslint-plugin-next";
import tailwindPlugin from "eslint-plugin-tailwindcss";
export default [
    {
        ignores: [
            "node_modules/",
            "drizzle/",
            "next/",
        ],
    },
    eslintConfigPrettier,
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            },
            globals: {
                JSX: "readonly",
                React: "readonly"
            }
        },
        plugins: {
            "@typescript-eslint": tsEslintPlugin,
            "prettier": eslintPluginPrettier,
            "import": eslintPluginImport,
            "react": eslintPluginReact,
            "next": eslintPluginNext,
            "tailwindcss": tailwindPlugin,
        },
        rules: {
            "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
            "import/extensions": "off",
            "react/require-default-props": "off",
            "no-use-before-define": "off",
            "import/prefer-default-export": "off",
            "no-unused-vars": "warn",
            "no-else-return": "off",
            "no-shadow": "off",
            "prefer-arrow-callback": "warn"
        }
    }
]