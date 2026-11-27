import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { ApiResponse } from "@/types/api";
import { editFailures, runMemberEdit } from "../workgroupMembers";

jest.mock("server-only", () => ({}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
  notFound: jest.fn(),
  unstable_rethrow: jest.fn(),
}));

const ok = (id: number) => ({
  id,
  response: { message: "success", data: 1 } as ApiResponse<number>,
});

const failed = (id: number, code: number, text: string) => ({
  id,
  response: {
    message: "",
    data: null,
    error: { text, code },
  } as unknown as ApiResponse<number>,
});

beforeEach(() => jest.clearAllMocks());

describe("editFailures", () => {
  it("returns no failures when every edit succeeds", () => {
    expect(editFailures([ok(1), ok(2)])).toEqual([]);
  });

  it("lists each refused edit with the API's message", () => {
    expect(
      editFailures([ok(1), failed(2, 403, "Workgroups are managed by Okta")]),
    ).toEqual([{ id: 2, message: "Workgroups are managed by Okta" }]);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("ends the session when the API says it has ended", () => {
    editFailures([failed(1, 401, "Unauthenticated")]);

    expect(redirect).toHaveBeenCalledWith(routes.logout);
  });
});

describe("runMemberEdit", () => {
  it("pairs the response with its id", async () => {
    const response = { message: "success", data: 1 };

    await expect(
      runMemberEdit(5, () => Promise.resolve(response)),
    ).resolves.toEqual({ id: 5, response });
  });

  it("turns a thrown error into a failed response", async () => {
    await expect(
      runMemberEdit(5, () => Promise.reject(new Error("Network down"))),
    ).resolves.toEqual({
      id: 5,
      response: {
        message: "",
        data: null,
        error: { text: "Network down", code: 500 },
      },
    });
  });
});
