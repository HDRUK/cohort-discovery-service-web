import { canonicaliseQueryString } from "@/utils/string";

describe("canonicaliseQueryString", () => {
  it("returns an empty string for missing params", () => {
    expect(canonicaliseQueryString()).toBe("");
    expect(canonicaliseQueryString("")).toBe("");
    expect(canonicaliseQueryString(new URLSearchParams())).toBe("");
  });

  it("is independent of repeated-value ordering", () => {
    const a = new URLSearchParams();
    a.append("collection_pid[]", "b");
    a.append("collection_pid[]", "a");
    a.append("collection_pid[]", "c");

    const b = new URLSearchParams();
    b.append("collection_pid[]", "c");
    b.append("collection_pid[]", "a");
    b.append("collection_pid[]", "b");

    expect(canonicaliseQueryString(a)).toBe(canonicaliseQueryString(b));
  });

  it("is independent of key ordering", () => {
    expect(canonicaliseQueryString("per_page=100&page=1")).toBe(
      canonicaliseQueryString("page=1&per_page=100"),
    );
  });

  it("sorts by key then value deterministically", () => {
    expect(canonicaliseQueryString("b=2&a=2&a=1")).toBe("a=1&a=2&b=2");
  });

  it("accepts both string and URLSearchParams inputs equivalently", () => {
    const params = new URLSearchParams("page=1&per_page=100");
    expect(canonicaliseQueryString(params)).toBe(
      canonicaliseQueryString("page=1&per_page=100"),
    );
  });
});
