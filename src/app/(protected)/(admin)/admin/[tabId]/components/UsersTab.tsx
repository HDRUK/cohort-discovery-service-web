import { Box, Skeleton } from "@mui/material";
import { isStandalone } from "@/utils/modes";
import { notFound } from "next/navigation";
import UsersAdmin from "./UsersAdmin";

export const UsersSkeleton = ({ children }: { children?: React.ReactNode }) => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    {children ? (
      <Box sx={{ mt: 2, height: 300 }}>{children}</Box>
    ) : (
      <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
    )}
  </Box>
);

const UsersTab = async ({ applicationMode }: { applicationMode: string }) => {
  if (!isStandalone(applicationMode)) notFound();

  return <UsersAdmin />;
};

export default UsersTab;
