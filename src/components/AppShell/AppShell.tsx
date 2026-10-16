import { Box, Skeleton } from "@mui/material";
import TopMenu from "@/components/TopMenu";
import HeaderBar from "@/components/HeaderBar";
import AccessBanner from "@/components/AccessBanner";
import Footer from "@/components/Footer";
import SupportPopOut from "@/components/SupportPopOut/SupportPopOut";
import { isStandalone } from "@/utils/modes";
import { Suspense } from "react";

const hideNav = process.env.HIDE_NAV === "1";
const applicationMode = process.env.APPLICATION_MODE;

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const standalone = isStandalone(applicationMode);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "120vh",
        }}
      >
        {!standalone && <SupportPopOut />}

        {!hideNav && <HeaderBar />}

        {!hideNav && <AccessBanner />}

        <Box
          sx={{
            py: hideNav ? 0 : 1,
            px: hideNav ? 0 : 2,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          {!hideNav && (
            <Suspense
              fallback={
                <Box sx={{ display: "flex", px: 2, py: 1 }}>
                  <Skeleton
                    variant="rounded"
                    sx={{ width: "100%", height: "40px" }}
                  />
                </Box>
              }
            >
              <TopMenu />
            </Suspense>
          )}

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: "secondary.main",
              p: 2,
              overflow: "auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AppShell;
