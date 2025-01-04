import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    {
        files: ["**/*.ts", "**/*.tsx"], // Matching TypeScript files
        languageOptions: {
            parser: typescriptParser,
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
        rules: {
            "no-unused-vars": "off", // Disable the base rule, as it can report incorrect errors
            "prefer-const": "error",
            "@typescript-eslint/no-unused-vars": "warn", // Enable the TypeScript-specific rule
            "@typescript-eslint/explicit-function-return-type": "off", 
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
        },
        ignores: ["node_modules", "dist", "build"], 
    },
];
