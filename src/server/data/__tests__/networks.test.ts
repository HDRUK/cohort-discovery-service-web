import { apiGet } from "@/server/api";
import { getNetworks } from "../networks";

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
}));

jest.mock("@/server/api", () => ({
  apiGet: jest.fn(),
}));

jest.mock("@/server/session", () => ({
  requireSession: jest.fn().mockResolvedValue({ token: "a-token" }),
}));

const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;

const sentParams = () =>
  new URLSearchParams(
    (mockedApiGet.mock.calls[0][2] as { params: string }).params,
  );

beforeEach(() => {
  mockedApiGet.mockReset();
  mockedApiGet.mockResolvedValue({ message: "", data: [] } as never);
});

describe("getNetworks", () => {
  it("passes on the query string it is given", async () => {
    await getNetworks(new URLSearchParams({ sort: "name:asc" }));

    expect(sentParams().get("sort")).toBe("name:asc");
  });

  it("sends the search term to the API", async () => {
    await getNetworks(new URLSearchParams({ "name[]": "north" }));

    expect(sentParams().get("name[]")).toBe("north");
  });

  it("calls the networks endpoint with the session token", async () => {
    await getNetworks();

    expect(mockedApiGet).toHaveBeenCalledWith(
      "a-token",
      "/api/v1/custodian_networks",
      expect.anything(),
    );
  });
});
