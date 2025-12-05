import WorkgroupsAdmin from "./WorkgroupsAdmin";
import getAdminWorkgroups from "@/actions/getAdminWorkgroups";
import { ApiSearchParams } from "@/types/api";
import { buildSearchParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import getCustodians from "@/actions/getCustodians";
import getAdminCollections from "@/actions/getAdminCollections";

export const WorkgroupsSkeleton = () => (
  <Box sx={{ height: "100%", p: 2 }}>
    <Skeleton variant="text" width={200} />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Box>
);

const WorkgroupsTab = async ({
  searchParams,
}: {
  searchParams: ApiSearchParams & {
    workgroup_filter?: string;
    search_collection?: string;
  };
}) => {
  const { page, per_page, workgroup_filter, search_collection } =
    searchParams ?? {};
  const queryParams = {
    page,
    per_page,
    workgroup_id: workgroup_filter,
    // ["name[]"]: search_collection,
  };

  const params = buildSearchParams(queryParams);

  const [{ data: collections }, { data: custodians }, { data: workgroups }] =
    await Promise.all([
      getAdminCollections(params),
      getCustodians(),
      getAdminWorkgroups(params),
    ]);

  return (
    <WorkgroupsAdmin
      collections={collections}
      custodians={custodians}
      workgroups={workgroups}
    />
  );
};

export default WorkgroupsTab;
