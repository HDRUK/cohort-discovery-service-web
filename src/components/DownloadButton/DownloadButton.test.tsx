import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotifyProvider } from "@/providers/NotifyProvider";
import { AvailableFormats } from "@/config/downloads";
import DownloadButton, { DownloadButtonProps } from "./DownloadButton";

const renderButton = (props: DownloadButtonProps) =>
  render(
    <NotifyProvider>
      <DownloadButton {...props} />
    </NotifyProvider>,
  );

const spyOnCreatedAnchor = () => {
  const realCreateElement = document.createElement.bind(document);
  const anchors: HTMLAnchorElement[] = [];

  jest.spyOn(document, "createElement").mockImplementation((tagName) => {
    const el = realCreateElement(tagName);

    if (String(tagName).toLowerCase() === "a") {
      anchors.push(el as HTMLAnchorElement);
    }

    return el;
  });

  return anchors;
};

const chooseFormat = async (
  user: ReturnType<typeof userEvent.setup>,
  format: AvailableFormats,
) => {
  await user.click(screen.getByTestId("download-button"));

  const menu = await screen.findByRole("menu");

  await user.click(
    await within(menu).findByRole("menuitem", {
      name: new RegExp(format, "i"),
    }),
  );
};

describe("DownloadButton", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.useFakeTimers();
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("builds a pid-keyed href for a resource download", async () => {
    const anchors = spyOnCreatedAnchor();

    renderButton({
      entity: "queries",
      pids: ["0f3a-1234"],
      formats: [AvailableFormats.JSON],
    });

    await chooseFormat(user, AvailableFormats.JSON);

    expect(anchors).toHaveLength(1);
    expect(anchors[0].getAttribute("href")).toBe(
      "/api/download/queries/0f3a-1234?format=json",
    );
  });

  it("builds a pid-less href for an export, forwarding the caller's params", async () => {
    const anchors = spyOnCreatedAnchor();

    renderButton({
      entity: "term-directory",
      params: "domain=Condition&search_term=asthma",
      formats: [AvailableFormats.CSV],
      isIcon: false,
    });

    await chooseFormat(user, AvailableFormats.CSV);

    expect(anchors).toHaveLength(1);

    const { pathname, searchParams } = new URL(
      anchors[0].getAttribute("href")!,
      "http://localhost",
    );

    expect(pathname).toBe("/api/download/term-directory");
    expect(searchParams.get("domain")).toBe("Condition");
    expect(searchParams.get("search_term")).toBe("asthma");
    expect(searchParams.get("format")).toBe("csv");
  });

  it("downloads once per pid", async () => {
    const anchors = spyOnCreatedAnchor();

    renderButton({
      entity: "queries",
      pids: ["one", "two"],
      formats: [AvailableFormats.JSON],
    });

    await chooseFormat(user, AvailableFormats.JSON);

    expect(anchors.map((a) => a.getAttribute("href"))).toEqual([
      "/api/download/queries/one?format=json",
      "/api/download/queries/two?format=json",
    ]);
  });

  it("does nothing when an entity needing a pid has none selected", async () => {
    const anchors = spyOnCreatedAnchor();

    renderButton({
      entity: "queries",
      pids: [],
      formats: [AvailableFormats.JSON],
    });

    await chooseFormat(user, AvailableFormats.JSON);

    expect(anchors).toHaveLength(0);
  });

  it("does nothing when disabled", async () => {
    const anchors = spyOnCreatedAnchor();

    renderButton({
      entity: "queries",
      pids: ["0f3a-1234"],
      formats: [AvailableFormats.JSON],
      disabled: true,
    });

    await chooseFormat(user, AvailableFormats.JSON);

    expect(anchors).toHaveLength(0);
  });

  it("offers every format the registry allows when none are given", async () => {
    renderButton({ entity: "queries", pids: ["0f3a-1234"] });

    await user.click(screen.getByTestId("download-button"));

    const menu = await screen.findByRole("menu");

    expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((item) => item.textContent),
    ).toEqual(["JSON", "CSV"]);
  });
});
