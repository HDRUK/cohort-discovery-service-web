import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { DEFAULT_FLAGS } from "@/config/featureFlags";
import { QueryBuilderSkeleton } from "./QueryBuilderSkeleton";

const renderWithNlp = (enabled: boolean) =>
  render(
    <MockCohortDiscoveryServiceStore
      overrides={{
        featureFlags: { flags: { ...DEFAULT_FLAGS, "query-nlp": enabled } },
      }}
    >
      <QueryBuilderSkeleton />
    </MockCohortDiscoveryServiceStore>,
  );

describe("QueryBuilderSkeleton", () => {
  it("points to the search box when the search bar is on", () => {
    renderWithNlp(true);

    expect(screen.getByText(/Natural Language search box/)).toBeInTheDocument();
  });

  it("only points to the Insert menu when the search bar is off", () => {
    renderWithNlp(false);

    expect(
      screen.queryByText(/Natural Language search box/),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/using the buttons under 'Insert'/),
    ).toBeInTheDocument();
  });
});
