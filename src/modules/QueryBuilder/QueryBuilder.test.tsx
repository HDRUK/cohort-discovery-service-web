import "@testing-library/jest-dom";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QueryBuilder from "./QueryBuilder";

import { getQueryJson } from "./__mocks__/getQueryJson";

import MockDaphneStore from "@/store/MockDaphneStore";
const setQueryBuilderJson = jest.fn();

const mockRectsForSortableRules = () => {
  const rules = screen.getAllByTestId("sortable-rule");
  rules.forEach((el, i) => {
    const top = i * 100;
    const height = 80;
    const left = 0;
    const width = 800;
    const rect = {
      x: left,
      y: top,
      top,
      bottom: top + height,
      left,
      right: left + width,
      width,
      height,
      toJSON: () => {},
    } as DOMRect;

    el.getBoundingClientRect = jest.fn(() => rect);
  });
};

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
      </MockDaphneStore>
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
      '[data-testid="clickable-card"]'
    );
    expect(groupCard).toBeInTheDocument();

    let scope = within(groupCard as HTMLInputElement);
    const groupRules = scope.getAllByTestId("sortable-rule");
    expect(groupRules).toHaveLength(3);

    scope = within(groupRules[0] as HTMLInputElement);
    expect(
      scope.getByText("Moderna - SARS-CoV-2 (COVID-19) vaccine")
    ).toBeInTheDocument();

    scope = within(groupRules[1] as HTMLInputElement);
    expect(scope.getByText("OR")).toBeInTheDocument();

    scope = within(groupRules[2] as HTMLInputElement);
    expect(
      scope.getByText("Pfizer - SARS-CoV-2 (COVID-19) vaccine")
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
    renderComponent();

    const TARGET_TEXT =
      "Oxford, AstraZeneca - SARS-CoV-2 (COVID-19) vaccine AZD1222";

    mockRectsForSortableRules();

    const allRules = () => screen.getAllByTestId("sortable-rule");
    const indexOfRuleByText = (text: string) =>
      allRules().findIndex((el) => within(el).queryByText(text));

    const initialIndex = indexOfRuleByText(TARGET_TEXT);
    expect(initialIndex).toBeGreaterThanOrEqual(0);
    const lastIndexBefore = allRules().length - 1;
    expect(initialIndex).not.toBe(lastIndexBefore);

    const startCard = allRules()[initialIndex];

    jest.spyOn(startCard, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 0,
      right: 300,
      bottom: 50,
      width: 200,
      height: 50,
      x: 100,
      y: 0,
      toJSON: () => {},
    } as DOMRect);
    fireEvent.mouseMove(startCard, { clientX: 100, clientY: 10 });

    const dragHandleStart = startCard.querySelector(
      '[aria-label="Drag"]'
    ) as HTMLElement;

    expect(dragHandleStart).toBeTruthy();

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
