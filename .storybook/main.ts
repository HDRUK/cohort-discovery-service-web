import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  // Only pick up real Storybook stories. The .mdx files under src/ are app
  // content (help tutorials + query-builder guidance), not Storybook docs.
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "@storybook/addon-themes",
  ],
  framework: "@storybook/nextjs",
  staticDirs: ["../public"],
};
export default config;
