"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";

export interface TrackClickInput {
  subjectType: string;
  subjectId: string | number;
  action: string;
  description?: string;
}

interface TrackClickBody {
  subject_type: string;
  subject_id: string | number;
  action: string;
  description?: string;
}

const trackClick = async ({
  subjectType,
  subjectId,
  action,
  description,
}: TrackClickInput): Promise<ApiResponse<null>> => {
  return await apiPost<ApiResponse<null>, TrackClickBody>(API_ROUTES.clicks, {
    subject_type: subjectType,
    subject_id: subjectId,
    action,
    description,
  });
};

export default trackClick;
