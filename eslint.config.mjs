import { defineConfig } from "eslint/config";
import next from "eslint-config-next";

export default defineConfig([
    ...next,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
    },
]);
