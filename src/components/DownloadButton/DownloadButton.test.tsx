import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotifyProvider } from "@/providers/NotifyProvider";
import DownloadButton, {
  AvailableFormats,
  DownloadButtonProps,
} from "./DownloadButton";

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

  it("navigates to the href the caller builds for the chosen format", async () => {
    const anchors = spyOnCreatedAnchor();

    renderButton({
      label: "query",
      formats: [AvailableFormats.JSON],
      buildHref: (format) => `/api/download/queries/0f3a-1234?format=${format}`,
    });

    await chooseFormat(user, AvailableFormats.JSON);

    expect(anchors).toHaveLength(1);
    expect(anchors[0].getAttribute("href")).toBe(
      "/api/download/queries/0f3a-1234?format=json",
    );
  });

  it("passes the chosen format to the caller", async () => {
    const buildHref = jest.fn(() => "/api/download/term-directory");

    renderButton({
      label: "term directory",
      formats: [AvailableFormats.CSV],
      buildHref,
      isIcon: false,
    });

    await chooseFormat(user, AvailableFormats.CSV);

    expect(buildHref).toHaveBeenCalledWith(AvailableFormats.CSV);
  });

  it("does nothing when disabled", async () => {
    const anchors = spyOnCreatedAnchor();

    renderButton({
      label: "query",
      formats: [AvailableFormats.JSON],
      buildHref: () => "/api/download/queries/0f3a-1234?format=json",
      disabled: true,
    });

    await chooseFormat(user, AvailableFormats.JSON);

    expect(anchors).toHaveLength(0);
  });

  it("offers a menu item per format the caller allows", async () => {
    renderButton({
      label: "query",
      formats: [AvailableFormats.JSON, AvailableFormats.CSV],
      buildHref: (format) => `/api/download/queries/0f3a-1234?format=${format}`,
    });

    await user.click(screen.getByTestId("download-button"));

    const menu = await screen.findByRole("menu");

    expect(
      within(menu)
        .getAllByRole("menuitem")
        .map((item) => item.textContent),
    ).toEqual(["JSON", "CSV"]);
  });
});
