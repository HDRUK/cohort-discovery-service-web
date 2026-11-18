import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { apiPut } from "@/server/api";
import { CollectionMetadataDocument } from "@/types/api";
import saveCollectionMetadata from "../saveCollectionMetadata";

jest.mock("@/server/api", () => ({
  apiPut: jest.fn(),
  ErrorMode: { RESULT: "result" },
}));

jest.mock("@/server/session", () => ({
  requireSession: jest.fn().mockResolvedValue({ token: "a-token" }),
}));

const mockedApiPut = apiPut as jest.MockedFunction<typeof apiPut>;

const METADATA: CollectionMetadataDocument = {
  summary: { name: "Synthetic diabetes cohort", description: "A cohort." },
};

describe("saveCollectionMetadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects metadata that is not an object without calling the API", async () => {
    const result = await saveCollectionMetadata(1, [
      "not",
      "an",
      "object",
    ] as unknown as CollectionMetadataDocument);

    expect(result.error?.code).toBe(400);
    expect(mockedApiPut).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  it("rejects an id that is not an integer", async () => {
    const result = await saveCollectionMetadata(1.5, METADATA);

    expect(result.error?.code).toBe(400);
    expect(mockedApiPut).not.toHaveBeenCalled();
  });

  it("puts the metadata and expires the collections tag", async () => {
    mockedApiPut.mockResolvedValue({ message: "success", data: null });

    await saveCollectionMetadata(7, METADATA);

    expect(mockedApiPut).toHaveBeenCalledWith(
      "a-token",
      expect.stringMatching(/\/collections\/7\/metadata$/),
      { metadata: METADATA },
      { errorMode: "result" },
    );
    expect(updateTag).toHaveBeenCalledWith(CACHE_TAGS.collections);
  });
});
