import { useRef, useEffect, type RefObject } from "react";

const isProd = process.env.NODE_ENV === "production";
const useDebug = process.env.NEXT_PUBLIC_USE_DEBUG_LOGS === "true";

type Deps = Readonly<Record<string, unknown>>;

function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function isRef<T = unknown>(value: unknown): value is RefObject<T> {
  return isObject(value) && "current" in value;
}

function summarise(value: unknown): string {
  if (isFunction(value)) return `fn(${value.name || "anonymous"})`;
  if (isRef(value)) return `ref(${summarise(value.current)})`;
  if (isObject(value)) {
    return JSON.stringify(value);
    const ctorName = value.constructor?.name as unknown as string | undefined;
    return ctorName || "object";
  }
  return String(value);
}

type Options = {
  enabled?: boolean;
  pretty?: boolean;
};

function useLogDependencyChanges(
  tag: string,
  depsObj: Deps,
  options?: Options
): void {
  const { enabled = !isProd && useDebug, pretty = true } = options ?? {};

  const prev = useRef<Deps>(depsObj);

  useEffect(() => {
    if (!enabled) {
      prev.current = depsObj;
      return;
    }

    const changes: Array<{ dep: string; prev: string; next: string }> = [];
    for (const key of Object.keys(depsObj)) {
      const prevVal = prev.current[key];
      const nextVal = depsObj[key];
      if (!Object.is(prevVal, nextVal)) {
        changes.push({
          dep: key,
          prev: summarise(prevVal),
          next: summarise(nextVal),
        });
      }
    }

    if (changes.length) {
      if (pretty) {
        console.groupCollapsed(`[${tag}] deps changed (${changes.length})`);
        console.table(changes);
        console.groupEnd();
      } else {
        console.log(`[${tag}] deps changed`, changes);
      }
    }

    prev.current = depsObj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(depsObj));
}

export { useLogDependencyChanges };
