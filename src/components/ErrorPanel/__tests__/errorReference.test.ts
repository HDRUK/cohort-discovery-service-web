import { errorReference } from "../errorReference";

const serverError = (digest: unknown): Error =>
  Object.assign(
    new Error("An error occurred in the Server Components render."),
    {
      digest,
    },
  );

describe("errorReference", () => {
  it("returns the digest Next attaches to a server error", () => {
    expect(errorReference(serverError("2817394651"))).toBe("2817394651");
  });

  it("returns nothing for an error without a digest", () => {
    expect(errorReference(new Error("Client failure"))).toBeUndefined();
  });

  it("returns nothing for a digest that isn't a string", () => {
    expect(errorReference(serverError(42))).toBeUndefined();
  });

  it("returns nothing when a non-error value was thrown", () => {
    expect(errorReference("boom")).toBeUndefined();
  });
});
