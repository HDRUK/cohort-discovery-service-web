import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ReadArgs } from "@/types/api";
import getTask from "../getTask";

jest.mock("@/lib/apiClient", () => ({
  apiGet: jest.fn(),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

beforeEach(() => mockedApiGet.mockReset());

describe("getTask", () => {
  it("ignores a url passed in args", async () => {
    const hostileArgs = {
      url: "https://attacker.example.com",
      options: { headers: { Authorization: "Bearer stolen" } },
      cacheOptions: { useCache: false },
    } as ReadArgs;

    await getTask("task-pid", hostileArgs);

    expect(mockedApiGet).toHaveBeenCalledWith({
      url: API_ROUTES.getTask("task-pid"),
      params: undefined,
      cacheOptions: { useCache: false },
    });
  });
});
