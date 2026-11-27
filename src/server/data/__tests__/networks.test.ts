import { apiGet } from "@/server/api";
import { getNetworkCustodians } from "../networks";

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
  mockedApiGet.mockResolvedValue({ message: "", data: { data: [] } } as never);
});

describe("getNetworkCustodians", () => {
  it("calls the network's custodians endpoint with the session token", async () => {
    await getNetworkCustodians(7);

    expect(mockedApiGet).toHaveBeenCalledWith(
      "a-token",
      "/api/v1/custodian_networks/7/custodians",
      expect.anything(),
    );
  });

  it("sends the page and page size", async () => {
    await getNetworkCustodians(
      7,
      new URLSearchParams({ page: "2", per_page: "25" }),
    );

    expect(sentParams().get("page")).toBe("2");
    expect(sentParams().get("per_page")).toBe("25");
  });

  it("sends the search term", async () => {
    await getNetworkCustodians(7, new URLSearchParams({ "name[]": "north" }));

    expect(sentParams().get("name[]")).toBe("north");
  });
});
