import { renderHook } from "@testing-library/react";
import useHdrukChrome from "../useHdrukChrome";
import useFeatures from "../useFeatures";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import branding from "@branding/branding.config";

jest.mock("../useFeatures");
jest.mock("@/providers/ApplicationModeProvider");
jest.mock("@branding/branding.config", () => ({
  __esModule: true,
  default: { hdrukChromeInStandalone: false },
}));

const mockFeatures = useFeatures as jest.MockedFunction<typeof useFeatures>;
const mockMode = useApplicationMode as jest.MockedFunction<
  typeof useApplicationMode
>;

const setup = ({
  hdrukTheme,
  isStandalone,
  inStandalone,
}: {
  hdrukTheme: boolean;
  isStandalone: boolean;
  inStandalone: boolean;
}) => {
  mockFeatures.mockReturnValue({ hdrukTheme } as ReturnType<typeof useFeatures>);
  mockMode.mockReturnValue({
    isStandalone,
    isIntegrated: !isStandalone,
    applicationMode: isStandalone ? "standalone" : "integrated",
  });

  branding.hdrukChromeInStandalone = inStandalone;

  return renderHook(() => useHdrukChrome()).result.current;
};

describe("useHdrukChrome", () => {
  it("uses HDR UK chrome in integrated mode", () => {
    expect(
      setup({ hdrukTheme: true, isStandalone: false, inStandalone: false }),
    ).toBe(true);
  });

  it("falls back to neutral chrome in standalone by default", () => {
    expect(
      setup({ hdrukTheme: true, isStandalone: true, inStandalone: false }),
    ).toBe(false);
  });

  it("lets a deployment opt back into HDR UK chrome in standalone", () => {
    expect(
      setup({ hdrukTheme: true, isStandalone: true, inStandalone: true }),
    ).toBe(true);
  });

  it("lets the feature flag force neutral chrome in integrated mode", () => {
    expect(
      setup({ hdrukTheme: false, isStandalone: false, inStandalone: false }),
    ).toBe(false);
  });

  it("keeps chrome off when the flag is off even if standalone opts in", () => {
    expect(
      setup({ hdrukTheme: false, isStandalone: true, inStandalone: true }),
    ).toBe(false);
  });
});
