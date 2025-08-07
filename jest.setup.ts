import "@testing-library/jest-dom";
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

const mockSearchParams = new URLSearchParams("page=1&per_page=5");

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));
