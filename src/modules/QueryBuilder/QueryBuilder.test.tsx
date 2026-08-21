import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QueryBuilder from "./QueryBuilder";

import { getQueryJson } from "./__mocks__/getQueryJson";

import MockCohortDiscoveryServiceStore from "@/store/MockCohortDiscoveryServiceStore";
import { Query } from "@/types/api";

let mockUrlQueryPid: string | null = null;
jest.mock("@/hooks/useSearchParams", () => ({
  __esModule: true,
  default: () => ({
    searchParams: {
      get: (name: string) => (name === "query" ? mockUrlQueryPid : null),
    },
    getSearchParam: jest.fn(),
    setSearchParam: jest.fn(),
    setSearchParams: jest.fn(),
    clearSearchParams: jest.fn(),
  }),
}));

const setQueryBuilderJson = jest.fn();

describe("QueryBuilder", () => {
  describe("hydration from the server query prop (DP-1057)", () => {
    const editedQuery: Query = {
      id: 1,
      pid: "query-b",
      name: "Query B",
      definition: getQueryJson({
        demographics: { age: null, sex: [], race: [], location: null },
      }),
      created_at: "2024-01-01T00:00:00Z",
      tasks: [],
    };

    const renderWithQuery = () =>
      render(
        <MockCohortDiscoveryServiceStore
          overrides={{
            queryBuilder: {
              queryBuilderJson: getQueryJson(),
              setQueryBuilderJson,
            },
          }}
        >
          <QueryBuilder query={editedQuery} />
        </MockCohortDiscoveryServiceStore>,
      );

    beforeEach(() => {
      setQueryBuilderJson.mockClear();
      mockUrlQueryPid = null;
    });

    it("does not hydrate when the prop pid does not match the URL query pid", () => {
      mockUrlQueryPid = "some-other-query";
      renderWithQuery();

      expect(setQueryBuilderJson).not.toHaveBeenCalledWith(
        editedQuery.definition,
      );
    });

    it("hydrates when the prop pid matches the URL query pid", () => {
      mockUrlQueryPid = "query-b";
      renderWithQuery();

      expect(setQueryBuilderJson).toHaveBeenCalledWith(editedQuery.definition);
    });
  });

  const renderComponent = () => {
    const query = getQueryJson();
    const rendered = render(
      <MockCohortDiscoveryServiceStore
        overrides={{
          queryBuilder: { queryBuilderJson: query, setQueryBuilderJson },
        }}
      >
        <QueryBuilder />
      </MockCohortDiscoveryServiceStore>,
    );
    return rendered;
  };

  it("renders query in the builder", async () => {
    renderComponent();

    const rules = screen.getAllByTestId("sortable-rule");
    expect(rules).toHaveLength(12);

    const groupHeadings = screen.getAllByRole("heading", { name: /group/i });
    expect(groupHeadings).toHaveLength(1);

    const groupCard = groupHeadings[0].closest(
      '[data-testid="clickable-card"]',
    );
    expect(groupCard).toBeInTheDocument();

    let scope = within(groupCard as HTMLInputElement);
    const groupRules = scope.getAllByTestId("sortable-rule");
    expect(groupRules).toHaveLength(3);

    scope = within(groupRules[0] as HTMLInputElement);
    expect(
      scope.getByText("Moderna - SARS-CoV-2 (COVID-19) vaccine", {
        exact: false,
      }),
    ).toBeInTheDocument();

    scope = within(groupRules[1] as HTMLInputElement);
    expect(scope.getByText("OR")).toBeInTheDocument();

    scope = within(groupRules[2] as HTMLInputElement);
    expect(
      scope.getByText("Pfizer - SARS-CoV-2 (COVID-19) vaccine", {
        exact: false,
      }),
    ).toBeInTheDocument();

    const ruleHeadings = screen.getAllByRole("heading", { name: /rule/i });
    expect(ruleHeadings).toHaveLength(6);

    const expectedTexts = [
      "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222",
      "Close contact with confirmed COVID-19 case person/patient",
      "SARS-CoV-2 antibody to nucleocapsid (N) protein present",
      "Chronic kidney disease stage 3",
    ];

    ruleHeadings.slice(2).map((heading, i) => {
      const ruleCard = heading.closest('[data-testid="clickable-card"]');
      const scope = within(ruleCard as HTMLElement);
      expect(
        scope.getByText(expectedTexts[i], {
          exact: false,
        }),
      ).toBeInTheDocument();
      return;
    });
  });

  it("moves the selected rule to the bottom after drag-and-drop", async () => {
    const user = userEvent.setup();
    renderComponent();

    const TARGET_TEXT =
      "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222";

    const allRules = () => screen.getAllByTestId("sortable-rule");
    const indexOfRuleByText = (text: string) =>
      allRules().findIndex((el) =>
        within(el).queryByText(text, { exact: false }),
      );

    const initialIndex = indexOfRuleByText(TARGET_TEXT);
    expect(initialIndex).toBeGreaterThanOrEqual(0);
    const lastIndexBefore = allRules().length - 1;
    expect(initialIndex).not.toBe(lastIndexBefore);

    const startCard = allRules()[initialIndex];

    const wrapper = startCard.closest(
      '[data-testid="sortable-rule"]',
    ) as HTMLElement;
    expect(wrapper).toBeTruthy();

    expect(within(wrapper).queryByLabelText("Drag")).not.toBeInTheDocument();

    await user.hover(wrapper);

    const dragHandleStart = await within(wrapper).findByLabelText("Drag");
    expect(dragHandleStart).toBeVisible();

    await userEvent.pointer([
      { target: dragHandleStart, keys: "[MouseLeft>]" },
    ]);

    const farPastLastY = (lastIndexBefore + 5) * 100;
    await userEvent.pointer([
      { coords: { clientX: 10, clientY: farPastLastY } },
    ]);

    await userEvent.pointer([{ keys: "[/MouseLeft]" }]);

    const lastIndexAfter = allRules().length - 1;
    const finalIndex = indexOfRuleByText(TARGET_TEXT);

    expect(finalIndex).toBe(lastIndexAfter);

    const lastCard = allRules()[lastIndexAfter];
    expect(
      within(lastCard).getByText(TARGET_TEXT, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });
});
