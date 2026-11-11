import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { ApiError } from "@/lib/https";
import {
  CreateCollectionConfigPost,
  CreateCollectionPost,
  DistributionJobType,
} from "@/types/api";
import { QueryContext } from "@/types/context";
import createCollectionWithConfig from "../createCollectionWithConfig";

jest.mock("@/server/api", () => ({ apiPost: jest.fn() }));

jest.mock("@/server/session", () => ({
  requireSession: jest.fn().mockResolvedValue({ token: "a-token" }),
}));

const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

const collection = (
  overrides: Partial<CreateCollectionPost> = {},
): CreateCollectionPost => ({
  name: "Cohort A",
  description: "A test collection",
  type: QueryContext.BUNNY,
  host_id: 3,
  url: null,
  custodian_id: "custodian-1",
  pid: "",
  ...overrides,
});

const CONFIG: Omit<CreateCollectionConfigPost, "collection_id"> = {
  run_time_hour: 1,
  run_time_minute: 30,
  frequency_mode: 1,
  run_time_frequency: 0,
  enabled: 1,
  type: DistributionJobType.DEMOGRAPHICS,
};

beforeEach(() => jest.clearAllMocks());

describe("createCollectionWithConfig", () => {
  it("refreshes when the config step fails after the collection is created", async () => {
    mockedApiPost
      .mockResolvedValueOnce({ data: { id: 42 } })
      .mockRejectedValueOnce(new ApiError(422, "Invalid config"));

    await expect(
      createCollectionWithConfig(collection(), CONFIG),
    ).rejects.toThrow("Invalid config");

    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
