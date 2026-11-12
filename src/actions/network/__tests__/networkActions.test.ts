import { updateTag } from "next/cache";
import { apiDelete, apiPost, apiPut } from "@/server/api";
import { CACHE_TAGS } from "@/config/tags";
import createNetwork from "../createNetwork";
import updateNetwork from "../updateNetwork";
import deleteNetwork from "../deleteNetwork";
import addCustodiansToNetwork from "../addCustodiansToNetwork";
import removeCustodiansFromNetwork from "../removeCustodiansFromNetwork";

jest.mock("@/server/api", () => ({
  apiPost: jest.fn(),
  apiPut: jest.fn(),
  apiDelete: jest.fn(),
}));

jest.mock("@/server/session", () => ({
  requireSession: jest.fn().mockResolvedValue({ token: "a-token" }),
}));

const API_RESPONSE = { data: { id: 7 } };

const NETWORK_PAYLOAD = { name: "Network A", url: "https://example.com" };

beforeEach(() => {
  jest.clearAllMocks();
  (apiPost as jest.Mock).mockResolvedValue(API_RESPONSE);
  (apiPut as jest.Mock).mockResolvedValue(API_RESPONSE);
  (apiDelete as jest.Mock).mockResolvedValue(API_RESPONSE);
});

describe("createNetwork", () => {
  it("expires the cached networks list so the new network shows at once", async () => {
    await createNetwork(NETWORK_PAYLOAD);

    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.networks);
  });
});

describe("updateNetwork", () => {
  it("expires the cached networks list so the change shows at once", async () => {
    await updateNetwork(7, NETWORK_PAYLOAD);

    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.networks);
  });
});

describe("deleteNetwork", () => {
  it("expires the cached networks list so the network disappears at once", async () => {
    await deleteNetwork(7);

    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.networks);
  });
});

describe("addCustodiansToNetwork", () => {
  it("expires the cached networks list so the added custodians show at once", async () => {
    await addCustodiansToNetwork({ id: 7, custodian_ids: [1, 2] });

    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.networks);
  });
});

describe("removeCustodiansFromNetwork", () => {
  it("expires the cached networks list so the removed custodians disappear at once", async () => {
    await removeCustodiansFromNetwork({ id: 7, custodian_ids: [1, 2] });

    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.networks);
  });
});
