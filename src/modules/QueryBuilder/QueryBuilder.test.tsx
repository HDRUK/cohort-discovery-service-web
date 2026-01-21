import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QueryBuilder from "./QueryBuilder";

import { getQueryJson } from "./__mocks__/getQueryJson";

import MockDaphneStore from "@/store/MockDaphneStore";
const setQueryBuilderJson = jest.fn();

describe("QueryBuilder", () => {
  const renderComponent = () => {
    const query = getQueryJson();
    const rendered = render(
      <MockDaphneStore
        overrides={{
          queryBuilder: { queryBuilderJson: query, setQueryBuilderJson },
        }}
      >
        <QueryBuilder />
      </MockDaphneStore>,
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
      scope.getByText("Moderna - SARS-CoV-2 (COVID-19) vaccine"),
    ).toBeInTheDocument();

    scope = within(groupRules[1] as HTMLInputElement);
    expect(scope.getByText("OR")).toBeInTheDocument();

    scope = within(groupRules[2] as HTMLInputElement);
    expect(
      scope.getByText("Pfizer - SARS-CoV-2 (COVID-19) vaccine"),
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
      expect(scope.getByText(expectedTexts[i])).toBeInTheDocument();
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
      allRules().findIndex((el) => within(el).queryByText(text));

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
    expect(within(lastCard).getByText(TARGET_TEXT)).toBeInTheDocument();
  });
});
