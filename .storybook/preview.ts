import { Preview } from "@storybook/nextjs";
import { sb } from "storybook/test";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import ThemeRegistry from "../src/components/ThemeRegistry";

sb.mock(import("../src/actions/collection/getCollections"));
sb.mock(import("../src/actions/task/getTasks"));
sb.mock(import("../src/actions/omop/getCodes"));

const preview: Preview = {
  decorators: [
    withThemeFromJSXProvider({
      Provider: ThemeRegistry,
    }),
  ],
};

export default preview;
