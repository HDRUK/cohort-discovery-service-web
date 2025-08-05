import { Preview } from "@storybook/nextjs";
import { sb } from "storybook/test";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import ThemeRegistry from "../src/app/components/ThemeRegistry";

sb.mock(import("../src/app/actions/getCollections"));
sb.mock(import("../src/app/actions/omop/getCodes"));

const preview: Preview = {
  decorators: [
    withThemeFromJSXProvider({
      Provider: ThemeRegistry,
    }),
  ],
};

export default preview;
