import "server-only";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet, ErrorMode } from "@/server/api";
import { requireSession } from "@/server/session";
import { ApiResponse, RegressionTest } from "@/types/api";

export const getRegressionTests = async (): Promise<
  ApiResponse<RegressionTest[]>
> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<RegressionTest[]>>(
    token,
    API_ROUTES.regressionTestsAdmin,
    { errorMode: ErrorMode.RESULT },
  );
};
