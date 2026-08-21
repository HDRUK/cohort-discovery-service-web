import {
  getYouTubeEmbedUrl,
  getYouTubeId,
  getYouTubeThumbnail,
} from "@/utils/youtube";

const ID = "4VMIaRECW4c";

describe("getYouTubeId", () => {
  it.each([
    ["youtu.be short link", `https://youtu.be/${ID}`],
    ["youtu.be with si param", `https://youtu.be/${ID}?si=yOOV0RSHJCEwWVHF`],
    ["watch url", `https://www.youtube.com/watch?v=${ID}`],
    [
      "watch url with playlist params",
      `https://www.youtube.com/watch?v=${ID}&list=PLBI5k9SgYrIvz&index=4&feature=oembed`,
    ],
    ["embed url", `https://www.youtube.com/embed/${ID}`],
    [
      "embed url with params",
      `https://www.youtube.com/embed/${ID}?list=PLBI5k9SgYrIvz&index=4&feature=oembed`,
    ],
    ["embed url with si param", `https://www.youtube.com/embed/${ID}?si=abc123`],
    ["shorts url", `https://www.youtube.com/shorts/${ID}`],
    ["shorts url with param", `https://www.youtube.com/shorts/${ID}?feature=share`],
    ["mobile watch url", `https://m.youtube.com/watch?v=${ID}`],
    ["no-www watch url", `https://youtube.com/watch?v=${ID}`],
    ["http watch url", `http://www.youtube.com/watch?v=${ID}`],
    ["nocookie embed url", `https://www.youtube-nocookie.com/embed/${ID}`],
    ["bare id", ID],
    ["link with surrounding whitespace", `  https://youtu.be/${ID}  `],
  ])("extracts the id from a %s", (_label, input) => {
    expect(getYouTubeId(input)).toBe(ID);
  });

  it.each([
    ["empty string", ""],
    ["whitespace only", "   "],
    ["non-url garbage", "not a url"],
    ["wrong-length id", "https://youtu.be/tooshort"],
    ["non-youtube host", "https://vimeo.com/123456789"],
    ["youtube url without a video id", "https://www.youtube.com/feed/subscriptions"],
  ])("returns null for %s", (_label, input) => {
    expect(getYouTubeId(input)).toBeNull();
  });
});

describe("getYouTubeEmbedUrl", () => {
  it("normalises any link to the canonical embed url, dropping stray params", () => {
    expect(
      getYouTubeEmbedUrl(
        `https://www.youtube.com/watch?v=${ID}&list=PLBI5k9SgYrIvz&index=4`,
      ),
    ).toBe(`https://www.youtube.com/embed/${ID}`);
  });

  it("returns null for an invalid link", () => {
    expect(getYouTubeEmbedUrl("not a url")).toBeNull();
  });
});

describe("getYouTubeThumbnail", () => {
  it("defaults to the maxresdefault thumbnail", () => {
    expect(getYouTubeThumbnail(`https://youtu.be/${ID}`)).toBe(
      `https://img.youtube.com/vi/${ID}/maxresdefault.jpg`,
    );
  });

  it("honours the quality override", () => {
    expect(getYouTubeThumbnail(`https://youtu.be/${ID}`, "hqdefault")).toBe(
      `https://img.youtube.com/vi/${ID}/hqdefault.jpg`,
    );
  });

  it("returns null for an invalid link", () => {
    expect(getYouTubeThumbnail("not a url")).toBeNull();
  });
});
