import { act, render, renderHook, screen } from "@testing-library/react";
import { Component, ReactNode } from "react";
import { useLatestPromise } from "../useLatestPromise";

const deferred = <T,>() => {
  let resolve: (value: T) => void = () => {};
  let reject: (error: unknown) => void = () => {};
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const renderLatestPromise = (promise: Promise<string>) =>
  renderHook(({ promise }) => useLatestPromise(promise), {
    initialProps: { promise },
  });

class CaughtError extends Component<
  { children: ReactNode },
  { message?: string }
> {
  state: { message?: string } = {};

  static getDerivedStateFromError(error: Error) {
    return { message: error.message };
  }

  render() {
    return this.state.message ?? this.props.children;
  }
}

const ReadsLatestPromise = ({ promise }: { promise: Promise<string> }) => (
  <>{useLatestPromise(promise).value}</>
);

describe("useLatestPromise", () => {
  it("is pending with no value until the first promise resolves", async () => {
    const first = deferred<string>();
    const { result } = renderLatestPromise(first.promise);

    expect(result.current).toEqual({ value: undefined, isPending: true });

    await act(async () => first.resolve("first"));

    expect(result.current).toEqual({ value: "first", isPending: false });
  });

  it("keeps the previous value while a new promise is pending", async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const { result, rerender } = renderLatestPromise(first.promise);
    await act(async () => first.resolve("first"));

    rerender({ promise: second.promise });

    expect(result.current).toEqual({ value: "first", isPending: true });

    await act(async () => second.resolve("second"));

    expect(result.current).toEqual({ value: "second", isPending: false });
  });

  it("ignores a superseded promise that resolves after the latest one", async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const { result, rerender } = renderLatestPromise(first.promise);

    rerender({ promise: second.promise });
    await act(async () => second.resolve("second"));
    await act(async () => first.resolve("first"));

    expect(result.current).toEqual({ value: "second", isPending: false });
  });

  it("throws the rejection so the nearest error boundary handles it", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const failing = deferred<string>();
    render(
      <CaughtError>
        <ReadsLatestPromise promise={failing.promise} />
      </CaughtError>,
    );

    await act(async () => failing.reject(new Error("API unavailable")));

    expect(screen.getByText("API unavailable")).toBeInTheDocument();
  });
});
