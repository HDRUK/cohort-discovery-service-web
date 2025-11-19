import "@testing-library/jest-dom";
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

const mockSearchParams = new URLSearchParams("page=1&per_page=5");
const mockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

let counter = 0;
jest.mock("uuid", () => ({
  v4: jest.fn(() => `mocked-uuid-${++counter}`),
}));
