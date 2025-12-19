import WorkgroupsAdmin from "./WorkgroupsAdmin";
import getAdminWorkgroups from "@/actions/getAdminWorkgroups";
import { ApiSearchParams } from "@/types/api";
import { buildSearchParams } from "@/utils/params";
import { Box, Skeleton } from "@mui/material";
import getCollections from "@/actions/getCollections";
import getAdminCollections from "@/actions/getAdminCollections";
import { DEFAULT_PER_PAGE } from "@/config/defaults";

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
  const {
    page = 1,
    per_page = DEFAULT_PER_PAGE,
    workgroup_filter = undefined,
  } = searchParams ?? {};

  const queryParams = {
    page,
    per_page,
    workgroup_id: workgroup_filter,
    // ["name[]"]: search_collection,
  };

  const params = buildSearchParams(queryParams);

  const [
    { data: collections },
    { data: allCollections },
    { data: workgroups },
  ] = await Promise.all([
    getAdminCollections({ params }),
    getCollections(),
    getAdminWorkgroups({ params }),
  ]);

  return (
    <WorkgroupsAdmin
      collections={collections}
      allCollections={allCollections}
      workgroups={workgroups}
    />
  );
};

export default WorkgroupsTab;
