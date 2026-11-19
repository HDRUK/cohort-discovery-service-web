import { refresh, updateTag } from "next/cache";
import { apiPost } from "@/server/api";
import { CACHE_TAGS } from "@/config/tags";
import { QueryContext } from "@/types/context";
import createCollectionHost from "../createCollectionHost";

jest.mock("@/server/api", () => ({ apiPost: jest.fn() }));

jest.mock("@/server/session", () => ({
  requireSession: jest.fn().mockResolvedValue({ token: "a-token" }),
}));

const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

beforeEach(() => jest.clearAllMocks());

describe("createCollectionHost", () => {
  it("expires the cached host lists so the new host shows at once", async () => {
    mockedApiPost.mockResolvedValue({ data: { id: 7 } });

    await createCollectionHost(3, {
      name: "Host A",
      context: QueryContext.BUNNY,
    });

    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.collectionHosts);
    expect(refresh).not.toHaveBeenCalled();
  });
});
