import { act, render, RenderResult, screen } from "@testing-library/react";
import { startTransition, use } from "react";
import SearchParamsSuspense from "./SearchParamsSuspense";

let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

const UNFINISHED_REQUEST = new Promise<string>(() => {});

const Rows = ({ request }: { request: Promise<string> }) => <>{use(request)}</>;

const page = (request: Promise<string>) => (
  <SearchParamsSuspense fallback="Loading terms">
    <Rows request={request} />
  </SearchParamsSuspense>
);

const renderLoadedPage = async () => {
  mockSearchParams = new URLSearchParams("domain=condition");
  let view = {} as RenderResult;
  await act(async () => {
    view = render(page(Promise.resolve("Condition terms")));
  });
  return view;
};

describe("SearchParamsSuspense", () => {
  it("shows the fallback until its children have loaded", async () => {
    await act(async () => render(page(UNFINISHED_REQUEST)));

    expect(screen.getByText("Loading terms")).toBeInTheDocument();
  });

  it("shows the fallback again when a navigation changes the search params", async () => {
    const { rerender } = await renderLoadedPage();

    await act(async () =>
      startTransition(() => {
        mockSearchParams = new URLSearchParams("domain=drug");
        rerender(page(UNFINISHED_REQUEST));
      }),
    );

    expect(screen.getByText("Loading terms")).toBeInTheDocument();
    expect(screen.queryByText("Condition terms")).not.toBeInTheDocument();
  });

  it("keeps the loaded content when a navigation leaves the search params unchanged", async () => {
    const { rerender } = await renderLoadedPage();

    await act(async () =>
      startTransition(() => rerender(page(UNFINISHED_REQUEST))),
    );

    expect(screen.getByText("Condition terms")).toBeInTheDocument();
  });
});
