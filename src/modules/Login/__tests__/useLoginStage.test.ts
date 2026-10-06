import { act, renderHook } from "@testing-library/react";
import useLoginStage from "../useLoginStage";

const mockReducedMotion = (reduce: boolean) => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: reduce });
};

describe("useLoginStage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReducedMotion(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts on the landing screen", () => {
    const { result } = renderHook(() => useLoginStage());

    expect(result.current).toMatchObject({
      showLanding: true,
      isAuth: false,
      showForm: false,
      busy: false,
    });
  });

  it("staggers the move to the auth screen", () => {
    const { result } = renderHook(() => useLoginStage());

    act(() => result.current.toAuth());
    expect(result.current).toMatchObject({
      showLanding: false,
      isAuth: false,
      showForm: false,
      busy: true,
    });

    act(() => void jest.advanceTimersByTime(200));
    expect(result.current).toMatchObject({ isAuth: true, showForm: false });

    act(() => void jest.advanceTimersByTime(700));
    expect(result.current).toMatchObject({ isAuth: true, showForm: true });

    act(() => void jest.advanceTimersByTime(500));
    expect(result.current.busy).toBe(false);
  });

  it("staggers the move back to the landing screen", () => {
    const { result } = renderHook(() => useLoginStage());

    act(() => result.current.toAuth());
    act(() => void jest.advanceTimersByTime(1400));

    act(() => result.current.toLanding());
    expect(result.current).toMatchObject({ showForm: false, isAuth: true });

    act(() => void jest.advanceTimersByTime(280));
    expect(result.current.isAuth).toBe(false);

    act(() => void jest.advanceTimersByTime(720));
    expect(result.current.showLanding).toBe(true);

    act(() => void jest.advanceTimersByTime(400));
    expect(result.current.busy).toBe(false);
  });

  it("ignores a second transition while one is still running", () => {
    const { result } = renderHook(() => useLoginStage());

    act(() => result.current.toAuth());
    act(() => void jest.advanceTimersByTime(200));
    act(() => result.current.toLanding());

    expect(result.current.isAuth).toBe(true);
  });

  it("snaps between screens when the user prefers reduced motion", () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useLoginStage());

    act(() => result.current.toAuth());
    expect(result.current).toMatchObject({
      showLanding: false,
      isAuth: true,
      showForm: true,
      busy: false,
    });

    act(() => result.current.toLanding());
    expect(result.current).toMatchObject({
      showLanding: true,
      isAuth: false,
      showForm: false,
      busy: false,
    });
  });

  it("clears pending timers on unmount", () => {
    const { result, unmount } = renderHook(() => useLoginStage());

    act(() => result.current.toAuth());
    unmount();

    expect(jest.getTimerCount()).toBe(0);
  });
});
