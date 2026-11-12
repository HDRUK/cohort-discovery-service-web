"use server";

import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";

export interface TrackClickInput {
  subjectType: string;
  subjectId: string | number;
  action: string;
  description?: string;
  properties?: Record<string, unknown>;
}

interface TrackClickBody {
  subject_type: string;
  subject_id: string | number;
  action: string;
  description?: string;
  properties?: Record<string, unknown>;
}

const trackClick = async ({
  subjectType,
  subjectId,
  action,
  description,
  properties,
}: TrackClickInput): Promise<ApiResponse<null>> => {
  const { token } = await requireSession();
  return apiPost<ApiResponse<null>, TrackClickBody>(token, API_ROUTES.clicks, {
    subject_type: subjectType,
    subject_id: subjectId,
    action,
    description,
    properties,
  });
};

export default trackClick;
