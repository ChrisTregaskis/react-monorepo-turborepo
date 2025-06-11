import { join } from "path";
import tailwindConfig from "@repo/tailwind-config";

/**
 * Shared Tailwind config for Turborepo apps.
 * This file re-exports the config from the shared package.
 */

export default {
  ...tailwindConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Also scan shared packages for class usage
    join(__dirname, "../../packages/ui/**/*.{js,ts,jsx,tsx}"),
  ],
};
