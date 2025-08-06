import "@testing-library/jest-dom";
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));
