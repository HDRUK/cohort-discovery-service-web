import { Box } from "@mui/material";
import HeaderBar from "@/components/HeaderBar";

const hideNav = process.env.HIDE_NAV === "1";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        maxHeight: "100dvh",
        bgcolor: "background.paper",
      }}
    >
      {!hideNav && <HeaderBar />}

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
