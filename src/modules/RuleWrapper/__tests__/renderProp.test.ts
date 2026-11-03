import { resolveRenderProp, RenderProp } from "../renderProp";

const STATE = { isSelected: true };

describe("resolveRenderProp", () => {
  it("returns a plain value unchanged", () => {
    expect(resolveRenderProp<[typeof STATE]>("Header", STATE)).toBe("Header");
  });

  it("returns null so a region can be hidden", () => {
    expect(resolveRenderProp<[typeof STATE]>(null, STATE)).toBeNull();
  });

  it("returns undefined so the caller can fall back to a default", () => {
    expect(resolveRenderProp<[typeof STATE]>(undefined, STATE)).toBeUndefined();
  });

  it("calls a function with the given arguments", () => {
    const prop: RenderProp<[typeof STATE, string]> = (state, fallback) =>
      state.isSelected ? fallback : null;

    expect(resolveRenderProp(prop, STATE, "Default")).toBe("Default");
  });
});
