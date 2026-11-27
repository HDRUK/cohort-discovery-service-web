"use client";

import { Box, Typography, TypographyProps } from "@mui/material";
import { baseComponents } from "@/modules/Guidance/Guidance";
import DocumentationMdx from "./documentation.mdx";

const components = {
  ...baseComponents,
  // Same style as the section titles in the Overview tab (ActionMenuSection
  // renders them as `overline` by default).
  h2: (props: TypographyProps) => (
    <Typography
      variant="overline"
      component="h2"
      color="text.secondary"
      sx={{
        mt: 3,
        mb: 1,
        pb: 1,
        borderBottom: 1,
        // ActionMenuSection's line takes the accordion's text colour.
        borderColor: "text.primary",
        "&:first-of-type": { mt: 0 },
      }}
      {...props}
    />
  ),
  p: (props: TypographyProps) => <Typography sx={{ mb: 1 }} {...props} />,
};

const DocumentationPage = () => {
  return (
    <Box sx={{ overflowY: "auto", height: "auto", pt: 2, maxWidth: 700 }}>
      <DocumentationMdx components={components} />
    </Box>
  );
};

export default DocumentationPage;
