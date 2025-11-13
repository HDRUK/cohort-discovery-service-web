import "@testing-library/jest-dom";
import { useRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MarqueeSelection from "./MarqueeSelection";

function setRect(el: HTMLElement, rect: Partial<DOMRect>) {
  const full: DOMRect = {
    x: rect.left ?? 0,
    y: rect.top ?? 0,
    top: rect.top ?? 0,
    left: rect.left ?? 0,
    right: (rect.left ?? 0) + (rect.width ?? 0),
    bottom: (rect.top ?? 0) + (rect.height ?? 0),
    width: rect.width ?? 0,
    height: rect.height ?? 0,
    toJSON: () => {},
  } as DOMRect;
  jest.spyOn(el, "getBoundingClientRect").mockReturnValue(full);
}

function TestHarness({
  onChange,
  onEnd,
  requireModifierKey = "Shift",
  ignoreWhenInside = '[data-draggable="true"]',
}: {
  onChange?: (ids: string[], deselectedIds: string[]) => void;
  onEnd?: (ids: string[]) => void;
  requireModifierKey?: "Shift" | "Alt" | "Meta" | "Control" | null;
  ignoreWhenInside?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div
        ref={ref}
        data-testid="container"
        style={{
          position: "relative",
          width: 400,
          height: 300,
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      >
        {/* Three selectable items laid out vertically */}
        <div
          data-testid="item-a"
          data-selectable="true"
          data-id="A"
          style={{ width: 200, height: 60 }}
        >
          A
        </div>
        <div
          data-testid="item-b"
          data-selectable="true"
          data-id="B"
          data-draggable="true"
          style={{ width: 200, height: 60, marginTop: 20 }}
        >
          B (draggable)
        </div>
        <div
          data-testid="item-c"
          data-selectable="true"
          data-id="C"
          style={{ width: 200, height: 60, marginTop: 20 }}
        >
          C
        </div>

        {/* MarqueeSelection renders into the container via portal */}
        <MarqueeSelection
          containerRef={ref}
          onChange={onChange}
          onEnd={onEnd}
          requireModifierKey={requireModifierKey}
          ignoreWhenInside={ignoreWhenInside}
        />
      </div>
    </div>
  );
}

describe("MarqueeSelection", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("selects items intersecting the marquee and ignores items inside ignoreWhenInside", async () => {
    const onChange = jest.fn();
    render(<TestHarness onChange={onChange} />);

    const container = screen.getByTestId("container");
    const itemA = screen.getByTestId("item-a");
    const itemB = screen.getByTestId("item-b");
    const itemC = screen.getByTestId("item-c");

    setRect(container, { left: 0, top: 0, width: 400, height: 300 });
    setRect(itemA, { left: 10, top: 10, width: 200, height: 60 });
    setRect(itemB, { left: 10, top: 100, width: 200, height: 60 });
    setRect(itemC, { left: 10, top: 190, width: 200, height: 60 });

    const user = userEvent.setup();
    await user.keyboard("{Shift>}");

    await user.pointer([
      { target: container, keys: "[MouseLeft>]", coords: { x: 10, y: 10 } },
      { coords: { x: 380, y: 180 } },
      { keys: "[/MouseLeft]" },
    ]);

    await user.keyboard("{/Shift}");

    let lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall).toBeTruthy();

    let [selected] = lastCall;
    expect(selected).toEqual(["A", "B"]);

    await user.keyboard("{Shift>}");

    await user.pointer([
      { target: container, keys: "[MouseLeft>]", coords: { x: 10, y: 10 } },
      { coords: { x: 380, y: 300 } },
      { keys: "[/MouseLeft]" },
    ]);

    await user.keyboard("{/Shift}");

    lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall).toBeTruthy();

    [selected] = lastCall;
    expect(selected).toEqual(["A", "B", "C"]);
  });
});
