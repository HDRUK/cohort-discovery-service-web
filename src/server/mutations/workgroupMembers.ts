import "server-only";

import { unstable_rethrow } from "next/navigation";
import { endSessionIfEnded } from "@/server/api";
import { MembershipEditFailure } from "@/types/accessPolicy";
import { ApiResponse } from "@/types/api";

export interface MemberEditResponse {
  id: number;
  response: ApiResponse<unknown>;
}

const FAILED_REQUEST_STATUS = 500;

export const runMemberEdit = async (
  id: number,
  call: () => Promise<ApiResponse<unknown>>,
): Promise<MemberEditResponse> => {
  try {
    return { id, response: await call() };
  } catch (error) {
    unstable_rethrow(error);
    return {
      id,
      response: {
        message: "",
        data: null,
        error: {
          text: error instanceof Error ? error.message : "Request failed",
          code: FAILED_REQUEST_STATUS,
        },
      },
    };
  }
};

export const editFailures = (
  responses: MemberEditResponse[],
): MembershipEditFailure[] => {
  responses.forEach(({ response }) => endSessionIfEnded(response));

  return responses.flatMap(({ id, response }) =>
    response.error ? [{ id, message: response.error.text }] : [],
  );
};
